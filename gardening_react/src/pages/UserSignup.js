import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserLoginModal from '../components/UserLoginModal';

const UserSignup = () => {
  const navigate = useNavigate();
  let [name, setName] = useState('');
  let [sex, setSex] = useState(true);
  let [nickname, setNickname] = useState('');
  let [year, setYear] = useState('');
  let [month, setMonth] = useState('');
  let [day, setDay] = useState('');
  let [email, setEmail] = useState('');
  let [pwd, setPwd] = useState('');
  let [pwdconfirm, setPwdconfirm] = useState(''); // 패스워드 일치여부 확인용
  let [showModal, setShowModal] = useState(false);
  let [modalMessage, setModalMessage] = useState('');
  let [errorMessage, setErrorMessage] = useState('');

  const checkPassword = () => {
    if (pwd !== pwdconfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
      return false;
    } else {
      setErrorMessage('');
      return true;
    }
  };

  const onSubmit = async () => {
    if (!checkPassword()) return;

    const formatYear = year.replace('년', '');
    const formatMonth = month.replace('월', '').padStart(2, '0');
    const formatDay = day.replace('일', '').padStart(2, '0');

    // year, month, day를 'YYYY-MM-DD' 형식의 문자열로 합치기
    const birthdate = `${formatYear}-${formatMonth}-${formatDay}`;

    const userData = {
      username: name,
      gender: sex,
      nickname: nickname,
      birth: birthdate,
      email: email,
      password: pwd,
    };

    try {
      const response = await axios.post('/api/user', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('User registered successfully');
        navigate('/user/login');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        '회원가입에 실패했습니다. 다시 시도해 주세요.';
      setModalMessage(message);
      setShowModal(true);
    }
  };

  const goBack = () => {
    navigate('/user/login');
  };

  // 생일 데이터 : 년,월,일
  const BIRTHDAY_YEAR_LIST = Array.from(
    { length: 25 },
    (_, i) => `${i + 1990}년`
  );
  const BIRTHDAY_MONTH_LIST = Array.from(
    { length: 12 },
    (_, i) => `${i + 1}월`
  );
  const BIRTHDAY_DAY_LIST = Array.from({ length: 31 }, (_, i) => `${i + 1}일`);
  const SEX_LIST = ['남', '여'];

  const handleSexChange = (e) => {
    const selectedSex = e.target.value;
    setSex(selectedSex === '남');
  };

  const calculateWidthSize = (originalSize, ratio) => {
    return Math.round(window.innerWidth * ratio) || originalSize;
  };

  const calculateHeightSize = (originalSize, ratio) => {
    return Math.round(window.innerHeight * ratio) || originalSize;
  };

  return (
    <div style={{ padding: '140px' }}>
      <UserLoginModal
        content={modalMessage}
        isOpen={showModal}
        setIsOpen={setShowModal}
        closeMethod={() => setShowModal(false)}
      />
      <div
        className="container d-flex justify-content-center vh-50"
        style={{
          width: calculateWidthSize(500, 0.4),
          height: calculateHeightSize(100, 0.3),
        }}
      >
        <div className="d-flex flex-column align-items-center">
          <h1 style={{ fontFamily: 'SansM', fontSize: '35px' }}>회원가입</h1>
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <div className="emailFrame" style={{ marginTop: '20px' }}>
              <input
                className="form-login"
                style={{
                  fontFamily: 'SansM',
                  padding: '15px',
                  fontSize: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="pwdFrame" style={{ marginTop: '20px' }}>
              <input
                className="form-login"
                style={{
                  fontFamily: 'SansM',
                  padding: '15px',
                  fontSize: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                type="password"
                placeholder="비밀번호 입력"
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value);
                }}
                required
              />
            </div>
            <div className="pwdConfirmFrame" style={{ marginTop: '20px' }}>
              <input
                className="form-login"
                style={{
                  fontFamily: 'SansM',
                  padding: '15px',
                  fontSize: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                type="password"
                placeholder="비밀번호 재입력"
                value={pwdconfirm}
                onChange={(e) => {
                  setPwdconfirm(e.target.value);
                }}
                onBlur={checkPassword} // 입력 필드에서 포커스가 벗어날 때 검사
                required
              />
            </div>
            <div className="nameFrame-sexFrame" style={{ marginTop: '20px' }}>
              <input
                className="form-login"
                style={{
                  fontFamily: 'SansM',
                  padding: '15px',
                  fontSize: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  width: '300px',
                  marginRight: '40px',
                }}
                type="name"
                placeholder="이름"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
              <select
                className="sexBox"
                style={{
                  fontFamily: 'SansM',
                  padding: '15px',
                  fontSize: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                value={sex ? '남' : '여'}
                onChange={handleSexChange}
                required
              >
                <option value="" disabled>
                  성별
                </option>
                {SEX_LIST.map((sex, index) => (
                  <option key={index}>{sex}</option>
                ))}
              </select>
            </div>
            <div className="nicknameFrame" style={{ marginTop: '20px' }}>
              <input
                className="nicknameBox"
                style={{
                  fontFamily: 'SansM',
                  padding: '15px',
                  fontSize: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                type="nickname"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                required
              />
            </div>
            <div className="birthdateFrame" style={{ marginTop: '20px' }}>
              <div className="birthdateSelectFrame">
                <label
                  className="form-label"
                  style={{
                    fontFamily: 'SansM',
                    fontSize: '20px',
                    marginRight: '10px',
                  }}
                >
                  생년월일
                </label>
                <select
                  className="birthdateBox yearBox"
                  style={{
                    fontFamily: 'SansM',
                    padding: '15px',
                    fontSize: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
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
                  style={{
                    fontFamily: 'SansM',
                    padding: '15px',
                    fontSize: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
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
                  style={{
                    fontFamily: 'SansM',
                    padding: '15px',
                    fontSize: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
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
          </div>

          <div>
            <div className="btn" style={{ marginTop: '40px' }}>
              <Link to="/user/login" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  onClick={onSubmit}
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <img
                    src={require('../img/CheckBtn.png')}
                    alt=""
                    className="btn-image"
                  />
                </button>
              </Link>
            </div>
          </div>
          <div>
            <div className="btn" style={{ marginTop: '20px' }}>
              <Link to="/user/login" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  onClick={goBack}
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <img
                    src={require('../img/BacktoBtn.png')}
                    alt=""
                    className="btn-image"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserSignup;
