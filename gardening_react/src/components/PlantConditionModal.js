import React, { useState, useEffect } from 'react';
import './PlantCondition.css';

const bridge1 = new WebOSServiceBridge();
const bridge2 = new WebOSServiceBridge();

async function delay() {
  return new Promise(resolve => setTimeout(resolve, 1));
}

const PlantConditionModal = ({ isOpen, onClose }) => {
  const [water, setWater] = useState(0);
  const [light, setLight] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [waterStatus, setWaterStatus] = useState();
  const [lightStatus, setLightStatus] = useState();
  const [temperatureStatus, setTemperatureStatus] = useState();
  const [humidityStatus, setHumidityStatus] = useState();
  let waterMin, lightMin, temperatureMin, humidityMin, waterMax, lightMax, temperatureMax, humidityMax;

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
      waterMin = response.waterValue-response.waterRange;
      waterMax = response.waterValue+response.waterRange;
      lightMin = response.lightValue-response.lightRange;
      lightMax = response.lightValue+response.lightRange;
      temperatureMin = response.temperatureValue-response.temperatureRange;
      temperatureMax = response.temperatureValue+response.temperatureRange;
      humidityMin = response.humidityValue-response.humidityRange;
      humidityMax = response.humidityValue+response.humidityRange;

      bridge1.onservicecallback = function (msg) {
        const response = JSON.parse(msg);
        if (response.success) {
          setWater(response.water);
          setLight(response.light);
          setTemperature(response.temperature);
          setHumidity(response.humidity);
          setWaterStatus(getStatus(response.water, waterMin, waterMax));
          setLightStatus(getStatus(response.light, lightMin, lightMax));
          setTemperatureStatus(getStatus(response.temperature, temperatureMin, temperatureMax));
          setHumidityStatus(getStatus(response.humidity, humidityMin, humidityMax));
        }
      };
    };
    bridge2.call(serviceURL2, '{}');
    
    const serviceURL1 = "luna://com.team17.homegardening.service/getSensingData";

    bridge1.call(serviceURL1, '{}');  // 처음 센싱 데이터값 바로 노출되도록 추후 개발
    const intervalId1 = setInterval(() => bridge1.call(serviceURL1, '{}'), 3000);

    return () => {
      clearInterval(intervalId1);};
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
              <span>온도:</span>
              <span className={getStatusClass(temperatureStatus)}>{temperature} ({temperatureStatus})</span>
            </div>
            <div className="status-item">
              <span>습도:</span>
              <span className={getStatusClass(humidityStatus)}>{humidity} ({humidityStatus})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantConditionModal;