const buildRequestData = (datosFormulario, ruta) => {
    return {
      coordenadas: datosFormulario.coordenadas,
      radio: datosFormulario.radio,
      sonidosVelocidadModel: {
        id: datosFormulario.velocidad,
      },
      sonidosGeocercaModel: {
        id: datosFormulario.geocerca,
      },
      rutasModel: {
        id: ruta,
      },
    };
  };
  
  export default buildRequestData;