//센서값 나중에 정해지면 센서값 기준 바꾸기

import React, { useState, useEffect } from 'react';
import './PlantCondition.css';

const bridge1 = new WebOSServiceBridge();
const bridge2 = new WebOSServiceBridge();

const PlantConditionModal = ({ isOpen, onClose }) => {
  const [water, setWater] = useState(0);
  const [light, setLight] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [waterStatus, setWaterStatus] = useState();
  const [lightStatus, setLightStatus] = useState();
  const [temperatureStatus, setTemperatureStatus] = useState();
  const [humidityStatus, setHumidityStatus] = useState();
  

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

    const serviceURL2 = "luna://com.team17.homegardening.service/envData";
    bridge2.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      setWaterStatus(getStatus(water, response.waterValue-response.waterRange, response.waterValue+response.waterRange));
      setLightStatus(getStatus(light, response.lightValue-response.lightRange, response.lightValue+response.lightRange));
      setTemperatureStatus(getStatus(temperature, response.temperatureValue-response.temperatureRange, response.temperatureValue+response.temperatureRange));
      setHumidityStatus(getStatus(humidity, response.humidityValue-response.humidityRange, response.humidityValue+response.humidityRange));
    };
    
    bridge2.call(serviceURL2, '{}');
    
    const serviceURL1 = "luna://com.team17.homegardening.service/getSensingData";
    bridge1.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      if (response.success) {
        setWater(response.water);
        setLight(response.light);
        setTemperature(response.temperature);
        setHumidity(response.humidity);
      }
    };

    bridge1.call(serviceURL1, '{}');
    const intervalId1 = setInterval(() => bridge1.call(serviceURL1, '{}'), 3000);


    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);};
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // 예시 적정값 임의로 설정 (value,min,max)
  // const waterStatus = getStatus(water, 20, 80);
  // const lightStatus = getStatus(light, 30, 70);
  // const temperatureStatus = getStatus(temperature, 18, 25);
  // const humidityStatus = getStatus(humidity, 40, 60);

  return (
    <div class="PlantModal">
      <div className="modal-backdrop" onClick={onClose}>
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
        </div>
      </div>
    </div>
  );
};

export default PlantConditionModal;