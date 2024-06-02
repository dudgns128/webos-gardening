//센서값 나중에 정해지면 센서값 기준 바꾸기

import React, { useState, useEffect } from 'react';
import './PlantCondition.css';

const bridge = new WebOSServiceBridge();

const PlantConditionModal = ({ isOpen, onClose }) => {
  const [water, setWater] = useState(0);
  const [light, setLight] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

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

    const serviceURL = "luna://com.team17.homegardening.service/getSensingData";

    bridge.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      setWater(response.water);
      setLight(response.light);
      setTemperature(response.temperature);
      setHumidity(response.humidity);
    };

    const intervalId = setInterval(() => bridge.call(serviceURL, '{}'), 5000);

    return () => clearInterval(intervalId);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // 예시 적정값 임의로 설정 (value,min,max)
  const waterStatus = getStatus(water, 20, 80);
  const lightStatus = getStatus(light, 30, 70);
  const temperatureStatus = getStatus(temperature, 18, 25);
  const humidityStatus = getStatus(humidity, 40, 60);

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
              <span>습도:</span>
              <span className={getStatusClass(humidityStatus)}>{humidity} ({humidityStatus})</span>
            </div>
            <div className="status-item">
              <span>온도:</span>
              <span className={getStatusClass(temperatureStatus)}>{temperature} ({temperatureStatus})</span>
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