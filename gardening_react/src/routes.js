import HomePage from './pages/HomePage';

import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import UserInitial from './pages/UserInitial';


const routes = [
    {
        path :'/',
        component : HomePage
    },
    {
        path : '/user/login',
        component : UserLogin
    },
    {
        path : '/user/signup',
        component : UserSignup
    },
    {
        path : '/user/initial',
        component : UserInitial
    },
]

export default routes;