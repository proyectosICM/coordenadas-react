//export const base = 'http://localhost:8087/api';
//export const base = 'http://192.168.1.232:8081/api';


// export const base = "http://192.168.1.202:8081/api";

export const base = "http://192.168.1.202:8081/api"

export const loginURL = `${base}/empresas/login`

// Ruta
export const rutasURL = `${base}/rutas`;
export const rutasxEmpresaURL = `${rutasURL}/xempresa/`

// Coordenadas
export const coordenadasURL = `${base}/coordenadas`
export const coordenadaxRutaURL = `${coordenadasURL}/ruta/`

// Paises
export const paisesURL = `${base}/paises`;

// Velocidad
export const sonidosVelocidadURL = `${base}/sonidosVelocidad`

// GeoCerca
export const GeocercaURL = `${base}/SonidoGeo`
export const GeocercaxPaisURL = `${base}/SonidoGeo/xpais/`
export const GeocercaxTipoSURL = `${base}/SonidoGeo/xtipoS/`
export const GeocercaxPaisxTipoURL = `${base}/SonidoGeo/xpaisxtipo/`

// TipoS
export const TipoSURL = `${base}/tipoS`
