import '../components/PlantCondition.css';
import WebSocketUtil from '../WebSocketUtil';

const ControlWater = () => {
  const handleWaterButtonClick = () => {
    const msg = {
      "method": 14,
      "userPlant": WebSocketUtil.selection,
      "data": {
      }
    }

    WebSocketUtil.socket.send(JSON.stringify(msg));
  };

  return (
    <div className="control-water-container">
      <h1>Water Control</h1>
      <button onClick={handleWaterButtonClick} className="water-button">
        Start Watering
      </button>
    </div>
  );
};

export default ControlWater;
