import HomePage from './pages/HomePage';

import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import UserPlantRegister from './pages/UserPlantRegister';

import MainPage from './pages/MainPage';

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
]

export default routes;