import './PlantCondition.css';

const bridge = new WebOSServiceBridge();

const ControlWaterModal = ({ isOpen, onClose }) => {
          
    const handleWaterButtonClick = () => {
        // const serviceURL = "luna://com.team17.homegardening.service/controlWater";

        // bridge.onservicecallback = function (msg) {
        //     const response = JSON.parse(msg);
        //     if (response.success) {
        //         console.log("Watering successfully started");
        //     } else {
        //         console.error("Failed to start watering:", response);
        //     }
        // };

        // bridge.call(serviceURL, "{}");
    };

    const handleCloseClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={handleCloseClick}>
            <div className="plant-container" onClick={(e) => e.stopPropagation()}>
            <h1 style={{ marginBottom: '20px', color: '#4CAF50' }}>물주기</h1>
            <div className="plant-status">
                    <button onClick={handleWaterButtonClick} className="water-button" style={{ marginLeft: '8px' }}>
                        <img src={require('../img/watering.png')} alt="물주기" className="btn-image"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlWaterModal;