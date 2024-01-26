// export const base = 'http://localhost:8087/api';
//export const base = 'http://192.168.1.232:8081/api';


// export const base = "http://192.168.1.202:8081/api";

export const base = "http://telemetriaperu.com:8087/api";

export const loginURL = `${base}/empresas/login`
 
// Ruta
export const rutasURL = `${base}/rutas`;
export const rutasxEmpresaURL = `${rutasURL}/xempresa`
export const rutasxEmpresaPURL = `${rutasURL}/xempresaP/`
export const rutasDeshabilitar = `${rutasURL}/estado/`
// Coordenadas
export const coordenadasURL = `${base}/coordenadas`
export const coordenadaxRutaURL = `${coordenadasURL}/ruta/`;
export const coordenadacxrURL = `·${coordenadasURL}/cxr/`

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

// Dispositivos
export const DispositivosURL = `${base}/dispositivos`
export const VerificarDisp = `${DispositivosURL}/verificar`
export const ReasignarDisp = `${DispositivosURL}/reasignar`

export const DisxEmp = `${DispositivosURL}/empresax`

//Empresas 
export const EmpresasURL = `${base}/empresas`
export const EmpresaFNombre = `${EmpresasURL}/findNombre`;
export const EmpresaFUsuario = `${EmpresasURL}/findUsuario`;