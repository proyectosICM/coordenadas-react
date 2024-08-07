import { Coordenadas } from "./Vistas/PanelCoordenadas/Coordenadas";
import { Login } from "./Vistas/Login";
import { Rutas } from "./Vistas/PanelRutas/Rutas";
import { GaleriaDeCercas } from "./Vistas/GaleriaDeCercas";
import { Dispositivos } from "./Vistas/PanelDispositivos/Dispositivos";
import { ConfiguracionDispositivos } from "./Vistas/PanelDispositivos/ConfiguracionDispositivos";
import { InicioAdmin } from "./Vistas/PanelAdministrador/InicioAdmin";
import { DispositivoAsoc } from "./Vistas/PanelAdministrador/DispositivosAdmin/DispositivoAsoc";
import { Empresas } from "./Vistas/PanelAdministrador/EmpresasAdmin/Empresas";
import { RutasAdmin } from "./Vistas/PanelAdministrador/RutasAdmin/RutasAdmin";


export const routes = [
    { path: '/', component: <Login /> },
    { path: '/rutas', component: <Rutas /> },
    { path: '/coordenadas/:ruta', component: <Coordenadas /> },
    { path: '/galeria', component: <GaleriaDeCercas /> },
    { path: '/dispositivos', component: <Dispositivos />},
    { path: '/configuracion-dispositivos', component: <ConfiguracionDispositivos />},

    //Administracion
    { path: '/panel-administrador', component: <InicioAdmin />},
    { path: '/dispositivo-asoc', component: <DispositivoAsoc />},
    { path: '/empresas-admin', component: <Empresas />},
    { path: '/rutas-admin', component: <RutasAdmin />}
] 