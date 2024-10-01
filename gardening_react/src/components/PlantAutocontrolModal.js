import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './PlantCondition.css';
import WebSocketUtil from '../WebSocketUtil';

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
  let [currentState, setCurrentState] = useState(true);

  useEffect(() => {
    const updateCurrentState = (isAutoControl) => {
      setCurrentState(isAutoControl);
    };

    WebSocketUtil.onReceiveAutoControlCallback = updateCurrentState;

    // 초기 상태 설정
    if (WebSocketUtil.isAutoControl !== undefined) {
      setCurrentState(WebSocketUtil.isAutoControl);
    }

    return () => {
      WebSocketUtil.onReceiveAutoControlCallback = undefined;
    };
  }, []);

  const toggleHandler = () => {
    const newState = !currentState;
    const msg = {
      "method": 16,
      "userPlant": WebSocketUtil.selection,
      "data": {
        "isAutoControl": newState
      }
    };
    
    setCurrentState(newState);
    WebSocketUtil.socket.send(JSON.stringify(msg));
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