import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './PlantCondition.css';

const bridge1 = new WebOSServiceBridge();
const bridge2 = new WebOSServiceBridge();

const ToggleContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const ToggleBackground = styled.div`
  width: 50px;
  height: 24px;
  border-radius: 30px;
  background-color: ${({ isOn }) => (isOn ? 'rgb(0,200,102)' : 'rgb(233,233,234)')};
  transition: 0.5s;
`;

const ToggleCircle = styled.div`
  position: absolute;
  top: 1px;
  left: ${({ isOn }) => (isOn ? '27px' : '1px')};
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgb(255,254,255);
  transition: 0.5s;
`;

const Span = styled.span`
  margin-right: 20px;
`;

const Toggle = ({ isOn, toggleHandler }) => {
  return (
    <ToggleContainer onClick={(e) => {
      // e.stopPropagation();
      toggleHandler();
    }}>
      <ToggleBackground isOn={isOn} />
      <ToggleCircle isOn={isOn} />
    </ToggleContainer>
  );
};


const PlantAutocontrolModal = ({ isOpen, onClose }) => {
  const [currentState, setCurrentState] = useState(true);
  const description = localStorage.getItem('description');

  const descriptionLines = description ? description.split('\n').map((line, index) => (
    <span key={index} className="block-span">{line}</span>
  )) : null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const serviceURL = "luna://com.team17.homegardening.service/isAutocontrol";

    bridge1.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      if (response.success) {
        setCurrentState(response.currentState);
      }
    };

    bridge1.call(serviceURL, '{}');
    // const intervalId = setInterval(() => bridge1.call(serviceURL, '{}'), 1000);

    // return () => clearInterval(intervalId);
  }, [isOpen]);

  const toggleHandler = () => {
    const serviceURL = "luna://com.team17.homegardening.service/toggleAutocontrol";

    bridge2.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      if (response.success) {
        setCurrentState(response.currentState);
      }
    };

    bridge2.call(serviceURL, '{}');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="PlantModal">
      <div className="modal-backdrop"  onClick={onClose}>
        <div className="plant-container" onClick={(e) => e.stopPropagation()}>
          <h1>식물 관리</h1>
          <div className="plant-status">
            <div className="status-item">
              <Span>자동 제어 유무</Span>
              <Toggle isOn={currentState} toggleHandler={toggleHandler} style={{ marginLeft: '20px' }}/>
            </div>
            <div className="autocontrol-text">
              {descriptionLines}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantAutocontrolModal;