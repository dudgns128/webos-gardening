import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlantConditionModal from '../components/PlantConditionModal';
import PlantAutocontrolModal from '../components/PlantAutocontrolModal';
import CalendarModal from '../components/CalendarModal';
import WebSocketUtil from '../WebSocketUtil';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const MainPage = () => {
  const navigate = useNavigate();

  let [sensorValue, setSensorValue] = useState(0);
  let [plantSatisfaction, setPlantSatisfaction] = useState('초기');
  let [plantImageUrl, setPlantImageUrl] = useState('');
  let [plantName, setPlantName] = useState('초기');
  let [plantLevel, setPlantLevel] = useState(0);
  let [isConditionModalOpen, conditionModalOpen] = useState(false);
  let [isToggleModalOpen, toggleModalOpen] = useState(false);
  let [isCalendarModalOpen, calendarModalOpen] = useState(false);

  const query = useQuery();
  const plantId = query.get('plantId'); // 이전 페이지에서 선택한 plantId 로 웹소켓 연결 설정하면 됨.

  const satisfactionColors = {
    '매우 좋음': '#00A35E',
    좋음: 'lightgreen',
    보통: 'yellow',
    나쁨: 'orange',
    '아주 나쁨': 'red',
  };

  useEffect(() => {
    const updateValues = function () {
      setSensorValue((WebSocketUtil.plantData.water + WebSocketUtil.plantData.light + WebSocketUtil.plantData.temperature + WebSocketUtil.plantData.humidity) / 4);
      setPlantSatisfaction(WebSocketUtil.plantData.satisfaction);
      setPlantImageUrl(WebSocketUtil.plantData.imageUrl);
      setPlantName(WebSocketUtil.plantData.plantName);
      setPlantLevel(WebSocketUtil.plantData.level);
    }

    // 3초마다 센서 값을 가져오는 인터벌 설정
    const intervalId = setInterval(() => updateValues(), 3000);

    // 컴포넌트가 언마운트될 때 인터벌 정리
    return () => clearInterval(intervalId);
  }, [plantSatisfaction, plantImageUrl, plantLevel, sensorValue]);

  const handleBarClick = () => {
    conditionModalOpen(true);
  };

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
    gap: '4px',
  };

  const calculateWidthSize = (originalSize, ratio) => {
    return Math.round(window.innerWidth * ratio) || originalSize;
  };

  const calculateHeightSize = (originalSize, ratio) => {
    return Math.round(window.innerHeight * ratio) || originalSize;
  };

  return (
    <div style={{ padding: '140px' }}>
      <div
        className="container d-flex justify-content-center vh-50"
        style={{
          width: calculateWidthSize(500, 0.4),
          height: calculateHeightSize(100, 0.3),
        }}
      >
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
          {/* 센서값에 따른 바 표시 */}
          <div>
            <div
              style={{
                backgroundColor:
                  satisfactionColors[plantSatisfaction] || 'grey',
                width: `${sensorValue}%`,
                height: '40px',
                borderRadius: '10px',
              }}
              onClick={handleBarClick} // onClick 이벤트 핸들러 추가
            ></div>
            <p>Sensor Value: {sensorValue}</p>
            <p>Plant Satisfaction: {plantSatisfaction}</p>
          </div>

          {/* 식물 이미지가 들어 갈 자리 */}
          <div className="plant_image" style={{ marginTop: '40px' }}>
            <img src={plantImageUrl} alt="식물 이미지" />
          </div>

          {/* 식물 이름이 들어 갈 자리 */}
          <div className="plant_info" style={{ marginTop: '40px' }}>
            <text style={boxStyle}>
              {plantName}
              {plantLevel}
            </text>
          </div>

          <div className="menu-bar">
            <img
              src={require('../img/BottomBar.png')}
              alt="Description"
              usemap="#image-map"
            />
            <map name="image-map">
              <area
                shape="rect"
                coords="0,0,75,180"
                alt="Link 1"
                onClick={() => navigate('/main/info')}
              />
              <area
                shape="rect"
                coords="75,0,150,180"
                alt="Link 2"
                onClick={() => calendarModalOpen(true)}
              />
              <area
                shape="rect"
                coords="150,0,225,180"
                alt="Link 3"
                onClick={() => toggleModalOpen(true)}
              />
              <area
                shape="rect"
                coords="225,0,300,180"
                alt="Link 4"
                onClick={() => navigate('/main/sun')}
              />
              <area
                shape="rect"
                coords="300,0,375,180"
                alt="Link 5"
                onClick={() => navigate('/main/water')}
              />
            </map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
