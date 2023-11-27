import { Coordenadas } from "./Vistas/PanelCoordenadas/Coordenadas";
import { Login } from "./Vistas/Login";
import { Rutas } from "./Vistas/PanelRutas/Rutas";
import { GaleriaDeCercas } from "./Vistas/GaleriaDeCercas";
import { Dispositivos } from "./Vistas/PanelDispositivos/Dispositivos";
import { ConfiguracionDispositivos } from "./Vistas/PanelDispositivos/ConfiguracionDispositivos";


export const routes = [
    { path: '/', component: <Login /> },
    { path: '/rutas', component: <Rutas /> },
    { path: '/coordenadas/:ruta', component: <Coordenadas /> },
    { path: '/galeria', component: <GaleriaDeCercas /> },
    { path: '/dispositivos', component: <Dispositivos />},
    { path: '/configuracion-dispositivos', component: <ConfiguracionDispositivos />}
]