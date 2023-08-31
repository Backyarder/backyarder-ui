import { CardProps } from "../Card/Card"

const CellActions = ({plant}: CardProps) => {
    return (
        <div>
            {plant.name}
        </div>
    )
}

export default CellActions