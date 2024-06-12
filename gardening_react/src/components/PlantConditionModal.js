import React, { useState, useEffect } from 'react';
import './PlantCondition.css';
import WebSocketUtil from '../WebSocketUtil';

const PlantConditionModal = ({ isOpen, onClose }) => {

  let [water, setWater] = useState(0);
  let [light, setLight] = useState(0);
  let [temperature, setTemperature] = useState(0);
  let [humidity, setHumidity] = useState(0);
    
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    WebSocketUtil.onReceivePlantConditionDataCallback = (plantData) => {
      setWater(plantData.water);
      setLight(plantData.light);
      setTemperature(plantData.temperature);
      setHumidity(plantData.humidity);
    };

    return () => {
      WebSocketUtil.onReceivePlantConditionDataCallback = undefined;
    };
  }, [isOpen]);


  if (!isOpen) {
    return null;
  }

  return (
    <div class="PlantModal">
      <div className="modal-backdrop">
        <div className="plant-container">
          <h1>환경 상태</h1>
          <div className="plant-status">
            <div className="status-item">
              <span>물 공급량:</span>
              <span>{water}</span>
            </div>
            <div className="status-item">
              <span>빛 공급량:</span>
              <span>{light}</span>
            </div>
            <div className="status-item">
              <span>습도:</span>
              <span>{humidity}</span>
            </div>
            <div className="status-item">
              <span>온도:</span>
              <span>{temperature}</span>
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
