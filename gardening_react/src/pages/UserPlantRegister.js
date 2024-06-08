import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MessageModal from '../components/MessageModal';
import axios from 'axios';

const bridge = new WebOSServiceBridge();

const UserPlantRegister = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
  const currentDay = today.getDate();

  const [userplantId, setUserplantId] = useState(0);                // 서버에서 저장 <-> 웹앱에서 해당 식물 구별 위해 사용하는 id
  const [plantList, setPlantList] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState(null);     // plantSpecies에 상응하는 id (서버 DB에 저장된 식물 종 id)
  const navigate = useNavigate();
  const [plantSpecies, setPlantSpecies] = useState('');
  const [plantName, setPlantName] = useState('');
  const [plantBirthdate, setPlantBirthdate] = useState('');
  const [year, setYear] = useState(`${currentYear}년`);
  const [month, setMonth] = useState(`${currentMonth}월`);
  const [day, setDay] = useState(`${currentDay}일`);
  const [isAutoControl, setIsAutoControl] = useState(true);
  const [level, setLevel] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchPlantInfo = async () => {
      try {
        const response = await axios.get('http://52.79.60.122:8080/api/plantinfo');
        setPlantList(response.data);
      } catch (error) {
        const message = error.response?.data?.message || '식물 리스트를 가져올 수 없습니다';
        setModalMessage(message);
        setShowModal(true);
      }
    };

    fetchPlantInfo();
  }, []);

  useEffect(() => {
    // 선택된 식물 종에 상응하는 id를 plantInfoId에 저장
    const selectedPlant = plantList.find(plant => plant.scientificName === plantSpecies);
    if (selectedPlant) {
      setSelectedPlantId(selectedPlant.id);
    }
  }, [plantSpecies]);

  // id 오름차순으로 식물 정보를 정렬하고, 식물 이름만 추출하여 PLANT_SPECIES_LIST를 생성
  const PLANT_SPECIES_LIST = plantList
    .sort((a, b) => a.id - b.id)
    .map(plant => plant.scientificName);

  const onSubmit = async () => {
    
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    const formatYear = year.replace('년', '');
    const formatMonth = month.replace('월', '').padStart(2, '0');
    const formatDay = day.replace('일', '').padStart(2, '0');
    
    const birthDate = `${formatYear}-${formatMonth}-${formatDay}`;
    setPlantBirthdate(birthDate) // just for JS service API
    
    try {
      const response = await axios.post('http://52.79.60.122:8080/api/userplant', null, {
        params:{
          email: email,
          password: password,
          plantInfoId: selectedPlantId,
          name: plantName,
          birthDate: birthDate,
          isAutoControl: isAutoControl,
          level: level
        }
      });

      if (response.status === 201) {
        // setUserplantId(response.data.id); 
        navigate('/main');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const message = error.response?.data?.message || '사용자 정보나 식물 정보가 없습니다';
        setModalMessage(message);
        setShowModal(true);
      } 
      else if (error.response && error.response.status === 400) {
        const message = error.response?.data?.message || '사용자 이메일과 비멀번호가 일치하지 않습니다';
        setModalMessage(message);
        setShowModal(true);
      }
      else {
        const message = error.response?.data?.message || '오류 발생';
        setModalMessage(message);
        setShowModal(true);
      }
    }
  };    

  useEffect(() => {
    const selectedPlant = plantList.find(plant => plant.scientificName === plantSpecies);

    if (selectedPlantId !== null && plantList.length > 0) {

      // 선택된 식물 종에 상응하는 description을 저장 후 AutoToggle 내 식물 키울 때 유의사항 내용
      localStorage.setItem('description', selectedPlant.shortDescription);     // API 개발 이전 임시용

      const serviceURL = "luna://com.team17.homegardening.service/start";
      
      bridge.onservicecallback = function (msg) {
          const response = JSON.parse(msg);
          if (response.success) {
            console.log("Luna service response success",);
          }
      };
      const payload = {
        "plantId": userplantId,
        "plantName": plantName,
        "plantBirthDate": plantBirthdate,
        "scientificName": selectedPlant.scientificName,
        "shortDescription": selectedPlant.shortDescription,
        "maxLevel": selectedPlant.maxLevel,
        "imageUrls": {
          "normal": selectedPlant.plantImage.normalImageUrl,
          "happy": selectedPlant.plantImage.happyImageUrl,
          "sad": selectedPlant.plantImage.sadImageUrl,
          "angry": selectedPlant.plantImage.angryImageUrl,
          "underWater": selectedPlant.plantImage.underWaterImageUrl,
          "overWater": selectedPlant.plantImage.overWaterImageUrl,
          "underLight": selectedPlant.plantImage.underLightImageUrl,
          "overLight": selectedPlant.plantImage.overLightImageUrl,
          "underTemperature": selectedPlant.plantImage.underTemperatureImageUrl,
          "overTemperature": selectedPlant.plantImage.overTemperatureImageUrl,
          "underHumidity": selectedPlant.plantImage.underHumidityImageUrl,
          "overHumidity": selectedPlant.plantImage.overHumidityImageUrl,
        },
        "properEnvironments": {
          "waterValue": selectedPlant.plantEnvironment.properWaterValue,
          "waterRange": selectedPlant.plantEnvironment.properWaterRange,
          "lightValue": selectedPlant.plantEnvironment.properLightValue,
          "lightRange": selectedPlant.plantEnvironment.properLightRange,
          "temperatureValue": selectedPlant.plantEnvironment.properTemperatureValue,
          "temperatureRange": selectedPlant.plantEnvironment.properTemperatureRange,
          "humidityValue": selectedPlant.plantEnvironment.properHumidityValue,
          "humidityRange": selectedPlant.plantEnvironment.properHumidityRange,
        }
      }
      bridge.call(serviceURL, JSON.stringify(payload));
    }
  }, [selectedPlantId, plantSpecies]);


  const goBack = () => {
    navigate('/user/login');
  }

  const calculateWidthSize = (originalSize, ratio) => {
    return Math.round(window.innerWidth * ratio) || originalSize;
  };

  const calculateHeightSize = (originalSize, ratio) => {
    return Math.round(window.innerHeight * ratio) || originalSize;
  };
  
  const BIRTHDAY_YEAR_LIST = Array.from({ length: 30 }, (_, i) => `${2024 - i}년`);
  const BIRTHDAY_MONTH_LIST = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
  const BIRTHDAY_DAY_LIST = Array.from({ length: 31 }, (_, i) => `${i + 1}일`);

  return (
    <div style = {{padding: '140px'}}>
      <MessageModal 
        content={modalMessage} 
        isOpen={showModal} 
        setIsOpen={setShowModal} 
        closeMethod={() => setShowModal(false)}  
      />
      <div className="container d-flex justify-content-center vh-50" style={{ width: calculateWidthSize(500, 0.4), height: calculateHeightSize(100, 0.3) }}>
        <div className="d-flex flex-column align-items-center">
          <h1 style = {{fontFamily: 'SansM', fontSize:'35px'}}>식물 정보 등록</h1>
          <div style={{ textAlign: 'center',paddingTop:'20px' }}>
            <div className="speciesFrame-nameFrame" style={{ marginTop: '40px'}}> 
              <select
                className="speciesBox"
                style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '20px' }}
                type="text"
                value={plantSpecies}
                onChange={(e) => {
                  setPlantSpecies(e.target.value);
                }}
                placeholder="식물 종"
                required
              >
                <option value="" disabled>종 선택</option>
                {PLANT_SPECIES_LIST.map((plantSpecies, index) => (
                  <option key={index}>{plantSpecies}</option>
                ))}
              </select>
              <input
                className="nameBox"
                style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc', width: '300px' }}
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="식물 이름"
                required
              />
            </div>
            <div className="birthdateSelectFrame" style={{ marginTop: '20px' }}>
              <label className="form-label" style = {{fontFamily: 'SansM', fontSize:'20px', marginRight: '10px' }}>식물 생년월일</label>
              <select
                className="birthdateBox yearBox"
                style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                type="year"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                }}
                required
              >
                {BIRTHDAY_YEAR_LIST.map((year, index) => (
                    <option key={index}>{year}</option>
                ))}
              </select>
              <select
                className="birthdateBox monthBox"
                style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                type="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
                required
              >
                {BIRTHDAY_MONTH_LIST.map((year, index) => (
                    <option key={index}>{year}</option>
                ))}
              </select>
              <select
                className="birthdateBox dayBox"
                style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                type="day"
                value={day}
                onChange={(e) => {
                  setDay(e.target.value);
                }}
                required
              >
                {BIRTHDAY_DAY_LIST.map((day, index) => (
                    <option key={index}>{day}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="btn" style={{ marginTop: '40px' }}>
              <button type="button" onClick ={onSubmit} style={{ background: 'transparent', border: 'none' }}>
                <img src={require('../img/CheckBtn.png')} alt="" className="btn-image"/>
              </button>
            </div>
          </div>  
          <div>
            <div className="btn" style={{ marginTop: '20px' }}>
              <button type="button" onClick ={goBack} style={{ background: 'transparent', border: 'none' }}>
                <img src={require('../img/BacktoBtn.png')} alt="" className="btn-image"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPlantRegister;