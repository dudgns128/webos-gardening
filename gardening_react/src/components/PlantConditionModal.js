import React, { useState, useEffect } from 'react';
import './PlantCondition.css';

// const bridge = new WebOSServiceBridge();


const PlantConditionModal = ({ isOpen, onClose }) => {

  const [water, setWater] = useState(0);
  const [light, setLight] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
    
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    // const serviceURL = "luna://com.team17.homegardening.service/getSensingData";
  
    // bridge.onservicecallback = function (msg) {
    //   const response = JSON.parse(msg);
    //   if (response.success) {
    //     setWater(response.water);
    //     setLight(response.light);
    //     setTemperature(response.temperature);
    //     setHumidity(response.humidity);
    //   }
    // };

    // const intervalId = setInterval(() => bridge.call(serviceURL, '{}'), 3000);

    return () => clearInterval(intervalId);
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
