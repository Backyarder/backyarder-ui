import { useEffect, useState } from 'react';
import { useDrop, useDrag, DragPreviewImage } from 'react-dnd';
import { GardenKeys } from '../Main/Main';
import { CellKeys, GridProps } from '../Grid/Grid';
import CellActions from '../CellActions/CellActions';
import { patchCellContents, patchDisabledOrRemoved, StatusType, WateringType } from '../../apiCalls';
import './Cell.scss'

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

const Cell = ({ id, garden, setGarden, waterGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden, toggleModal, isToggled }: GridCell) => {
  // eslint-disable-next-line
  const [apiError, setApiError] = useState<string>('');
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
  const [lastUpdate, setLastUpdate] = useState<string>('');

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
      if (foundCell && foundCell.updated_at) {
        setLastUpdate(foundCell.updated_at);
      }
    }
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (isPlanted && cellContents && cellContents.plant.watering && cellContents.plant.watering !== 'None' && typeof cellContents.plant.updated_at !== 'undefined') {
      let now = Date.now() + (new Date().getTimezoneOffset() * 60 * 1000);
      let lastUpdateAdjusted = isToggled ? convertTime(lastUpdate) + (new Date().getTimezoneOffset() * 60 * 1000) : convertTime(lastUpdate);
      let interval = WATERING_SCHEDULE[cellContents?.plant.watering] * 24 * 60 * 60 * 1000;
      if ((now - lastUpdateAdjusted) >= interval) {
        setNeedsWatering(true);
      }
      setTimeout(() => {
        setNeedsWatering(true);
      }, interval - (now-lastUpdateAdjusted));
    }
  }, [cellContents, isPlanted])

  useEffect(() => {
    handleWatered()
    // eslint-disable-next-line
  }, [waterGarden])

  useEffect(() => {
    if (cellContents && needsUpdate) {
      patchCellContents(cellContents, id, needsUpdate, cellContents.plant.watering, setLastUpdate)
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
    if (shouldRender && cellContents) {
      handleGarden(id, cellContents.plant.image, cellContents.plant.plant_name, cellContents.plant.plant_id, isDisabled ? 'disabled' : 'empty', cellContents.plant.watering, handleTime());
      setShouldRender(false);
    }
    // eslint-disable-next-line
  }, [isDisabled]);

  useEffect(() => {
    if (shouldRender && cellContents) {
      handleGarden(id, cellContents.plant.image, cellContents.plant.plant_name, cellContents.plant.plant_id, isPopulated ? 'placed' : 'empty', cellContents.plant.watering, handleTime());
    }
    setShouldRender(false);
    // eslint-disable-next-line
  }, [isPopulated]);

  useEffect(() => {
    if (shouldRender && isPlanted && cellContents) {
      handleGarden(id, cellContents.plant.image, cellContents.plant.plant_name, cellContents.plant.plant_id, 'locked', cellContents.plant.watering, handleTime());
      setNeedsWatering(false);
      handleWatered();
    } else if (shouldRender && isPopulated && cellContents) {
      handleGarden(id, cellContents.plant.image, cellContents.plant.plant_name, cellContents.plant.plant_id, 'placed', cellContents.plant.watering, handleTime());
    } else if (shouldRender && !isPopulated) {
      handleGarden(id, undefined, undefined, undefined, 'empty', 'None', handleTime());
    }
    setShouldRender(false);
    // eslint-disable-next-line
  }, [isPlanted]);

  useEffect(() => {
    if (bullDoze) {
      setClassName('cell');
      handleEmptyCells();
      setBullDoze(false);
      handleGarden(id, undefined, undefined, undefined, 'empty', 'None', handleTime());
    } else if (filterGarden && !isPlanted && !isDisabled) {
      handleUnplanted();
      setFilterGarden(false);
      handleGarden(id, undefined, undefined, undefined, 'empty', 'None', handleTime());
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

  const handleGarden = (id: string, image: string | undefined, name: string | undefined, plant_id: number | undefined, status: string, watering: keyof WateringType, updated_at: string) => {
    setGarden((prevState: GardenKeys) => {
      let index = prevState?.findIndex((item) => item.location_id === id);
      let newState = [...prevState];
      newState[index] = {
        ...newState[index],
        image: image,
        plant_name: name,
        plant_id: plant_id,
        status: status,
        watering: watering,
        updated_at: updated_at
      };
      return newState;
    });
  }

  const handleTime = () => {
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year}  ${hours}:${minutes}`;
  }

  const convertTime = (dateString: string) => {
    let [datePart, timePart] = dateString.split('  ');
    let [month, day, year] = datePart.split('/').map(Number);
    let [hours, minutes] = timePart.split(':').map(Number);
    let timestamp = new Date(year, month - 1, day, hours, minutes).getTime();
    return timestamp;
  } 

  const handlePlanted = () => {
    setIsPlanted(true);
    setShouldRender(true);
  }

  const handleWatered = async () => {
    if (cellContents && cellContents.plant.watering && cellContents.plant.watering !== 'None') {
      try {
        await patchCellContents(cellContents, id, 'placed', cellContents.plant.watering, setLastUpdate)
        await patchCellContents(cellContents, id, 'locked', cellContents.plant.watering, setLastUpdate)
        setLastUpdate(handleTime());
        setNeedsWatering(false);
        let interval = WATERING_SCHEDULE[cellContents.plant.watering] * 24 * 60 * 60 * 1000;
        setTimeout(() => {
          setNeedsWatering(true);
        }, interval);
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
    setNeedsWatering(false);
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
    setNeedsWatering(false);
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

  return (
    <>
      {isPopulated ? (
        <>
          {!isDragging && (
            <DragPreviewImage connect={preview} src={`${process.env.PUBLIC_URL}/images/plant.png`} />
          )}
          <div
            id={id}
            className={[className, wateringWarning].join(' ')}
            style={{ ...divStyle, ...hoverStyle }}
            onClick={handleClick}
            ref={(node) => {
              dragRef(node)
              dropRef(node)
            }}
          >
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