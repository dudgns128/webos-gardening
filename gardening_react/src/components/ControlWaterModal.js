import './PlantCondition.css';
import WebSocketUtil from '../WebSocketUtil';

const ControlWaterModal = ({ isOpen, onClose }) => {
          
    const handleWaterButtonClick = () => {
        const msg = {
          "method": 14,
          "userPlant": WebSocketUtil.selection,
          "data": {
          }
        }
    
        WebSocketUtil.socket.send(JSON.stringify(msg));
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