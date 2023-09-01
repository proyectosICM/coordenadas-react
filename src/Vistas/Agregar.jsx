import React, { useState } from 'react';


export function Agregar() {
  const [longitud, setLongitud] = useState('');
  const [latitud, setLatitud] = useState('');
  const [radio, setRadio] = useState('');
  const [velocidad, setVelocidad] = useState('');
  const [sonidoVelocidad, setSonidoVelocidad] = useState('');
  const [codigoGeocerca, setCodigoGeocerca] = useState('');

  const generateTextFile = () => {
    const content = `${longitud}  ${latitud} ${radio} ${velocidad} ${sonidoVelocidad} ${codigoGeocerca}`;
    const blob = new Blob([content], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.target = '_blank';
    link.download = 'datos.txt';

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    link.dispatchEvent(event);

    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="App">
      <h2>Longitud</h2>
      <input
        type="text"
        value={longitud}
        onChange={(e) => setLongitud(e.target.value)}
      />

      <h2>Latitud</h2>
      <input
        type="text"
        value={latitud}
        onChange={(e) => setLatitud(e.target.value)}
      />

      <h2>Radio</h2>
      <input
        type="text"
        value={radio}
        onChange={(e) => setRadio(e.target.value)}
      />

      <h2>Velocidad</h2>
      <input
        type="text"
        value={velocidad}
        onChange={(e) => setVelocidad(e.target.value)}
      />

      <h2>Sonido Velocidad</h2>
      <input
        type="text"
        value={sonidoVelocidad}
        onChange={(e) => setSonidoVelocidad(e.target.value)}
      />

      <h2>Codigo Geocerca</h2>
      <input
        type="text"
        value={codigoGeocerca}
        onChange={(e) => setCodigoGeocerca(e.target.value)}
      />

      <h2>Descarge el archivo y guardelo en su </h2>
      <button onClick={generateTextFile}>Descargar</button>
    </div>
  );
}


