import { useState, useEffect } from 'react';
import './PlantCondition.css';

const bridge = new WebOSServiceBridge();

const ControlLightModal = ({ isOpen, onClose }) => {
    const [light, setLight] = useState(0); // 설정 될 광량 값

    const handleSliderChange = (event) => {
        setLight(event.target.value);
    };

    const onSubmit = () => {
        // const serviceURL = "luna://com.team17.homegardening.service/controlLight";

        // bridge.onservicecallback = function (msg) {
        //     const response = JSON.parse(msg);
        //     if (response.success) {
        //         console.log("Light value successfully set to:", light);
        //     } else {
        //         console.error("Failed to set light value:", response);
        //     }
        // };

        // const params = JSON.stringify({
        //     "light": light
        // });

        // bridge.call(serviceURL, params);
    };

    if (!isOpen) {
        return null;
      }    

    return (
        <div class="PlantModal">
            <div className="modal-backdrop" onClick={onClose}>
                <div className="plant-container">
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