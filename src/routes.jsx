import { Agregar } from "./Agregar";
import { Coordenadas } from "./Coordenadas";
import { Login } from "./Login";
import { Rutas } from "./Rutas";

export const routes = [
    //Redireccion
    { path: '/', component: <Login /> },
    { path: '/rutas', component: <Rutas /> },
    { path: '/coordenadas/:ruta', component: <Coordenadas /> },
    { path: '/agregar', component: <Agregar /> }
    
]