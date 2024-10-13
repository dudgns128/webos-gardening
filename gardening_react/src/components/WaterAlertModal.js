import './PlantCondition.css';

const WaterAlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div class="PlantModal">
      <div className="modal-backdrop" onClick={onClose}>
        <h2>알림</h2>
        <p>물탱크 내 물의 양이 부족합니다. 채워주세요!</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

export default WaterAlertModal;