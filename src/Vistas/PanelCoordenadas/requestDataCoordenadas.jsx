const buildRequestData = (datosFormulario, ruta) => {
    return {
      coordenadas: datosFormulario.coordenadas,
      radio: datosFormulario.radio,
      sonidosVelocidadModel: {
        id: datosFormulario.velocidad,
        /*
        nombre: datosFormulario.velocidadValor,
        codvel: datosFormulario.codvel,*/
      },
      sonidosGeocercaModel: {
        id: datosFormulario.geocerca,
        /*
        codsonido: datosFormulario.codsonidoG,
        */
      },
      rutasModel: {
        id: ruta,
      },
    };
  };
  
  export default buildRequestData;