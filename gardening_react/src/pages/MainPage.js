import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlantConditionModal from '../components/PlantConditionModal';

const bridge = new WebOSServiceBridge();

const MainPage = () => {
  const navigate = useNavigate();

  const [sensorValue, setSensorValue] = useState(0);
  const [plantSatisfaction, setPlantSatisfaction] = useState('초기');
  const [plantImageUrl, setPlantImageUrl] = useState('');
  const [plantName, setPlantName] = useState('초기');
  const [plantLevel, setPlantLevel] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const satisfactionColors = {
    '매우 좋음': 'green', 
    '좋음': 'lightgreen', 
    '보통': 'yellow', 
    '나쁨': 'orange',
    '아주 나쁨': 'red'
  };

  useEffect(() => {
    const serviceURL = "luna://com.team11.homegardening.service/getPlantSatisfaction"; // 사용할 서비스의 URL

    bridge.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      setSensorValue(response.satisfaction);
    };

    // 5초마다 센서 값을 가져오는 인터벌 설정
    const intervalId = setInterval(bridge.call(serviceURL, '{}'), 5000);

    // 컴포넌트가 언마운트될 때 인터벌 정리
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const serviceURL = "luna://com.team11.homegardening.service/getPlantInfo"; // 사용할 서비스의 URL


    bridge.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      setPlantImageUrl(response.normalImageUrl);
      setPlantName(response.name);
    };

    bridge.call(serviceURL, '{}');

    const levelserviceURL = "luna://com.team11.homegardening.service/getPlantLevel"; // 사용할 서비스의 URL

    bridge.onservicecallback = function (msg) {
      const response = JSON.parse(msg);
      setPlantLevel(response.level);
    };

    bridge.call(levelserviceURL, '{}');
    // // localStorage에서 plantSpecies 이름을 가져옴
    // const plantSpecies = localStorage.getItem('plantSpecies');
    // // plantSpecies 이름을 기반으로 이미지 URL 키 생성
    // const imageKey = `${plantSpecies}-image`;
    // // 생성된 키로 localStorage에서 이미지 URL 가져오기
    // const storedImageUrl = localStorage.getItem(imageKey);
  
    // if (storedImageUrl) {
    //   setPlantImageUrl(storedImageUrl);
    // }
  }, [])



  useEffect(() => {
    // 센서 값에 따른 식물 만족도 설정
    if (80 < sensorValue && sensorValue <= 100 ) {
      setPlantSatisfaction('매우 좋음');
    } else if (60 < sensorValue && sensorValue <= 80) {
      setPlantSatisfaction('좋음');
    } else if (40 < sensorValue && sensorValue <= 60) {
      setPlantSatisfaction('보통');
    } else if (20 < sensorValue && sensorValue <= 40) {
      setPlantSatisfaction('나쁨');
    } else if (0 < sensorValue && sensorValue <= 20) {
      setPlantSatisfaction('아주 나쁨');
    }
  }, [sensorValue]);


  const handleBarClick = () => {
    setIsModalOpen(true);
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
    gap: '4px'
  };

  const calculateWidthSize = (originalSize, ratio) => {
    return Math.round(window.innerWidth * ratio) || originalSize;
  };

  const calculateHeightSize = (originalSize, ratio) => {
    return Math.round(window.innerHeight * ratio) || originalSize;
  };

  return (
    <div style = {{padding: '140px'}}>
      <div className="container d-flex justify-content-center vh-50" style={{ width: calculateWidthSize(500, 0.4), height: calculateHeightSize(100, 0.3) }}>
        <div className="d-flex flex-column align-items-center">
        <PlantConditionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />
          {/* 센서값에 따른 바 표시 */}
          <div>
            <div
              style={{
                backgroundColor: satisfactionColors[plantSatisfaction] || 'grey' ,
                width: `${sensorValue}%`,
                height: '40px',
                borderRadius: '10px'
              }}
              onClick={handleBarClick} // onClick 이벤트 핸들러 추가
            ></div>
            <p>Sensor Value: {sensorValue}</p>
            <p>Plant Satisfaction: {plantSatisfaction}</p>
          </div>

          {/* 식물 이미지가 들어 갈 자리 */}
          <div className="plant_image" style={{ marginTop: '40px' }}>
            <img src={plantImageUrl} alt="식물 이미지" />
            {/* {plantImageUrl ? (
              <img src={plantImageUrl} alt="식물 이미지" />
            ) : (
              <img src={require('../img/cacus.png')} alt="선인장 이미지" />
            )}*/}
          </div> 

          {/* 식물 이름이 들어 갈 자리 */}
          <div className="plant_info" style={{ marginTop: '40px'}}>
            <text style={boxStyle}>{plantName}{plantLevel}</text>
          </div>

          <div className="menu-bar">
            <img src={require('../img/BottomBar.png')} alt="Description" usemap="#image-map" />
              <map name="image-map">
                <area shape="rect" coords="0,0,75,180" alt="Link 1" onClick={() => navigate('/main/info')} />
                <area shape="rect" coords="75,0,150,180" alt="Link 2" onClick={() => navigate('/main/calendar')} />
                <area shape="rect" coords="150,0,225,180" alt="Link 3" onClick={() => navigate('/main/plant')} />
                <area shape="rect" coords="225,0,300,180" alt="Link 4" onClick={() => navigate('/main/sun')} />
                <area shape="rect" coords="300,0,375,180" alt="Link 5" onClick={() => navigate('/main/water')} />
              </map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
