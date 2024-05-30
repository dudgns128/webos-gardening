import { useState, useEffect } from 'react';
import '../components/PlantCondition.css';

const bridge = new WebOSServiceBridge();

const ControlLight = () => {
    const [light, setLight] = useState(0); // 설정 될 광량 값

    const handleSliderChange = (event) => {
        setLight(event.target.value);
    };

    useEffect(() => {
        const serviceURL = "luna://com.team11.homegardening.service/controlLight";

        bridge.onservicecallback = function (msg) {
            const response = JSON.parse(msg);
            if (response.success) {
                console.log("Light value successfully set to:", light);
            } else {
                console.error("Failed to set light value:", response);
            }
        };

        const params = JSON.stringify({
            "light": light
        });

        bridge.call(serviceURL, params);
    }, [light]);

    return (
        <div className="control-light-container">
            <h1>Light Control</h1>
            <input
                type="range"
                min="0"
                max="100"
                value={light}
                onChange={handleSliderChange}
                className="slider"
            />
            <p>Current light value: {light}</p>
        </div>
    );
};

export default ControlLight;
