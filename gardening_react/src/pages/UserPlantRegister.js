import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { display } from '../constants';

const bridge = new WebOSServiceBridge();

function UserPlantRegister() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
  const currentDay = today.getDate();

  const navigate = useNavigate();
  const [plantSpecies, setPlantSpecies] = useState('');
  const [plantName, setPlantName] = useState('');
  const [year, setYear] = useState(`${currentYear}년`);
  const [month, setMonth] = useState(`${currentMonth}월`);
  const [day, setDay] = useState(`${currentDay}일`);
  const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 저장할 상태 생성

  ///////////////////////////////////
  useEffect(() => {
    bridge.call("luna://com.team17.homegardening.service/register", '{}');
  }, []);
  //////////////////////////////////

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000'); // 웹소켓 연결
    setWs(ws); // 상태에 웹소켓 인스턴스 저장
    return () => {
      ws.close(); // 컴포넌트 unmount 시 웹소켓 연결 종료
    };
  }, []);

  const onSubmit = (e) => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    const plantBirthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    const plantInfo = {
      species: plantSpecies,
      name: plantName,
      birthdate: plantBirthdate || new Date().toISOString().split('T')[0],
      email,
      password,
    };

    // localStorage.setItem('plantSpecies', plantSpecies);
    // // 사용자가 선택한 해당 식물 종 이미지 불러와서 localStorage에 저장하기
    // fetchImageUrl(plantSpecies);

    // 웹소켓이 연결되면 정보 전송
    if(ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(plantInfo));
      console.log('정보가 서버로 전송되었습니다.');
    } 
    else {
      console.log('웹소켓 연결이 되어 있지 않습니다.');
    }

    // WebOSServiceBridge를 사용하여 데이터 전송
    //sendToLunaService(plantInfo);       
  };

  // const fetchImageUrl = (plantSpecies) => {
  //   console.log(`${plantSpecies} 이미지 URL을 불러옵니다.`);
  //   // 예시 URL, 실제 요청할 서버의 URL로 변경해야 함
  //   const requestUrl = `https://example.com/api/images?species=${encodeURIComponent(plantSpecies)}`;
  
  //   fetch(requestUrl)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('식물 종 이미지 로드 시 네트워크 연결 이상');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       // 예시로 'imageUrl'을 사용했으나, 실제 응답의 이미지 URL 키에 맞춰 변경해야 함
  //       const imageUrl = data.imageUrl;
  //       console.log(`${plantSpecies} 이미지 URL을 저장합니다: ${imageUrl}`);
  //       // localStorage에 이미지 URL 저장
  //       localStorage.setItem(`${plantSpecies}-image`, imageUrl);
  //       setPlantSpecies(plantSpecies);
  //     })
  //     .catch(error => {
  //       console.error('이미지를 불러오는 데 실패했습니다:', error);
  //     });
  // };

//   function sendToLunaService(plantInfo) {
//     const serviceURL = "luna://com.your.service/createUser"; // 사용할 서비스의 URL
    
//     bridge.onservicecallback = function (msg) {
//         const response = JSON.parse(msg);
//         console.log("Luna service response:", response);
//         if (response.returnValue) {
//             console.log("Data successfully sent to the service");
//         } else {
//             console.error("Failed to send data to the service");
//         }
//     };
    
//     const payload = {
//         method: "createUser", // 사용할 메소드 이름
//         parameters: JSON.stringify(plantInfo), // 전송할 데이터
//         subscribe: false // 구독 필요 여부
//     };
    
//     bridge.call(serviceURL, JSON.stringify(payload));
// }

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
  const PLANT_SPECIES_LIST = ['선인장', '해바라기', '튤립'];

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