export const dispositivoAsocRequestData = (datos, empresa) => {
  return {
    nombre: datos.nombre,
    rutasModel: datos.ruta !== null ? { id: datos.ruta } : null,
    empresasModel: {
      id: datos.empresa,
    },
  };
};
