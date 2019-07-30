
import HomePage from '../pages/home.f7.html';
import InicioPage from '../pages/inicio.f7.html';
import LogoutPage from '../pages/logout.f7.html';
import CheckinPage from '../pages/checkin.f7.html';
import CambiarStatusPage from '../pages/cambiarstatus.f7.html';
import EscanearPage from '../pages/escanear.f7.html';
import ConsultarPage from '../pages/consultar.f7.html';
//import ResetpassPage from '../pages/resetpass.f7.html';


import NotFoundPage from '../pages/404.f7.html';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/inicio/',
    component: InicioPage,
  },
  {
    path: '/logout/',
    component: LogoutPage,
  },
  {
    path: '/checkin/',
    component: CheckinPage,
  },
  {
    path: '/escanear/',
    component: EscanearPage,
  },
  {
    path: '/cambiarstatus/:numGuia',
    component: CambiarStatusPage,
  },
  {
    path: '/consultar/',
    component: ConsultarPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;