import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './PlantCondition.css';

// const bridge = new WebOSServiceBridge();

const ToggleContainer = styled.div`
  position: relative;
  // left: 47%;
  cursor: pointer;

  > .toggle-container {
    width: 50px;
    height: 24px;
    border-radius: 30px;
    background-color: rgb(233,233,234);
  }
  > .toggle--checked {
    background-color: rgb(0,200,102);
    transition: 0.5s;
  }

  > .toggle-circle {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: rgb(255,254,255);
    transition: 0.5s;
  }
  > .toggle--checked {
    left: 27px;
    transition: 0.5s;
  }
`;

const Span = styled.span`
  margin-right: 20px;
`;

const Toggle = ({ isOn, toggleHandler }) => {
  return (
    <>
      <ToggleContainer onClick={toggleHandler}>
        <div className={`toggle-container ${isOn ? "toggle--checked" : ""}`} />
        <div className={`toggle-circle ${isOn ? "toggle--checked" : ""}`} />
      </ToggleContainer>
    </>
  );
};

const PlantAutocontrolModal = ({ isOpen, onClose }) => {
  const [currentState, setCurrentState] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // const serviceURL = "luna://com.team17.homegardening.service/toggleAutocontrol";

    // bridge.onservicecallback = function (msg) {
    //   const response = JSON.parse(msg);
    //   if (response.success) {
    //     setCurrentState(response.currentState);
    //   }
    // };

    // bridge.call(serviceURL, '{}');
  }, [isOpen]);

  const toggleHandler = () => {
    setCurrentState(!currentState);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="PlantModal">
      <div className="modal-backdrop">
        <div className="plant-container">
          <h1>식물 관리</h1>
          <div className="plant-status">
            <div className="status-item">
              <Span>자동 제어 유무</Span>
              <Toggle isOn={currentState} toggleHandler={toggleHandler} style={{ marginLeft: '20px' }}/>
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

export default PlantAutocontrolModal;