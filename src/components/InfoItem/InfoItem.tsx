import './InfoItem.css';
import checkedImg from './checkboxImages/checked_backyarder.png'
import uncheckedImg from './checkboxImages/unchecked_backyarder.png'

type Props = {
  data: string | [] | {},
  name: string
}

const InfoItem = ({data, name}: Props) => {

    return (
      <>
        <img src={data ? checkedImg : uncheckedImg} alt={data ? "checked-box" : "uncehcked-box"}/>
        <div>
          <h3>{name}</h3>
          <p>{Array.isArray(data) ? data.join(", ") : "   "}</p>
        </div>
      </>
    )
}

export default InfoItem