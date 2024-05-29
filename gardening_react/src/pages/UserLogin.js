import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserLoginModal from '../components/UserLoginModal';

const UserLogin = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [pwd,setPwd] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // useEffect(() => {
    //     // 웹소켓 연결 생성
    //     const websocket = new WebSocket('ws://localhost:3000');
    //     websocket.onopen = () => {
    //         console.log('웹소켓 연결 성공');
    //     };

    //     websocket.onerror = (error) => {
    //         console.error('웹소켓 오류', error);
    //     };
    //     setWs(websocket);     

    //     websocket.onmessage = (event) => {
    //         // 서버로부터 메시지 수신
    //         const data = JSON.parse(event.data);
    //         if (data.status === 'success') {
    //             navigate('/user/plant');
    //         } else {
    //             setModalMessage("비밀번호가 틀렸습니다. 다시 시도해주세요.");
    //             setShowModal(true);
    //         }
    //     };
    // }, [navigate]);

    const onSubmit = () => {
        const data = {
            email: email,
            password: pwd
        };
        // 스토리지 저장해서 다음 식물정보등록할 때, 같이 서버로 전송
        localStorage.setItem('email', email);
        localStorage.setItem('password', pwd);
    };

    const calculateWidthSize = (originalSize, ratio) => {
        return Math.round(window.innerWidth * ratio) || originalSize;
      };
    
    const calculateHeightSize = (originalSize, ratio) => {
        return Math.round(window.innerHeight * ratio) || originalSize;
    };

    return (
        <div style = {{padding: '140px'}}>
            <UserLoginModal 
            content={modalMessage} 
            isOpen={showModal} 
            setIsOpen={setShowModal} 
            closeMethod={() => setShowModal(false)}  
            />
            <div className="container d-flex justify-content-center vh-50" style={{ width: calculateWidthSize(500, 0.4), height: calculateHeightSize(100, 0.3) }}>
                <div className="d-flex flex-column align-items-center">
                    <h1 style = {{fontFamily: 'SansM', fontSize:'35px'}}>로그인</h1>
                    <div style={{ textAlign: 'center',paddingTop:'20px' }}>
                        <div className="emailFrame" style={{ marginTop: '40px' }}>
                            <input
                                className="form-login"
                                style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc'}}
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
                                style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                                type="password"
                                placeholder="비밀번호 입력"
                                value={pwd}
                                onChange={(e) => {
                                    setPwd(e.target.value);
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="btn" style={{ marginTop: '40px' }}>
                            <Link to="/user/plant" style={{ textDecoration: 'none' }}>
                                <button type="button" onClick ={onSubmit} style={{ background: 'transparent', border: 'none' }}>
                                    <img src={require('../img/CheckBtn.png')} alt="" className="btn-image"/>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className="btn" style={{ marginTop: '20px' }}>
                            <Link to="/user/signup" style={{ textDecoration: 'none' }}>
                                <button type="button" onClick ={onSubmit} style={{ background: 'transparent', border: 'none' }}>
                                    <img src={require('../img/SignupLink.png')} alt="" className="btn-image"/>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;