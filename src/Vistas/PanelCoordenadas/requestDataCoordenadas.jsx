const buildRequestData = (datosFormulario, ruta) => {
    return {
      coordenadas: datosFormulario.coordenadas,
      radio: datosFormulario.radio,
      sonidosVelocidadModel: {
        id: datosFormulario.velocidad,
        nombre: datosFormulario.velocidadValor,
        codvel: datosFormulario.codvel,
      },
      sonidosGeocercaModel: {
        id: datosFormulario.sonidoGeocerca,
        codsonido: datosFormulario.codsonidoG,
      },
      rutasModel: {
        id: ruta,
      },
    };
  };
  
  export default buildRequestData;