import { Coordenadas } from "./Vistas/Coordenadas";
import { Login } from "./Vistas/Login";
import { Rutas } from "./Vistas/Rutas";
import { Agregar } from './Vistas/Agregar';
import { GaleriaDeCercas } from "./Vistas/GaleriaDeCercas";


export const routes = [
    //Redireccion
    { path: '/', component: <Login /> },
    { path: '/rutas', component: <Rutas /> },
    { path: '/coordenadas/:ruta', component: <Coordenadas /> },
    { path: '/galeria', component: <GaleriaDeCercas /> },
    { path: '/agregar', component: <Agregar /> }
    
]