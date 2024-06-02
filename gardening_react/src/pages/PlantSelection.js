import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function PlantSelection() {
  const [plants, setPlants] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // 식물 선택 페이지에 필요한 정보 받아올 API 요청 (양식 수정 필요)
    fetch('https://example.com/api/plants')
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error('Error fetching plant data:', error));
  }, []);

  const handleSelectPlant = (plant) => {
    history.push(`/main?plantId=${plant.id}`);
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
