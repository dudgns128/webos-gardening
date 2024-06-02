import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const bridge = new WebOSServiceBridge();

function UserPlantRegister() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
  const currentDay = today.getDate();

  const [plantList, setPlantList] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const navigate = useNavigate();
  const [plantSpecies, setPlantSpecies] = useState('');
  const [plantName, setPlantName] = useState('');
  const [plantBirthdate, setPlantBirthdate] = useState('');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [day, setDay] = useState(currentDay);
  const [isAutoControl, setIsAutoControl] = useState(true);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const serviceURL = "luna://com.team17.homegardening.service/start";
    
    bridge.onservicecallback = function (msg) {
        const response = JSON.parse(msg);
        if (response.success) {
          console.log("Luna service response success",);
        }
    };
    const payload = {
      "plantId": 1,
      "plantName": "ya",
      "plantBirthDate": "1999-01-28",
      "scientificName": "cat",
      "shortDescription": "hi",
      "maxLevel": 10,
      "imageUrls": {
        "normal": "https://i.sstatic.net/Bzcs0.png",
        "happy":"." ,
        "sad":"." ,
        "angry":"." ,
        "underWater":"." ,
        "overWater":"." ,
        "underLight":"." ,
        "overLight":"." ,
        "underTemperature":"." ,
        "overTemperature":"." ,
        "underHumidity":"." ,
        "overHumidity":"." ,
      },
      "properEnvironments": {
        "waterValue": 50,
        "waterRange": 10,
        "lightValue": 100,
        "lightRange": 50,
        "temperatureValue": 30,
        "temperatureRange": 3,
        "humidityValue": 20,
        "humidityRange": 5,
      }
    }
    bridge.call(serviceURL, JSON.stringify(payload));
  }, []);

  useEffect(() => {
    const fetchPlantInfo = async () => {
      try {
        const response = await axios.get('/api/plantinfo');
        setPlantList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlantInfo();
  }, []);

  // plantList 상태가 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    // 선택된 식물 종에 상응하는 id를 plantInfoId에 저장
    const selectedPlant = plantList.find(plant => plant.scientificName === plantSpecies);
    if (selectedPlant) {
      setSelectedPlantId(selectedPlant.id);
    }
  }, [plantSpecies, plantList]);

  // id 오름차순으로 식물 정보를 정렬하고, 식물 이름만 추출하여 PLANT_SPECIES_LIST를 생성
  const PLANT_SPECIES_LIST = plantList
    .sort((a, b) => a.id - b.id)
    .map(plant => plant.name);

  const onSubmit = async (e) => {
    
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    const formatYear = year.replace('년', '');
    const formatMonth = month.replace('월', '').padStart(2, '0');
    const formatDay = day.replace('일', '').padStart(2, '0');
    
    const birthdate = `${formatYear}-${formatMonth}-${formatDay}`;
    setPlantBirthdate(birthdate)

    const plantData = {
      email: email,
      password: password,
      plantInfoId: selectedPlantId,
      name: plantName,
      birthdate: birthdate,
      isAutoControl: isAutoControl,
      level: level
    };
    
    //sendToLunaService();
    
    // try {
    //   const response = await axios.post('/api/userplant/register', plantData);

    //   if (response.status === 201) {
    //     console.log('UserPlant registered successfully');
    //     // WebOSServiceBridge를 사용하여 데이터 전송
    //     sendToLunaService();
    //     navigate('/main');
    //   }
    // } catch (error) {
    //   if (error.response && error.response.status === 404) {
    //     console.log('User or PlantInfo not found');
    //   } else {
    //     console.log('Something went wrong');
    //   }
    // }
  };    

  function sendToLunaService() {
    const serviceURL = "luna://com.team17.homegardening.service/start";
    
    bridge.onservicecallback = function (msg) {
        const response = JSON.parse(msg);
        if (response.success) {
          console.log("Luna service response success",);
        }
    };
    const payload = {
      "plantId": 1,
      "plantName": "ya",
      "plantBirthDate": "1999-01-28",
      "scientificName": "cat",
      "shortDescription": "hi",
      "maxLevel": 10,
      "imageUrls": {
        "normal": "https://i.sstatic.net/Bzcs0.png",
        "happy":"." ,
        "sad":"." ,
        "angry":"." ,
        "underWater":"." ,
        "overWater":"." ,
        "underLight":"." ,
        "overLight":"." ,
        "underTemperature":"." ,
        "overTemperature":"." ,
        "underHumidity":"." ,
        "overHumidity":"." ,
      },
      "properEnvironemnts": {
        "waterValue": 50,
        "waterRange": 10,
        "lightValue": 100,
        "lightRange": 50,
        "temperatureValue": 30,
        "temperatureRange": 3,
        "humidityValue": 20,
        "humidityRange": 5,
      }
    
    // const payload = {
    //   "plantId": selectedPlantId,
    //   "plantName": plantName,
    //   "plantBirthDate": plantBirthdate,
    //   "scientificName": plantList[selectedPlantId]scientificName,
    //   "shortDescription": plantList[selectedPlantId].shortDescription,
    //   "maxLevel": plantList[selectedPlantId].maxLevel,
    //   "imageUrls": {
    //     "normal": plantList[selectedPlantId].imageUrls.normal,
    //     "happy": plantList[selectedPlantId].imageUrls.happy,
    //     "sad": plantList[selectedPlantId].imageUrls.sad,
    //     "angry": plantList[selectedPlantId].imageUrls.angry,
    //     "underWater": plantList[selectedPlantId].imageUrls.underWater,
    //     "overWater": plantList[selectedPlantId].imageUrls.overWater,
    //     "underLight": plantList[selectedPlantId].imageUrls.underLight,
    //     "overLight": plantList[selectedPlantId].imageUrls.overLight,
    //     "underTemperature": plantList[selectedPlantId].imageUrls.underTemperature,
    //     "overTemperature": plantList[selectedPlantId].imageUrls.overTemperature,
    //     "underHumidity": plantList[selectedPlantId].imageUrls.underHumidity,
    //     "overHumidity": plantList[selectedPlantId].imageUrls.overHumidity,
    //   },
    //   "properEnvironments": {
    //     "waterValue": plantList[selectedPlantId].properEnvironemnts.waterValue,
    //     "waterRange": plantList[selectedPlantId].properEnvironemnts.waterRange,
    //     "lightValue": plantList[selectedPlantId].properEnvironemnts.lightValue,
    //     "lightRange": plantList[selectedPlantId].properEnvironemnts.lightRange,
    //     "temperatureValue": plantList[selectedPlantId].properEnvironemnts.temperatureValue,
    //     "temperatureRange": plantList[selectedPlantId].properEnvironemnts.temperatureRange,
    //     "humidityValue": plantList[selectedPlantId].properEnvironemnts.humidityValue,
    //     "humidityRange": plantList[selectedPlantId].properEnvironemnts.humidityRange,
    //   }
    };
    
    bridge.call(serviceURL, JSON.stringify(payload));
}

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
                setYear(e.target.value.replace('년', ''));
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
                setMonth(e.target.value.replace('월', ''));
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
                setDay(e.target.value.replace('일', ''));
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
            <Link to="/main" style={{ textDecoration: 'none' }}>
              <button type="button" onClick ={onSubmit} style={{ background: 'transparent', border: 'none' }}>
                <img src={require('../img/CheckBtn.png')} alt="" className="btn-image"/>
              </button>
            </Link>
          </div>
        </div>  
        <div>
          <div className="btn" style={{ marginTop: '20px' }}>
            <Link to="/user/login" style={{ textDecoration: 'none' }}>
              <button type="button" onClick ={goBack} style={{ background: 'transparent', border: 'none' }}>
                <img src={require('../img/BacktoBtn.png')} alt="" className="btn-image"/>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default UserPlantRegister;