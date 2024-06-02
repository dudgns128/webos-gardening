import '../components/PlantCondition.css';

const ControlWater = () => {
  const handleWaterButtonClick = () => {
    // [todo] 물 제어할 수 있는 api 사용하기
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
