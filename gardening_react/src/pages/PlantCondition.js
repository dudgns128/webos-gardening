import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PlantCondition.css';

const PlantCondition = () => {
    const [waterLevel, setWaterLevel] = useState('Good');
    const [sunlight, setSunlight] = useState('Moderate');
    const [soilQuality, setSoilQuality] = useState('Rich');
    const navigate = useNavigate();

    const updateStatus = () => {
        const waterLevels = ['Low', 'Moderate', 'Good'];
        const sunlightLevels = ['Low', 'Moderate', 'High'];
        const soilQualities = ['Poor', 'Average', 'Rich'];

        setWaterLevel(waterLevels[Math.floor(Math.random() * waterLevels.length)]);
        setSunlight(sunlightLevels[Math.floor(Math.random() * sunlightLevels.length)]);
        setSoilQuality(soilQualities[Math.floor(Math.random() * soilQualities.length)]);
    };

    useEffect(() => {
        // This is where you can add logic to fetch real-time data if needed
    }, []);

    return (
        <div className="plant-container">
            <h1>Plant Status</h1>
            <div className="plant-status">
                <div className="status-item">
                    <span>Water Level:</span>
                    <span>{waterLevel}</span>
                </div>
                <div className="status-item">
                    <span>Sunlight:</span>
                    <span>{sunlight}</span>
                </div>
                <div className="status-item">
                    <span>Soil Quality:</span>
                    <span>{soilQuality}</span>
                </div>
            </div>
            <button onClick={updateStatus}>Update Status</button>
            <Link to="/dashboard">Go to Dashboard</Link>
        </div>
    );
}

export default PlantCondition;
