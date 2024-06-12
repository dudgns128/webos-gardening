import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WebSocketUtil from "../WebSocketUtil";
import "./PlantSelection.css"; // CSS 파일 import

function PlantSelection() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(WebSocketUtil.plants === undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (WebSocketUtil.plants !== undefined) {
      setPlants(WebSocketUtil.plants);
    }

    WebSocketUtil.onReceivePlantsCallback = (plants) => {
      setPlants(plants);
      setLoading(false);
    };

    return () => {
      WebSocketUtil.onReceivePlantsCallback = undefined;
    };
  }, []);

  const handleSelectPlant = (plant) => {
    navigate(`/main?plantId=${plant.id}`);

    const msg = {
      method: 12,
      userPlant: 0,
      data: {
        selectedPlantId: plant.id,
      },
    };

    WebSocketUtil.socket.send(JSON.stringify(msg));
    WebSocketUtil.selection = plant.id;
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="plant-selection-container">
      <h2 className="plant-selection-title">식물 선택</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="plant-item"
            onClick={() => handleSelectPlant(plant)}
          >
            <img src={plant.plantInfo.plantImage.normalImageUrl} alt={plant.name} className="plant-image" />
            <div className="plant-details">
              <div className="plant-name">{plant.name}</div>
              <div className="plant-birthdate">{plant.birthDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlantSelection;
