import Home from "../pages/home/index.vue";
import homeRouter from '../pages/home/home-router';
import Login from "../pages/login/index.vue";


var routes = [
  {
    path: "/",
    redirect: '/home'
  },
  {
    path: "/home",
    name: 'name',
    component: Home,
    children: homeRouter
  },
  {
    path: "/login",
    name: 'login',
    component: Login
  }
]

export default routes;