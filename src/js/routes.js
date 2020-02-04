import HomePage from '../pages/home.f7.html';
import InicioPage from '../pages/inicio.f7.html';
import LogoutPage from '../pages/logout.f7.html';
import CheckinPage from '../pages/checkin.f7.html';
import CambiarStatusPage from '../pages/cambiarstatus.f7.html';
import EscanearPage from '../pages/escanear.f7.html';
import ConsultarPage from '../pages/consultar.f7.html';
import HojaGastosPage from '../pages/hojagastos.f7.html';
import AddGastosPage from '../pages/addgastos.f7.html';
import EditGastosPage from '../pages/editgastos.f7.html';
import DeleteGastosPage from '../pages/deletegastos.f7.html';
import AddProvdorPage from '../pages/addproveedor.f7.html';
import AddSolicitudPage from '../pages/addsolicitud.f7.html';
import SolicitudesPage from '../pages/solicitudes.f7.html';
import AddGastoSolicitudesPage from '../pages/solicitudgasto.f7.html';
import FotoAcusePage from '../pages/fotoacuse.f7.html';
import FotoGuiaPage from '../pages/fotoguia.f7.html';
import FotoGuiaLogifyPage from '../pages/fotoguialogify.f7.html';
import FotoGerentePage from '../pages/fotogerente.f7.html';
import FotoPeradorPage from '../pages/fotoperador.f7.html';

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
        path: '/hojagastos/',
        component: HojaGastosPage,
    },
    {
        path: '/addgastos/',
        component: AddGastosPage,
    },
    {
        path: '/editgastos/:idGasto',
        component: EditGastosPage,
    },
    {
        path: '/deletegastos/:idGasto',
        component: DeleteGastosPage,
    },
    {
        path: '/addproveedor/',
        component: AddProvdorPage,
    },
    {
        path: '/solicitudes/',
        component: SolicitudesPage,
    },
    {
        path: '/addsolicitud/',
        component: AddSolicitudPage,
    },
    {
        path: '/solicitudgasto/:idSolicitud',
        component: AddGastoSolicitudesPage,
    },
    {
        path: '/solicitudgasto/:idSolicitud',
        component: AddGastoSolicitudesPage,
    },
    {
        path: '/fotoacuse/:numGuia',
        component: FotoAcusePage,
    },
    /*{
        path: '/fotoguia/:numGuia',
        component: FotoGuiaPage,
    },
    {
        path: '/fotoguialogify/:numGuia',
        component: FotoGuiaLogifyPage,
    },
    {
        path: '/fotogerente/:numGuia',
        component: FotoGerentePage,
    },
    {
        path: '/fotoperador/:numGuia',
        component: FotoPeradorPage,
    },*/
    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;