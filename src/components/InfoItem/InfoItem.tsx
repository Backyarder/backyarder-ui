import './InfoItem.css';
import checkedImg from './checkboxImages/checked_backyarder.png'
import uncheckedImg from './checkboxImages/unchecked_backyarder.png'

type Props = {
  data: string,
  name: string
}

const InfoItem = ({data, name}: Props) => {
    const checkIfTrue = (data: string) => {
      if (data){
        return checkedImg
      } else {
        return uncheckedImg
      }
    }

    return (
      <>
        <img src={checkIfTrue(data)}/>
        <div>
          <h3>{name}</h3>
          <p></p>
        </div>
      </>
    )
}

export default InfoItem