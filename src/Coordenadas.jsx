import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { coordenadasURL, coordenadaxRutaURL } from "./API/apiurls";
import { useNavigate, useParams } from "react-router-dom";
import { useListarElementos } from "./Hooks/CRUDHooks";

export function Coordenadas() {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigate();
  const {ruta} = useParams();
  useListarElementos(`${coordenadaxRutaURL}${ruta}`, datos, setDatos);

  const generateTextFile = () => {
    const content = datos
      .map(
        (coordenada) =>
          `${coordenada.latitud} ${coordenada.longitud} ${coordenada.radio}  ${coordenada.velocidad} ${coordenada.sonidoVelocidad}  ${coordenada.sonidoGeocerca}\n`
      )
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "datos_coordenadas.txt";

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    link.dispatchEvent(event);

    URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      <h1>Coordenadas de la ruta {ruta}</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Radio</th>
            <th>Velocidad</th>
            <th>Sonido Velocidad</th>
            <th>Sonido Geocerca</th>
            <th>Ruta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((coordenada) => (
            <tr key={coordenada.id}>
              <td>{coordenada.id}</td>
              <td>{coordenada.latitud}</td>
              <td>{coordenada.longitud}</td>
              <td>{coordenada.radio}</td>
              <td>{coordenada.velocidad}</td>
              <td>{coordenada.sonidoVelocidad}</td>
              <td>{coordenada.sonidoGeocerca}</td>
              <td>{coordenada.rutasModel.nomruta}</td>
              <td>
                <Button onClick={() => navigation(`/editar/${coordenada.id}`)}>
                  Editar
                </Button>
                <Button
                  onClick={() => navigation(`/eliminar/${coordenada.id}`)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={generateTextFile}>Descargar txt</Button>
    </div>
  );
}
