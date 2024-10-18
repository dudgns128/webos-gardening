import React, { useState, useEffect } from 'react';
import './PlantCondition.css';
import WebSocketUtil from '../WebSocketUtil';

const PlantConditionModal = ({ isOpen, onClose }) => {

  let [water, setWater] = useState(0);
  let [light, setLight] = useState(0);
  let [temperature, setTemperature] = useState(0);
  let [humidity, setHumidity] = useState(0);
  let [waterStatus, setWaterStatus] = useState();
  let [lightStatus, setLightStatus] = useState();
  let [temperatureStatus, setTemperatureStatus] = useState();
  let [humidityStatus, setHumidityStatus] = useState();
  let properWaterValue = localStorage.getItem('properWaterValue');
  let properWaterRange = localStorage.getItem('properWaterRange');
  let properLightValue = localStorage.getItem('properLightValue');
  let properLightRange = localStorage.getItem('properLightRange');
  let properTemperatureValue = localStorage.getItem('properTemperatureValue');
  let properTemperatureRange = localStorage.getItem('properTemperatureRange');
  let properHumidityValue = localStorage.getItem('properHumidityValue');
  let properHumidityRange = localStorage.getItem('properHumidityRange');
  let waterMin = properWaterValue - properWaterRange;
  let waterMax = waterMin + properWaterRange * 2;
  let lightMin = properLightValue - properLightRange;
  let lightMax = lightMin + properLightRange * 2;
  let temperatureMin = properTemperatureValue - properTemperatureRange;
  let temperatureMax = temperatureMin + properTemperatureRange * 2;
  let humidityMin = properHumidityValue - properHumidityRange;
  let humidityMax = humidityMin + properHumidityRange * 2;

  /*이 식에서 min max 값 조절로 부족 과다 적절 표시가능 */
  const getStatus = (value, min, max) => {
    if (value < min) {
      return '부족';
    } else if (value > max) {
      return '과다';
    } else {
      return '적절';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case '부족':
        return 'status-low';
      case '과다':
        return 'status-high';
      case '적절':
        return 'status-normal';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    WebSocketUtil.onReceivePlantConditionDataCallback = (plantData) => {
      setWater(plantData.water);
      setLight(plantData.light);
      setTemperature(plantData.temperature);
      setHumidity(plantData.humidity);
      setWaterStatus(getStatus(plantData.water, waterMin, waterMax));
      setLightStatus(getStatus(plantData.light, lightMin, lightMax));
      setTemperatureStatus(getStatus(plantData.temperature, temperatureMin, temperatureMax));
      setHumidityStatus(getStatus(plantData.humidity, humidityMin, humidityMax));
    };

    return () => {
      WebSocketUtil.onReceivePlantConditionDataCallback = undefined;
    };
  }, [isOpen]);


  if (!isOpen) {
    return null;
  }

  return (
    <div className="PlantModal">
      <div className="modal-backdrop">
        <div className="plant-container">
          <h1>환경 상태</h1>
          <div className="plant-status">
            <div className="status-item">
              <span>물 공급량:</span>
              <span className={getStatusClass(waterStatus)}>{water} ({waterStatus})</span>
            </div>
            <div className="status-item">
              <span>빛 공급량:</span>
              <span className={getStatusClass(lightStatus)}>{light} ({lightStatus})</span>
            </div>
            <div className="status-item">
              <span>온도:</span>
              <span className={getStatusClass(temperatureStatus)}>{temperature} ({temperatureStatus})</span>
            </div>
            <div className="status-item">
              <span>습도:</span>
              <span className={getStatusClass(humidityStatus)}>{humidity} ({humidityStatus})</span>
            </div>
          </div>
          <div>
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantConditionModal;
