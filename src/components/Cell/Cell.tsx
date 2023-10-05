import { useEffect, useState } from 'react';
import { useDrop, useDrag, DragPreviewImage } from 'react-dnd';
import { GardenKeys } from '../Main/Main';
import { CellKeys, GridProps } from '../Grid/Grid';
import CellActions from '../CellActions/CellActions';
import { patchCellContents, patchDisabledOrRemoved, StatusType } from '../../apiCalls';
import './Cell.scss'
import { set } from 'cypress/types/lodash';

interface GridCell extends GridProps {
  id: string;
  toggleModal: () => void;
}

export interface CellContents {
  plant: CellKeys;
}

// const WATERING_SCHEDULE = {
//   'Minimum': 7,
//   'Average': 3,
//   'Frequent': 1
// }

const WATERING_SCHEDULE = {
  'Minimum': 1 / (24),           // 1hr
  'Average': 1 / (24 * 60),      // 1min
  'Frequent': 1 / (24 * 60 * 60) // 1sec
}

const Cell = ({ id, garden, setGarden, waterGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden, toggleModal }: GridCell) => {
  // eslint-disable-next-line
  const [apiError, setApiError] = useState<string>('');
  // eslint-disable-next-line
  const [cell, setCell] = useState<CellKeys | undefined>();
  const [cellContents, setCellContents] = useState<CellContents | undefined>();
  const [className, setClassName] = useState<string>('cell');
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isPlanted, setIsPlanted] = useState<boolean>(false);
  const [needsWatering, setNeedsWatering] = useState<boolean>(false);
  // eslint-disable-next-line
  const [isWatered, setIsWatered] = useState<boolean>(false);
  const [isPopulated, setIsPopulated] = useState<boolean>(false);
  const [needsUpdate, setNeedsUpdate] = useState<(keyof StatusType)>();
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [enableHoverEffect, setEnableHoverEffect] = useState(true);

  useEffect(() => {
    if (garden) {
      const foundCell = garden.find(cell => cell.location_id === id);
      if (foundCell?.status === 'placed') {
        setCellContents({ plant: foundCell });
        setIsPopulated(true);
      } else if (foundCell?.status === 'disabled') {
        setIsDisabled(true);
        !isDisabled ? setClassName('cell disabled') : setClassName('cell');
      } else if (foundCell?.status === 'locked') {
        setCellContents({ plant: foundCell });
        setIsPopulated(true);
        setIsPlanted(true);
      }

      setCell(foundCell);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isPlanted && cellContents?.plant.watering && cellContents?.plant.watering !== 'None' && typeof cellContents?.plant.updated_at !== 'undefined') {
      const today = Date.now() + new Date(cellContents?.plant.updated_at).getTimezoneOffset() * 60 * 1000
      const daysToAdd = WATERING_SCHEDULE[cellContents?.plant.watering]
      const nextWatering = new Date(cellContents?.plant.updated_at).getTime() + (daysToAdd * 24 * 60 * 60 * 1000)
      console.log(cellContents?.plant.updated_at)
      console.log(today, nextWatering)
      if (today > nextWatering) {
        setNeedsWatering(true);
      }
    }
  }, [cellContents, isPlanted])

  useEffect(() => {
    handleWatered()
    // eslint-disable-next-line
  }, [waterGarden])

  useEffect(() => {
    if (cellContents && needsUpdate) {
      patchCellContents(cellContents, id, needsUpdate, cellContents?.plant?.watering)
        .catch((err) => {
          handleApiError(err);
        });
    }
    // eslint-disable-next-line
  }, [needsUpdate]);

  useEffect(() => {
    if (needsUpdate) {
      patchDisabledOrRemoved(id, needsUpdate)
        .catch((err) => {
          handleApiError(err);
        });
    }
    // eslint-disable-next-line
  }, [isDisabled, cellContents === undefined]);

  useEffect(() => {
    if (shouldRender) {
      handleGarden(id, cellContents?.plant.image, cellContents?.plant.plant_name, cellContents?.plant.plant_id, isDisabled ? 'disabled' : 'empty');
      setShouldRender(false);
    }
    // eslint-disable-next-line
  }, [isDisabled]);

  useEffect(() => {
    if (shouldRender) {
      handleGarden(id, cellContents?.plant.image, cellContents?.plant.plant_name, cellContents?.plant.plant_id, isPopulated ? 'placed' : 'empty');
    }
    setShouldRender(false);
    // eslint-disable-next-line
  }, [isPopulated]);

  useEffect(() => {
    if (shouldRender && isPlanted) {
      handleGarden(id, cellContents?.plant.image, cellContents?.plant.plant_name, cellContents?.plant.plant_id, 'locked');
    } else if (shouldRender && isPopulated) {
      handleGarden(id, cellContents?.plant.image, cellContents?.plant.plant_name, cellContents?.plant.plant_id, 'placed');
    } else if (shouldRender && !isPopulated) {
      handleGarden(id, undefined, undefined, undefined, 'empty');
    }
    setShouldRender(false);
    // eslint-disable-next-line
  }, [isPlanted]);

  useEffect(() => {
    if (bullDoze) {
      setClassName('cell');
      handleEmptyCells();
      setBullDoze(false);
      handleGarden(id, undefined, undefined, undefined, 'empty');
    } else if (filterGarden && !isPlanted && !isDisabled) {
      handleUnplanted();
      setFilterGarden(false);
      handleGarden(id, undefined, undefined, undefined, 'empty');
    }
    // eslint-disable-next-line
  }, [bullDoze, filterGarden]);

  const [{ isOver }, dropRef] = useDrop({
    accept: 'plant',
    drop: (plant: CellContents) => {
      setCellContents(plant);
      setTimeout(() => {
        setShouldRender(true);
        setNeedsUpdate('placed');
        setIsPopulated(true);
      }, 0);
    },
    canDrop: (item, monitor) => {
      if (isDisabled || isPlanted) {
        return false;
      } else {
        return true;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const [{ isDragging }, dragRef, preview] = useDrag({
    type: 'plant',
    canDrag: () => !isPlanted,
    item: cellContents,
    end: (item, monitor) => {
      if (!monitor.didDrop() && monitor.getTargetIds().length) {
        toggleModal();
      } else if (monitor.didDrop()) {
        handleRemove();
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const handleApiError = (error: string) => {
    setApiError(error);
  }

  const handleGarden = (id: string, image: string | undefined, name: string | undefined, plant_id: number | undefined, status: string) => {
    setGarden((prevState: GardenKeys) => {
      let index = prevState?.findIndex((item) => item.location_id === id);
      let newState = [...prevState];
      newState[index] = {
        ...newState[index],
        image: image,
        plant_name: name,
        'plant_id': plant_id,
        status: status
      };
      return newState;
    });
  }

  const handlePlanted = () => {
    setIsPlanted(true);
    setShouldRender(true);
  }

  const handleWatered = async () => {
    if (cellContents) {
      try {
        await patchCellContents(cellContents, id, 'placed', cellContents?.plant?.watering)
        await patchCellContents(cellContents, id, 'locked', cellContents?.plant?.watering)
        setNeedsWatering(false)
      } catch (err) {
          handleApiError(err as string)
      }
    }
  }

  const handleRemove = () => {
    setIsPopulated(false);
    setIsPlanted(false);
    setCellContents(undefined);
    handleNeedsUpdating('empty');
    setShouldRender(true);
  }

  const handleCloseModal = () => {
    setIsClicked(false);
  }

  const handleNeedsUpdating = (status: keyof StatusType) => {
    setNeedsUpdate(status);
  }

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as Element
    if (!cellContents) {
      setIsDisabled(!isDisabled);
      !isDisabled ? setClassName('cell disabled') : setClassName('cell');
      !isDisabled ? setNeedsUpdate('disabled') : setNeedsUpdate('empty');
      setShouldRender(true);
    } else {
      setIsClicked(true);
      setEnableHoverEffect(false);
      target.classList.add('disable-scale');
      const parent = target.parentNode as Element;
      parent.classList.add('disable-hover');
    }
  }

  const handleEmptyCells = (): void => {
    setIsDisabled(false);
    setCellContents(undefined);
    setIsPopulated(false);
    setIsPlanted(false);
  }

  const handleUnplanted = (): void => {
    if (isPopulated && !isPlanted) {
      setCellContents(undefined);
      setIsPopulated(false);
    }
  }

  const hoverStyle = isOver && !isDisabled && {
    transform: 'scale(1.3)',
    backgroundColor: '#9EC924'
  }

  const divStyle = !isDisabled && {
    backgroundImage: `url(${cellContents?.plant.image})`,
    backgroundPosition: 'center',
    backgroundSize: '100%',
    border: !needsWatering && isPlanted ? 'solid #9EC924 3px' : 'solid #f4f4f4 3px'
  };

  const wateringWarning = needsWatering ? 'watering-alert' : ''

  const toggleHoverEffect = () => {
    setEnableHoverEffect(!enableHoverEffect);
  };

  const hoverEffectClass = !enableHoverEffect ? 'hidden' : '';

  return (
    <>
      {isPopulated ? (
        <>
          {!isDragging && (
            <DragPreviewImage connect={preview} src={`${process.env.PUBLIC_URL}/images/plant.png`} />
          )}
          <div
            id={id}
            data-tooltip={`${cellContents?.plant.plant_name}`}
            className={[className, wateringWarning].join(' ')}
            style={{ ...divStyle, ...hoverStyle }}
            onClick={handleClick}
            ref={(node) => {
              dragRef(node)
              dropRef(node)
            }}
          >
            <span className={`cell-tooltip-text ${hoverEffectClass}`}>{`${cellContents?.plant.plant_name}`}</span>
            {isClicked && <div className='cell-modal'>
              {cellContents && <CellActions
                image={cellContents.plant.image}
                name={cellContents.plant.plant_name}
                plantId={cellContents.plant.plant_id}
                isPlanted={isPlanted}
                handlePlanted={handlePlanted}
                handleWatered={handleWatered}
                handleRemove={handleRemove}
                handleCloseModal={handleCloseModal}
                handleNeedsUpdating={handleNeedsUpdating}
                toggleHoverEffect={toggleHoverEffect}
              />}
            </div>}
          </div>
        </>
      ) : (
        <div id={id} className={className} style={{ ...divStyle, ...hoverStyle }} onClick={handleClick} ref={dropRef}></div>
      )}
    </>
  );
}

export default Cell;