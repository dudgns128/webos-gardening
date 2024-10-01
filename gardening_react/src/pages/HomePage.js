import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const nameStyle = {
    fontFamily: 'Reem Kufi',
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 'normal',
    background:
      'linear-gradient(92deg, #62AB19 6.16%, #90CA57 20.47%, #6DCF0B 33.53%, #6ED209 45.14%, #6ED805 59.16%, #72DC09 71.73%, #75E00A 84.31%, #71DF03 94.95%, #76E903 99.01%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/user/login');
    }, 3000); // 3000ms = 3s 후에 페이지를 이동

    return () => clearTimeout(timer); //
  }, []); //

  // 화면 크기에 따른 픽셀 값 계산
  const calculateWidthSize = (originalSize, ratio) => {
    return Math.round(window.innerWidth * ratio) || originalSize;
  };

  const calculateHeightSize = (originalSize, ratio) => {
    return Math.round(window.innerHeight * ratio) || originalSize;
  };

  return (
    <div
      style={{
        backgroundImage: `url()`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        padding: '200px',
      }}
    >
      <div className="container d-flex align-items-center justify-content-center vh-50">
        <div className="d-flex flex-column align-items-center">
          <div
            className="logo-container"
            style={{
              width: calculateWidthSize(720, 0.52),
              height: calculateHeightSize(220, 0.3),
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="139"
              height="74"
              viewBox="0 0 139 74"
              fill="none"
            >
              <path
                d="M52.1739 5.34552C67.7763 15.9675 71.8061 49.5108 71.8061 49.5108C71.8061 49.5108 24.7675 59.412 9.88335 39.9939C1.29763 28.7929 1.17564 4.92006 1.17564 4.92006C1.17564 4.92006 35.7103 -5.86279 52.1739 5.34552Z"
                fill="#59E031"
              />
              <path
                d="M52.4365 6.4381C68.5689 17.4041 72.9999 52.4283 72.9999 52.4283C72.9999 52.4283 24.7229 63.1871 9.25339 43.0212C0.330063 31.3888 -0.0001297 6.4381 -0.0001297 6.4381C-0.0001297 6.4381 35.4136 -5.13323 52.4365 6.4381Z"
                fill="#06B85B"
              />
              <path
                d="M72.4999 52.2953C57.9999 35.7953 42.9999 28.7953 28.9999 25.2953"
                stroke="#B4F077"
              />
              <path
                d="M86.8261 22.3455C71.2237 32.9675 67.1939 66.5108 67.1939 66.5108C67.1939 66.5108 114.232 76.412 129.117 56.9939C137.702 45.7929 137.824 21.9201 137.824 21.9201C137.824 21.9201 103.29 11.1372 86.8261 22.3455Z"
                fill="#11C869"
              />
              <path
                d="M86.8261 26.3455C71.2237 36.9675 67.1939 70.5108 67.1939 70.5108C67.1939 70.5108 114.232 80.412 129.117 60.9939C137.702 49.7929 137.824 25.9201 137.824 25.9201C137.824 25.9201 103.29 15.1372 86.8261 26.3455Z"
                fill="#06B85B"
              />
              <path
                d="M86.5635 23.4381C70.4311 34.4041 66.0001 69.4283 66.0001 69.4283C66.0001 69.4283 114.277 80.1871 129.747 60.0212C138.67 48.3888 139 23.4381 139 23.4381C139 23.4381 103.586 11.8668 86.5635 23.4381Z"
                fill="#009C4D"
              />
              <path
                d="M66.5001 69.2953C81.0001 52.7953 96.0001 45.7953 110 42.2953"
                stroke="#61FFAE"
              />
            </svg>

            <span style={nameStyle}>grown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
