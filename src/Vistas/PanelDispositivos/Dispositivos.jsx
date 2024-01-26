import React, { useEffect, useState } from "react";
import NavBar from "../../Common/NavBar";
import { Button, Card } from "react-bootstrap";
import { BsGearFill, BsPlusCircleFill } from "react-icons/bs";
import { useNavigate, useNavigation } from "react-router-dom";
import { DispositivosModal } from "./DispositivosModal";

import { DispositivosURL, DisxEmp, coordenadasURL } from "../../API/apiurls";
import buildRequestData from "../PanelCoordenadas/requestDataCoordenadas";
import Swal from "sweetalert2";
import axios from "axios";
import { EditarElemento } from "../../Hooks/CRUDHooks";
import { useGlobalState } from "../../Context/GlobalStateContext";
import useErrorHandler from "../../Hooks/useErrorHandler";

export function Dispositivos() {
  const navigation = useNavigate();
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);
  const [datos, setDatos] = useState();

  const { userData } = useGlobalState();
  const { empresaId, empresaNombre } = userData;
  const { errorMessage, handleErrorResponse } = useErrorHandler();

  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [dispositivos, setDispositivos] = useState([]);

  // Function to retrieve and display data based on page
  const Listar = async (page) => {
    try {
      const response = await axios.get(`${DisxEmp}?empresaId=${empresaId}&estado=${1}&pageNumber=${page}`);
      setDispositivos(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number + 0);
    } catch (error) {
      console.error("Error al listar", error);
    }
  };

  // useEffect hook to trigger data loading when 'pageNumber' changes
  useEffect(() => {
    Listar(pageNumber);
  }, [pageNumber]);

  const handleShowModal = (t) => {
    setShow(true);
    if (t === "Nuevo") {
      setLimp(true);
    }
  };
  console.log(dispositivos);
  const handleCerrar = () => {
    setShow(false);
    // setLimp(false);
  };

  const datosAEditar = (dispositivo) => {
    setDatosEdit(dispositivo);
    setShow(true);
  };

  const handleGuardar = async (dato) => {
    console.log(dato);
    try {
      const requestData = buildRequestData(dato, empresaId);
      await EditarElemento(`${DispositivosURL}/prop/${dato.id}`, requestData);
      setShow(false);
      Listar(pageNumber);
    } catch (error) {
      console.log("ds");
      handleErrorResponse(error);
    }
  };

  const handleEditar = async (dato) => {
    console.log(`${DispositivosURL}/prop/${dato.id}`);

    try {
      const requestData = {
        rutasModel: {
          id: dato.rutasModel.id,
        },
        velocidad: dato.velocidad,
        volumen: dato.volumen,
      };
      console.log(requestData);
      await EditarElemento(`${DispositivosURL}/prop/${dato.id}`, requestData);
      setShow(false);
      Listar(pageNumber);
    } catch (error) {
      console.log("ds");
      handleErrorResponse(error);
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Dispositivos de la empresa</h1>

      {/*     <Button onClick={() => handleShowModal("Nuevo")}>
        <BsPlusCircleFill /> Reasigne dispositivos
      </Button>

  <span> Filtrar por: </span> */}

      <div className="camionesMenu-contenedor">
        {dispositivos &&
          dispositivos.map((dispositivo) => (
            <Card key={dispositivo.id} style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px" }}>
              <Card.Body>
                <Card.Title>Identificador de dispositivo: {dispositivo.id}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
                <Card.Text>Empresa: {dispositivo.rutasModel.empresasModel.nombre}</Card.Text>
                <Card.Text>Ruta: {dispositivo.rutasModel.nomruta}</Card.Text>
                <Card.Text>Velocidad: {dispositivo.velocidad != null ? `${dispositivo.velocidad} KM/h` : "N/A"}</Card.Text>
                <Card.Text>Volumen: {dispositivo.volumen != null ? dispositivo.volumen : "N/A"}</Card.Text>
              </Card.Body>
              <Button
                variant="danger"
                onClick={() => datosAEditar(dispositivo)}
                style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}
              >
                <BsGearFill /> Configuracion
              </Button>
            </Card>
          ))}
      </div>

      <DispositivosModal mostrar={show} cerrar={handleCerrar} guardar={handleGuardar} datosaeditar={datosEdit} editar={handleEditar} limp={limp} />
    </div>
  );
}
