import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './PlantCondition.css';

const bridge = new WebOSServiceBridge();

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
      e.stopPropagation();
      toggleHandler();
    }}>
      <ToggleBackground isOn={isOn} />
      <ToggleCircle isOn={isOn} />
    </ToggleContainer>
  );
};


const PlantAutocontrolModal = ({ isOpen, onClose }) => {
  const [currentState, setCurrentState] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const serviceURL = "luna://com.team17.homegardening.service/toggleAutocontrol";

    bridge.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      if (response.success) {
        setCurrentState(response.currentState);
      }
    };

    bridge.call(serviceURL, '{}');
  }, [isOpen]);

  const toggleHandler = () => {
    setCurrentState(!currentState);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="PlantModal" onClick={onClose}>
      <div className="modal-backdrop">
        <div className="plant-container">
          <h1>식물 관리</h1>
          <div className="plant-status">
            <div className="status-item">
              <Span>자동 제어 유무</Span>
              <Toggle isOn={currentState} toggleHandler={toggleHandler} style={{ marginLeft: '20px' }}/>
            </div>
            <div className="autocontrol-text">
              <span className="block-span">선인장 키울 때 유의사항:</span>
              <span className="block-span">1. 분갈이를 1년에 한번씩 해준다</span>
              <span className="block-span">2. 분갈이를 할 때, 뿌리를 잘 정리해준다</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantAutocontrolModal;