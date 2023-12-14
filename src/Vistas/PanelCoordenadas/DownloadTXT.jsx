import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useListarElementos } from "../../Hooks/CRUDHooks";
import { FaDownload } from "react-icons/fa";
import { coordenadaxRutaURL } from "../../API/apiurls";
import axios from "axios";

export function DownloadTxt({ ruta }) {
  const [datosC, setDatosC] = useState();

  useEffect(() => {
    axios.get(`${coordenadaxRutaURL}${ruta}`)
      .then(response => {
        setDatosC(response.data); // Asumiendo que la respuesta contiene los datos que necesitas
        // console.log(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const generateTextFile = (datosC) => {
    const content = datosC
      .map(
        (coordenada) =>
          `${coordenada.coordenadas}, ${coordenada.radio}, ${coordenada.sonidosVelocidadModel.nombre}, ${coordenada.sonidosVelocidadModel.codvel}, ${coordenada.sonidosGeocercaModel.codsonido}\n`
      )
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "ruta.txt";

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    link.dispatchEvent(event);

    URL.revokeObjectURL(link.href);
  };

  return (
    <Button variant="success" onClick={() => generateTextFile(datosC)} style={{ marginTop: "10px" }}>
      <FaDownload /> Descargar txt
    </Button>
  );
}
