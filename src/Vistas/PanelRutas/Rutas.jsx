import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import RutasModal from "./RutasModal";
import NavBar from "../../Common/NavBar";
import buildRequestData from "./requestDataRutas";
import { RutasCard } from "./RutasCard";
import { EditarElemento, GuardarElementos } from "../../Hooks/CRUDHooks";
import { rutasDeshabilitar, rutasURL, rutasxEmpresaPURL } from "../../API/apiurls";
import { useGlobalState } from "../../Context/GlobalStateContext";
import { PaginacionUtils } from "../../Hooks/PaginacionUtils";
import "../../Styles/Rutas.css";
import useErrorHandler from "../../Hooks/useErrorHandler";

export function Rutas() {
  // State variables
  const { userData } = useGlobalState();
  const { empresaId, empresaNombre } = userData;

  // Elements visibility state
  const [show, setShow] = useState(false);

  // Data for display and editing
  const [datos, setDatos] = useState([]);
  const [datosEdit, setDatosEdit] = useState(null);

  // Pagination state
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Retrieves error messages and the error handling function from the useErrorHandler hook
  const { errorMessage, handleErrorResponse } = useErrorHandler();

  // Function to retrieve and display data based on page
  const Listar = async (page) => {
    try {
      const response = await axios.get(`${rutasxEmpresaPURL}1/${empresaId}?pageNumber=${page}`);
      setDatos(response.data.content);
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

  // Function to close the modal and reset data
  const handleCerrar = () => {
    setShow(false);
    setDatosEdit(null);
  };

  // Function to display the modal and load data for editing
  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
  };

  // Function to save new data and handle the response
  const handleGuardar = (datosFormulario) => {
    const requestData = buildRequestData(datosFormulario, empresaId);
    GuardarElementos(`${rutasURL}`, requestData, datos, setDatos)
      .then(() => {
        setShow(false);
        Listar(pageNumber + 1);
      })
      .catch(handleErrorResponse);
  };

  // Function to edit data and handle the response
  const handleEditar = async (dato) => {
    console.log(dato)
    try {
      const requestData = buildRequestData(dato, empresaId);
      await EditarElemento(`${rutasURL}/${dato.id}`, requestData);
      setShow(false);
      Listar(pageNumber + 1);
    } catch (error) {
      console.log("ds")
      handleErrorResponse(error);
    }
  };

  // Function to perform logical deletion (disable) of data and handle the response
  const handleEliminar = (id) => {
    Swal.fire({
      title: `¿Está seguro de eliminar esta ruta?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar ruta",
      background: 'black',  // Fondo negro para el primer alerta
      color: 'white', // Color de texto blanco para el primer alerta
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        EditarElemento(`${rutasDeshabilitar}${id}/0`)
          .then(() => {
            const nuevosDatos = datos.filter((ruta) => ruta.id !== id);
            setDatos(nuevosDatos);
            // Asegúrate de aplicar los estilos personalizados aquí también
            Swal.fire({
              title: "Eliminado",
              text: "La ruta ha sido eliminada",
              icon: "success",
              background: 'black', // Fondo negro para el segundo alerta
              color: 'white', // Color de texto blanco para el segundo alerta
            });
          })
          .catch(handleErrorResponse);
      }
    });
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ color: "white" }}>Rutas de la empresa</h1>
      <Button style={{ margin: "10px" }} onClick={() => setShow(true)}>
        Crear nueva ruta
      </Button>
      <div className="camionesMenu-contenedor">
        {datos &&
          datos.map((ruta, index) => (
            <RutasCard key={ruta.id} index={index} ruta={ruta} empresaNombre={empresaNombre} datosAEditar={datosAEditar} handleEliminar={handleEliminar} />
          ))}
        {datos == undefined || (datos.length == 0 && <h1 style={{ textAlign: "center" }}>Su empresa no tiene rutas, por favor agregue una</h1>)}
        <PaginacionUtils setPageNumber={setPageNumber} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
      </div>
      <RutasModal mostrar={show} cerrar={() => handleCerrar()} guardar={handleGuardar} datosaeditar={datosEdit} editar={handleEditar} />
    </div>
  );
}
