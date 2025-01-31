import Left from './Left';
import Right from './Right';
import './weather.css';

const Weather = () => {
  return (
    <div className='card_cointainer'>
        <div className='sides'>
            <Left/>
            <Right/>
        </div>
    </div>
  )
}

export default Weather