import '../components/PlantCondition.css';

const bridge = new WebOSServiceBridge();

const ControlWater = () => {

    const handleWaterButtonClick = () => {
        const serviceURL = "luna://com.team17.homegardening.service/controlWater";

        bridge.onservicecallback = function (msg) {
            const response = JSON.parse(msg);
            if (response.success) {
                console.log("Watering successfully started");
            } else {
                console.error("Failed to start watering:", response);
            }
        };

        bridge.call(serviceURL, "{}");
    };

    return (
        <div className="control-water-container">
            <h1>Water Control</h1>
            <button onClick={handleWaterButtonClick} className="water-button">Start Watering</button>
        </div>
    );
};

export default ControlWater;
