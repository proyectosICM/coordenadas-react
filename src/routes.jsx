import { Coordenadas } from "./Vistas/PanelCoordenadas/Coordenadas";
import { Login } from "./Vistas/Login";
import { Rutas } from "./Vistas/Rutas";
import { GaleriaDeCercas } from "./Vistas/GaleriaDeCercas";


export const routes = [
    { path: '/', component: <Login /> },
    { path: '/rutas', component: <Rutas /> },
    { path: '/coordenadas/:ruta', component: <Coordenadas /> },
    { path: '/galeria', component: <GaleriaDeCercas /> },
]