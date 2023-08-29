import './InfoItem.css';
import checkedImg from './checkboxImages/checked_backyarder.png'
import uncheckedImg from './checkboxImages/unchecked_backyarder.png'

type Props = {
  data: string | [] | {} | boolean,
  name: string
}

const InfoItem = ({data, name}: Props) => {

    return (
      <div className="more-info">
        <img className="checkbox" src={data ? checkedImg : uncheckedImg} alt={data ? "checked-box" : "uncehcked-box"}/>
        <div>
          <h3>{name}</h3>
          <p>{Array.isArray(data) ? `${data.join(", ")}` : ""}</p>
        </div>
      </div>
    )
}

export default InfoItem