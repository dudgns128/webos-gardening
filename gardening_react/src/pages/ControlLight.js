import { useState, useEffect } from 'react';
import '../components/PlantCondition.css';

// const bridge = new WebOSServiceBridge();

const ControlLight = () => {
  const [light, setLight] = useState(0); // 설정 될 광량 값

  const handleSliderChange = (event) => {
    setLight(event.target.value);
  };

  useEffect(() => {
    // [todo] light 제어할 수 있는 api 사용하기
  }, [light]);

  return (
    <div className="control-light-container">
      <h1>Light Control</h1>
      <input
        type="range"
        min="0"
        max="100"
        value={light}
        onChange={handleSliderChange}
        className="slider"
      />
      <p>Current light value: {light}</p>
    </div>
  );
};

export default ControlLight;
