import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coordenadacxrURL, coordenadasURL } from "../../API/apiurls";
import CoordenadasModal from "./CoordenadasModal";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "../../Common/NavBar";

import buildRequestData from "./requestDataCoordenadas";
import { CoordenadasTabla } from "./CoordenadasTabla";
import { DownloadTxt } from "./DownloadTXT";
import { PaginacionUtils } from "../../Hooks/PaginacionUtils";
import { EditarElemento, GuardarElementos } from "../../Hooks/CRUDHooks";
import useErrorHandler from "../../Hooks/useErrorHandler";
import { useGlobalState } from "../../Context/GlobalStateContext";
 
export function Coordenadas() {
  const { ruta } = useParams();
  const nomRuta = localStorage.getItem("nomRuta");

  // State variables
  const { userData } = useGlobalState();
  const { empresaId, empresaNombre } = userData;

  // Elements visibility state
  const [show, setShow] = useState(false);

  // Data for display and editing
  const [datos, setDatos] = useState([]);
  const [datosEdit, setDatosEdit] = useState(null);

  const [limp, setLimp] = useState(false);

  // Pagination state
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Retrieves error messages and the error handling function from the useErrorHandler hook
  const { errorMessage, handleErrorResponse } = useErrorHandler();

  // Function to retrieve and display data based on page
  const Listar = async (page) => {
    try {
      console.log(`${coordenadacxrURL}${ruta}?pageNumber=${page}`);
      const response = await axios.get(`http://localhost:8087/api/coordenadas/cxr/${ruta}?pageNumber=${page}`);
      setDatos(response.data.content);
      console.log(response.data.content)
      setTotalPages(response.data.totalPages);
      // setCurrentPage(response.data.number + 0);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // useEffect hook to trigger data loading when 'pageNumber' changes
  useEffect(() => {
    Listar(pageNumber);
  }, [pageNumber]);

  const handleShowModal = (t) => { 
    setShow(true);
    if (t == "Nuevo") {
      setLimp(true);
    }
  };

  // Function to close the modal and reset data
  const handleCerrar = () => {
    setShow(false);
    setLimp(false);
  };

  // Function to display the modal and load data for editing
  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
  };

  // Function to save new data and handle the response
  const handleGuardar = (datosFormulario) => {
    console.log(datosFormulario)
    const requestData = buildRequestData(datosFormulario, ruta);
    GuardarElementos(`${coordenadasURL}`, requestData, datos, setDatos)
      .then(() => {
        Listar(pageNumber + 1);
        setShow(false);
      })
      .catch(handleErrorResponse);
  };

  // Function to edit data and handle the response
  const handleEditar = async (dato) => {
    try {
      const requestData = buildRequestData(dato, ruta);
      await EditarElemento(`${coordenadasURL}/${dato.id}`, requestData);
      setShow(false);
      Listar(pageNumber + 1);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  // Function to perform logical deletion (disable) of data and handle the response
  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Esta seguro de eliminar este registro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${coordenadasURL}/${id}`)
          .then(() => {
            const nuevosDatos = datos.filter((coordenada) => coordenada.id !== id);
            setDatos(nuevosDatos);
            Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
          })
          .catch(handleErrorResponse);
      }
    });
  };

  return (
    <>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <CoordenadasTabla datos={datos} datosAEditar={datosAEditar} handleEliminar={handleEliminar} handleShowModal={handleShowModal} />
        <PaginacionUtils setPageNumber={setPageNumber} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
        <DownloadTxt ruta={ruta} />
      </div>
      <CoordenadasModal
        handleGuardar={handleGuardar}
        mostrar={show}
        cerrar={handleCerrar}
        guardar={handleGuardar}
        datosaeditar={datosEdit}
        editar={handleEditar}
        limp={limp}
      />
    </>
  );
}
