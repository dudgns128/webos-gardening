import { useState, useEffect } from 'react';
import '../components/PlantCondition.css';
import WebSocketUtil from '../WebSocketUtil';

const ControlLight = () => {
  const [light, setLight] = useState(0); // 설정 될 광량 값

  const handleSliderChange = (event) => {
    setLight(event.target.value);

    const msg = {
      "method": 15,
      "userPlant": WebSocketUtil.selection,
      "data": {
        "light": `"${light}"`
      }
    }

    WebSocketUtil.socket.send(JSON.stringify(msg));
  };

  return (
    <div className="control-light-container">
      <h1>Light Control</h1>
      <input
        type="range"
        min="0"
        max="100"
        value={light}
        onmouseup={handleSliderChange}
        ontouchend={handleSliderChange}
        onkeyup={handleSliderChange}
        className="slider"
      />
      <p>Current light value: {light}</p>
    </div>
  );
};

export default ControlLight;
