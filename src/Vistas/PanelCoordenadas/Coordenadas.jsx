import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { coordenadasURL } from "../../API/apiurls";
import { BsPlusCircleFill } from "react-icons/bs";
import CoordenadasModal from "./CoordenadasModal";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "../../Common/NavBar";

import buildRequestData from "./requestDataCoordenadas";
import { CoordenadasTabla } from "./CoordenadasTabla";
import { DownloadTxt } from "./DownloadTXT";
import { PaginacionUtils } from "./PaginacionUtils";

export function Coordenadas() {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigate();
  const { ruta } = useParams();
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);
  const nomRuta = localStorage.getItem("nomRuta");

  const [pageNumber, setPageNumber] = useState(0); // Número de página actual
  const [pageSize, setPageSize] = useState(3); // Tamaño de la página
  const [totalElements, setTotalElements] = useState(0); // Total de elementos
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [totalPages, setTotalPages] = useState(0);

  // useListarElementos(`${coordenadaxRutaURL}${ruta}`, datos, setDatos);
  // La función de carga de datos ahora acepta pageNumber y pageSize
  const cargarDatos = async (page, size) => {
    try {
      const response = await axios.get(`http://localhost:8087/api/coordenadas/cxr/${ruta}?pageNumber=${page}`);
      setDatos(response.data.content);
      setTotalPages(response.data.totalPages); // Actualiza el estado de totalPages
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };


  useEffect(() => {
    cargarDatos(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

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
  };

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
            // Filtra los datos para mantener solo los registros que no tienen el ID eliminado
            const nuevosDatos = datos.filter((coordenada) => coordenada.id !== id);
            setDatos(nuevosDatos); // Actualiza la variable de estado
            Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar los datos:", error);
            Swal.fire("Error", "Hubo un error al eliminar el registro", "error");
          });
      }
    });
  };

  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
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
    <>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <CoordenadasTabla datos={datos} datosAEditar={datosAEditar} handleEliminar={handleEliminar} handleShowModal={handleShowModal} />
        <PaginacionUtils setPageNumber={setPageNumber} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
        <DownloadTxt ruta={ruta}/>
      </div>
      <CoordenadasModal mostrar={show} cerrar={handleCerrar} guardar={handleGuardar} datosaeditar={datosEdit} editar={handleEditar} limp={limp} />
    </>
  );
}
