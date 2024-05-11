import {useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { display } from '../constants';
import UserLoginModal from '../components/UserLoginModal';

const UserSignup = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [pwd,setPwd] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const onSubmit = () => {
        const data = {
            email: email,
            password: pwd
        };
      
        axios.post(`${display}/user/login`, JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
            const data = res.data;
            if (data.status === 'success') { // 조건문의 괄호 위치와 중괄호 위치 수정
                navigate('/admin/menu');
            }
            else{
                setModalMessage("비밀번호가 틀렸습니다. 다시 시도해주세요.");
                setShowModal(true);
                return;
            }
        })
        .catch(error => {
            console.error(error);
        });
    };

    const goBack = () => {
        navigate('/');
    }
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
                        <div className="mb-3" >
                            <label className="from-label" style = {{fontFamily: 'SansM', fontSize:'20px'}}>사용자 이메일을 입력하세요</label>
                                <div>
                                <input
                                    className="form-login"
                                    style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                                </div>
                        </div>
                        <div className="mb-3" >
                            <label className="from-label" style = {{fontFamily: 'SansM', fontSize:'20px'}}>사용자 비밀번호를 입력하세요</label>
                                <div>
                                <input
                                    className="form-login"
                                    style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                                    type="password"
                                    value={pwd}
                                    onChange={(e) => {
                                        setPwd(e.target.value);
                                    }}
                                />
                                </div>
                        </div>
                        <div className="mb-3" >
                            <label className="from-label" style = {{fontFamily: 'SansM', fontSize:'20px'}}>사용자 비밀번호를 다시 입력하세요</label>
                                <div>
                                <input
                                    className="form-login"
                                    style={{ fontFamily: 'SansM',padding: '15px', fontSize: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                                    type="password"
                                    value={pwd}
                                    onChange={(e) => {
                                        setPwd(e.target.value);
                                    }}
                                />
                                </div>
                        </div>
                    </div>

                    <div>
                        <div className="btn" style={{ width: calculateWidthSize(400, 0.8), height: calculateHeightSize(40, 0.1) }}>
                            <Link to="/user/menu" style={{ textDecoration: 'none' }}>
                                <button type="button" onClick ={onSubmit} style={{ background: 'transparent', border: 'none' }}>
                                    <img src={require('../img/CheckBtn.png')} alt="" className="btn-image"/>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className="btn" style={{ width: calculateWidthSize(400, 0.8), height: calculateHeightSize(40, 0.1) }}>
                            <Link to="/" style={{ textDecoration: 'none' }}>
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
export default UserSignup;