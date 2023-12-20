// Constructs data related to the 'Route' table for a new route entry or edit
const buildRequestData = (datosFormulario, empresaid) => {
  return {
    nomruta: datosFormulario.nomruta,
    empresasModel: {
      id: empresaid,
    },
    paisesModel: {
      id: datosFormulario.paisId,
      nombre: datosFormulario.paisNombre,
    },
    estado: true,
  }; 
};

export default buildRequestData;