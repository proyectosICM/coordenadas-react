// This requestData is for 
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
