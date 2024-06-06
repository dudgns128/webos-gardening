import HomePage from './pages/HomePage';

import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import PlantSelection from './pages/PlantSelection';

import MainPage from './pages/MainPage';
import ControlLight from './pages/ControlLight';
import ControlWater from './pages/ControlWater';

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
        component: PlantSelection
    },
    {
        path: '/main',
        component: MainPage
    },
    {
        path: '/plant/light',
        component: ControlLight
    },
    {
        path: '/plant/water',
        component: ControlWater
    },
]

export default routes;