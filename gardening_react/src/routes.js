import HomePage from './pages/HomePage';

import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import PlantSelection from './pages/PlantSelection';

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
        component: PlantSelection
    },
    {
        path: '/main',
        component: MainPage
    }
]

export default routes;