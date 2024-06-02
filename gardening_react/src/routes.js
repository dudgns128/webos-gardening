import HomePage from './pages/HomePage';

import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import UserPlantRegister from './pages/UserPlantRegister';

import MainPage from './pages/MainPage';
import ControlWater from './pages/ControlWater';
import ControlLight from './pages/ControlLight';
import PlantConditionModal from './components/PlantConditionModal';

const routes = [
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/user/login',
        component: UserLogin
    },
    {
        path: '/user/signup',
        component: UserSignup
    },
    {
        path: '/user/plant',
        component: UserPlantRegister
    },
    {
        path: '/main',
        component: MainPage
    },
    {
        path: '/control/water',
        component: ControlWater
    },
    {
        path: '/control/light',
        component: ControlLight
    },
    {
        path: '/plant/condition',
        component: PlantConditionModal
    },
]

export default routes;