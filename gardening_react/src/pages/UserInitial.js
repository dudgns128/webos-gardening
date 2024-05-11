import {useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserLoginModal from '../components/UserLoginModal';

const UserInitial = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [pwd,setPwd] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

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
                    <h1 style = {{fontFamily: 'SansM', fontSize:'35px'}}>식물 등록하기</h1>
                    <div>
                        <div className="btn" style={{ width: calculateWidthSize(500, 0.8), height: calculateHeightSize(40, 0.1) }}>
                            <Link to="/user/initial/register" style={{ textDecoration: 'none' }}>
                                <button type="button" style={{ background: 'transparent', border: 'none' }}>
                                    <img src={require('../img/PlantRegister.png')} alt="" className="btn-image"/>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserInitial;