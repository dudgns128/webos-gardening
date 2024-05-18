import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const HomePage = () => {


  const navigate = useNavigate();
  const [paddingTopRatio] = useState(0.12);

  const [sensorValue, setSensorValue] = useState(0);
  const [plantSatisfaction, setPlantSatisfaction] = useState('Neutral');

  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userSex');
      localStorage.removeItem('userBirthdate');
    };


    // 센서 값 가져오는 코드
    // 여기서는 임의의 값을 사용합니다.
    const newSensorValue = Math.floor(Math.random() * 201);
    setSensorValue(newSensorValue);

    // 센서 값에 따른 식물 만족도 설정
    if (newSensorValue >= 100) {
      setPlantSatisfaction('Satisfied');
    } else {
      setPlantSatisfaction('Angry');
    }

    clearLocalStorage();
  }, [paddingTopRatio]);

  const nameStyle = {
    fontFamily: "Reem Kufi",
    fontSize: "36px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
    background: "linear-gradient(92deg, #62AB19 6.16%, #90CA57 20.47%, #6DCF0B 33.53%, #6ED209 45.14%, #6ED805 59.16%, #72DC09 71.73%, #75E00A 84.31%, #71DF03 94.95%, #76E903 99.01%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  // 이벤트 핸들러 함수 추가
  const handleBarClick = () => {
    // 페이지 이동 로직 구현
    // 예: 특정 URL로 이동
    navigate()
  };
  // 화면 크기에 따른 픽셀 값 계산
  const calculateWidthSize = (originalSize, ratio) => {
    return Math.round(window.innerWidth * ratio) || originalSize;
  };

  const calculateHeightSize = (originalSize, ratio) => {
    return Math.round(window.innerHeight * ratio) || originalSize;
  };

  return (
    <div style={{ backgroundImage: `url()`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100vw', height: '100vh', overflow: 'hidden', paddingTop: 'px' }}>
      <div className="container d-flex align-items-center justify-content-center vh-50">
        <div className="d-flex flex-column align-items-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="28" viewBox="0 0 26 28" fill="none" style={{ position: 'absolute', top: 0, left: 300 }} >
              <path d="M21.875 7.25H3.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15.625 14H3.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17.7083 20.75H3.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="28" viewBox="0 0 26 28" fill="none" style={{ position: 'absolute', top: 0, right: 330 }}>
              <path d="M19.0037 9.5C19.0037 7.70979 18.3452 5.9929 17.1731 4.72703C16.001 3.46116 14.4113 2.75 12.7537 2.75C11.0961 2.75 9.50635 3.46116 8.33425 4.72703C7.16214 5.9929 6.50366 7.70979 6.50366 9.5C6.50366 17.375 3.37866 19.625 3.37866 19.625H22.1287C22.1287 19.625 19.0037 17.375 19.0037 9.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.5557 24.125C14.3726 24.466 14.1097 24.749 13.7934 24.9457C13.4772 25.1425 13.1186 25.246 12.7536 25.246C12.3886 25.246 12.0301 25.1425 11.7138 24.9457C11.3975 24.749 11.1347 24.466 10.9515 24.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="40" viewBox="0 0 26 40" fill="none" style={{ position: 'absolute', top: 0, right: 300 }}>
              <path d="M15.1042 4.5H9.89587L7.29171 7.875H4.16671C3.61417 7.875 3.08427 8.11205 2.69357 8.53401C2.30287 8.95597 2.08337 9.52826 2.08337 10.125V20.25C2.08337 20.8467 2.30287 21.419 2.69357 21.841C3.08427 22.2629 3.61417 22.5 4.16671 22.5H20.8334C21.3859 22.5 21.9158 22.2629 22.3065 21.841C22.6972 21.419 22.9167 20.8467 22.9167 20.25V10.125C22.9167 9.52826 22.6972 8.95597 22.3065 8.53401C21.9158 8.11205 21.3859 7.875 20.8334 7.875H17.7084L15.1042 4.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.5 18.4375C14.5616 18.4375 16.1042 16.6567 16.1042 14.625C16.1042 12.5933 14.5616 10.8125 12.5 10.8125C10.4384 10.8125 8.89587 12.5933 8.89587 14.625C8.89587 16.6567 10.4384 18.4375 12.5 18.4375Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          {/* 센서값에 따른 바 표시 */}
          <div>
            <div
              style={{
                backgroundColor: plantSatisfaction === 'Satisfied' ? 'green' : 'red',
                width: `${sensorValue / 2}%`,
                height: '40px',
                borderRadius: '10px'
              }}
              onClick={handleBarClick} // onClick 이벤트 핸들러 추가
            ></div>
            <p>Sensor Value: {sensorValue}</p>
            <p>Plant Satisfaction: {plantSatisfaction}</p>
          </div>

          {/* 식물 이미지가 들어 갈 자리*/}
          <div className="cacus">
            <img src={require('../img/cacus.png')} alt="선인장 이미지" />

          </div>

          <div className="menu-bar">
            <img src={require('../img/BottomBar.png')} alt="Description" usemap="#image-map" />
            <map name="image-map">
              <area shape="rect" coords="0,0,75,180" alt="Link 1" href="src/pages/UserLogin.js#/user/login" />
              <area shape="rect" coords="75,0,150,180" alt="Link 2" href="/link-2" />
              <area shape="rect" coords="150,0,225,180" alt="Link 3" href="/link-3" />
              <area shape="rect" coords="225,0,300,180" alt="Link 4" href="/link-4" />
              <area shape="rect" coords="300,0,375,180" alt="Link 5" href="/link-5" />
            </map>
          </div>

        </div>


      </div>
    </div>

  );
};


export default HomePage;
