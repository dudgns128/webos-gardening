import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlantConditionModal from '../components/PlantConditionModal';
import PlantAutocontrolModal from '../components/PlantAutocontrolModal';
import CalendarModal from '../components/CalendarModal';
import ControlLightModal from '../components/ControlLightModal';
import ControlWaterModal from '../components/ControlWaterModal';
import WaterAlertModal from '../components/WaterAlertModal';
import backgroundImage from '../img/background.png';
import goalImage from '../img/present.png';

const MainPage = () => {
  const navigate = useNavigate();

  const [plantSatisfactionValue, setPlantSatisfactionValue] = useState(0);
  const [plantSatisfaction, setPlantSatisfaction] = useState(0);
  const [plantImageUrl, setPlantImageUrl] = useState('');
  const [plantName, setPlantName] = useState('초기');
  const [plantLevel, setPlantLevel] = useState(0);
  const [plantExp, setPlantExp] = useState(50);
  const [waterTankLevel, setWaterTankLevel] = useState(1);
  const [isConditionModalOpen, conditionModalOpen] = useState(false);
  const [isToggleModalOpen, toggleModalOpen] = useState(false);
  const [isCalendarModalOpen, calendarModalOpen] = useState(false);
  const [isControlLightModalOpen, controlLightModalOpen] = useState(false);
  const [isControlWaterModalOpen, controlWaterModalOpen] = useState(false);
  const [isWaterAlertModalOpen, setWaterAlertModalOpen] = useState(false);


  const camera = () => {
    const bridge2 = new WebOSServiceBridge();

    const serviceURL = "luna://com.team17.homegardening.service/capture";
    bridge2.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      if (response.success) {
          console.log("Camera opend");
      } 
    };
    bridge2.call(serviceURL, '{}');
  };

  useEffect(() => {
    const bridge = new WebOSServiceBridge();

    const serviceURL = "luna://com.team17.homegardening.service/getPlantInfos"; // 사용할 서비스의 URL

    bridge.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      if (response.success) {
        setPlantSatisfactionValue(response.satisfaction);
        setPlantImageUrl(response.imageUrl);
        setPlantName(response.name);
        setPlantLevel(response.level);
        setPlantExp(response.exp);
        setWaterTankLevel(response.waterTankLevel);
      }

    };

    // 3초마다 센서 값을 가져오는 인터벌 설정
    const intervalId = setInterval(() => bridge.call(serviceURL, '{}'), 3000);

    // 컴포넌트가 언마운트될 때 인터벌 정리
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (waterTankLevel === 0) {
      setWaterAlertModalOpen(true);
    }
  }, [waterTankLevel]);

  const handleBarClick = () => {
    conditionModalOpen(true);
  };

  const satisfactionColors = {
    '매우 좋음': '#00A35E',
    '좋음': 'lightgreen',
    '보통': 'yellow',
    '나쁨': 'orange',
    '아주 나쁨': 'red'
  };

  useEffect(() => {
    // 센서 값에 따른 식물 만족도 설정
    if (80 < plantSatisfactionValue && plantSatisfactionValue <= 100) {
      setPlantSatisfaction('매우 좋음');
    } else if (60 < plantSatisfactionValue && plantSatisfactionValue <= 80) {
      setPlantSatisfaction('좋음');
    } else if (40 < plantSatisfactionValue && plantSatisfactionValue <= 60) {
      setPlantSatisfaction('보통');
    } else if (20 < plantSatisfactionValue && plantSatisfactionValue <= 40) {
      setPlantSatisfaction('나쁨');
    } else if (0 <= plantSatisfactionValue && plantSatisfactionValue <= 20) {
      setPlantSatisfaction('아주 나쁨');
    }
  }, [plantSatisfactionValue]);

  const boxStyle = {
    borderRadius: '50px',
    background: '#F8FFCC',
    boxShadow: '0px 4px 8px 0px rgba(101, 92, 128, 0.30)',
    display: 'flex',
    width: '360px',
    height: '48px',
    padding: '0px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px'
  };

  const expBackgroundStyle = {
    boxShadow: '0px 4px 8px 0px rgba(101, 92, 128, 0.75)',
    height: '24px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 반투명 백그라운드
    borderRadius: '12px',
    margin: '2px',
    position: 'relative',
  };
  //골 이미지
  const expGoalIconStyle = {
    position: 'absolute', // 상대적인 위치 설정
    right: '0px', // 오른쪽 끝에 위치
    top: '50%', // 상단에서 50% 위치
    transform: 'translateY(-50%)', // Y축 중앙 정렬
    width: '20px', // 이미지 너비
    height: '20px', // 이미지 높이
    backgroundImage: `url(${goalImage})`, // 배경 이미지 설정
    backgroundSize: 'cover' // 이미지 크기 자동 조절
  };

  // 실제 경험치 바 스타일 (동적 길이)
  const expFillStyle = {
    height: '24px',
    width: `${plantExp}%`,
    backgroundColor: 'red',
    borderRadius: '12px',
    transition: 'width 0.3s ease-in-out'
  };

  const satisfactionBackgroundStyle = {
    boxShadow: '0px 4px 8px 0px rgba(101, 92, 128, 0.75)',
    height: '40px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 반투명 백그라운드
    borderRadius: '12px',
    margin: '2px',
    position: 'relative',
  };

  const satisfactionFillStyle = {
    height: '40px',
    width: `${plantSatisfactionValue}%`,
    backgroundColor: satisfactionColors[plantSatisfaction],
    borderRadius: '12px',
    transition: 'width 0.3s ease-in-out'
  };

  const calculateWidthSize = (originalSize, ratio) => {
    return Math.round(window.innerWidth * ratio) || originalSize;
  };

  const calculateHeightSize = (originalSize, ratio) => {
    return Math.round(window.innerHeight * ratio) || originalSize;
  };

  return (
    <div style={{
      padding: '5vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', // 필요에 따라 배경 크기 조정
      backgroundPosition: 'center', // 이미지를 중앙에 배치
      backgroundRepeat: 'no-repeat', // 이미지를 반복하지 않음
      height: '100vh' // 배경이 전체 뷰포트를 덮도록 설정
    }}>
      <div className="container d-flex justify-content-center vh-50" style={{ width: calculateWidthSize(500, 0.4), height: calculateHeightSize(100, 0.3) }}>
        <div className="d-flex flex-column align-items-center">
          <PlantConditionModal
            isOpen={isConditionModalOpen}
            onClose={() => conditionModalOpen(false)}
          />
          <PlantAutocontrolModal
            isOpen={isToggleModalOpen}
            onClose={() => toggleModalOpen(false)}
          />
          <CalendarModal
            isOpen={isCalendarModalOpen}
            onClose={() => calendarModalOpen(false)}
          />
          <ControlLightModal
            isOpen={isControlLightModalOpen}
            onClose={() => controlLightModalOpen(false)}
          />
          <ControlWaterModal
            isOpen={isControlWaterModalOpen}
            onClose={() => controlWaterModalOpen(false)}
          />
          <WaterAlertModal
            isOpen={isWaterAlertModalOpen}
            onClose={() => setWaterAlertModalOpen(false)}
          />

          {/* 센서값에 따른 바 표시 */}
          <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <div style={satisfactionBackgroundStyle} onClick={handleBarClick}>
              <div style={satisfactionFillStyle}></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span>식물 만족도: {plantSatisfaction}</span>
            </div>
          </div>

          {/* 식물 이미지가 들어 갈 자리 */}
          <div className="plant_image" style={{}}>
            <img
              src={plantImageUrl}
              alt="식물 이미지"
              style={{ height: '45vh', width: 'auto' }} />
          </div>

          {/* 식물 이름이 들어 갈 자리 */}
          <div className="plant_info" style={{}}>
            <text style={boxStyle}>{plantName}</text>
          </div>

          {/* 경험치 바와 레벨업 정보 */}
          <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <div style={expBackgroundStyle}>
              <div style={expFillStyle}></div>
              <div style={expGoalIconStyle}></div> {/* 목표 이미지 추가 */}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p>
                <span style={{ marginRight: '10px' }}>Lv{plantLevel}</span>
                레벨업까지 <span style={{ color: '#FF3333' }}>{Math.ceil(100 - plantExp).toFixed(2)}%</span> 남음
              </p>
            </div>
          </div>


          <div className="menu-bar">
            <img src={require('../img/BottomBar.png')} alt="Description" usemap="#image-map" />
            <map name="image-map">
              <area shape="rect" coords="0,0,75,180" alt="Link 1" onClick={camera} />
              <area shape="rect" coords="75,0,150,180" alt="Link 2" onClick={() => calendarModalOpen(true)} />
              <area shape="rect" coords="150,0,225,180" alt="Link 3" onClick={() => toggleModalOpen(true)} />
              <area shape="rect" coords="225,0,300,180" alt="Link 4" onClick={() => controlLightModalOpen(true)} />
              <area shape="rect" coords="300,0,375,180" alt="Link 5" onClick={() => controlWaterModalOpen(true)} />
            </map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;