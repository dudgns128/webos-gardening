import './PlantCondition.css';

const WaterAlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div class="PlantModal">
      <div className="modal-backdrop">
        <div className="plant-container">
          <h1>알림</h1>
          <div className="plant-status">
            <div className="status-item">
              <p>물탱크 내 물의 양이 부족합니다. 채워주세요!</p>
            </div>  
          </div>
          <div>
            <button onClick={onClose}>확인</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterAlertModal;