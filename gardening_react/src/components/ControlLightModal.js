import { useState, useEffect } from 'react';
import './PlantCondition.css';
import WebSocketUtil from '../WebSocketUtil';

const ControlLightModal = ({ isOpen, onClose }) => {
    const [light, setLight] = useState(0); // 설정 될 광량 값

    const handleSliderChange = (event) => {
        setLight(event.target.value);
    };

    const onSubmit = () => {
        const msg = {
          "method": 15,
          "userPlant": WebSocketUtil.selection,
          "data": {
            "light": light
          }
        }
    
        WebSocketUtil.socket.send(JSON.stringify(msg));

        onClose();
    };

    if (!isOpen) {
        return null;
      }    

    return (
        <div className="PlantModal">
            <div className="modal-backdrop" onClick={onClose}>
                <div className="plant-container" onClick={(e) => e.stopPropagation()}>
                <h1>광량 제어</h1>
                    <div className="plant-status">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={light}
                        onChange={handleSliderChange}
                        className="slider"
                    />
                    <p>빛 세기 조절: {light}</p>
                    </div>
                    <div>
                        <button onClick={onSubmit}>확인</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlLightModal;