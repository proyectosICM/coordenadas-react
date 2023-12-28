import React, { useState } from "react";
import NavBar from "../../Common/NavBar";
import { Button, Card } from "react-bootstrap";
import { BsGearFill, BsPlusCircleFill } from "react-icons/bs";
import { useNavigate, useNavigation } from "react-router-dom";
import { DispositivosModal } from "./DispositivosModal";

import { coordenadasURL } from "../../API/apiurls";
import buildRequestData from "../PanelCoordenadas/requestDataCoordenadas";
import Swal from "sweetalert2";
import axios from "axios";

export function Dispositivos() {
  const navigation = useNavigate();
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);
  const [datos, setDatos] = useState();

  const handleShowModal = (t) => {
    setShow(true);
    if (t == "Nuevo") {
      setLimp(true);
    }
  };

  const handleCerrar = () => {
    setShow(false);
    setLimp(false);
  };

  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
  };

  const handleGuardar = (datosFormulario) => {
    const requestData = buildRequestData(datosFormulario, ruta);
        axios
          .post(`${coordenadasURL}`, requestData)
          .then((response) => {
            setDatos([...datos, response.data]);
            setShow(false);
          })
          .catch((error) => {
            console.error("Error al guardar los datos:", error);
          });
    console.log("Ed");
  }; 

  const handleEditar = (dato) => {
    console.log(dato);
    const requestData = buildRequestData(dato, ruta);
    console.log(requestData);
    axios
      .put(`${coordenadasURL}/${dato.id}`, requestData)
      .then((response) => {
        // Actualiza los datos localmente en la lista
        const indice = datos.findIndex((item) => item.id === dato.id);
        if (indice !== -1) {
          const nuevosDatos = [...datos];
          nuevosDatos[indice] = response.data;
          setDatos(nuevosDatos);
        }

        setShow(false);
      })
      .catch((error) => {
        console.error("Error al editar los datos:", error);
        Swal.fire("Error", "Hubo un error al editar el registro", "error");
      });
  };

  return (
    <div>
      <NavBar />
      <h1>Dispositivos de la empresa</h1>

      <Button onClick={() => handleShowModal("Nuevo")}>
        <BsPlusCircleFill /> Reasigne dispositivos
      </Button>
      <div className="camionesMenu-contenedor">
        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px" }}>
          <Card.Body>
            <Card.Title>Dispositivos de la ruta ADC-009</Card.Title>
            <Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
            <Card.Text>33 Dispositivos actualizados </Card.Text>
          </Card.Body>
          <Button
            variant="danger"
            onClick={() => navigation("/configuracion-dispositivos")}
            style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}
          >
            <BsGearFill /> Configuracion
          </Button>
        </Card>

        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px" }}>
          <Card.Body>
            <Card.Title>Dispositivos libres de la empresa</Card.Title>
            <Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
            <Card.Text>33 Dispositivos actualizados </Card.Text>
          </Card.Body>
          <Button
            variant="danger"
            onClick={() => navigation("/configuracion-dispositivos")}
            style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}
          >
            <BsGearFill /> Configuracion
          </Button>
        </Card>
      </div>

      <DispositivosModal mostrar={show} cerrar={handleCerrar} guardar={handleGuardar} datosaeditar={datosEdit} editar={handleEditar} limp={limp} />
    </div>
  );
}
