import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketUtil from '../WebSocketUtil';

function PlantSelection() {
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();

  useEffect((plantData) => {
    // 식물 선택 페이지에 필요한 정보 받아올 API 요청 (양식 수정 필요)
    setTimeout(()=>
    setPlants(WebSocketUtil.plants), 1500);
  }, [plants]);

  const handleSelectPlant = (plant) => {
    navigate(`/main?plantId=${plant.id}`);

    const msg = {
      "method": 12,
      "userPlant": 0,
      "data": {
        "selectedPlantId": plant.id
      }
    }
    
    WebSocketUtil.socket.send(JSON.stringify(msg));
    WebSocketUtil.selection = plant.id;
  };

  return (
    <div>
      <h2>식물 선택</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {plants.map((plant) => (
          <div
            key={plant.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
            onClick={() => handleSelectPlant(plant)}
          >
            <img
              src={plant.image}
              alt={plant.name}
              style={{ width: '50px', height: '50px', marginRight: '10px' }}
            />
            <div>
              <div>{plant.name}</div>
              <div>{plant.birthDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlantSelection;
