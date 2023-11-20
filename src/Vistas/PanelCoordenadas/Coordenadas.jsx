import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { GrEdit } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import { coordenadasURL, coordenadaxRutaURL } from "../../API/apiurls";
import { useListarElementos } from "../../Hooks/CRUDHooks";
import { BsXCircleFill, BsPlusCircleFill } from "react-icons/bs";
import CoordenadasModal from "./CoordenadasModal";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "../../Common/NavBar";
import { FaDownload } from "react-icons/fa";
import {   goToNextPage, goToPreviousPage } from "./PaginacionUtils";

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
      const response = await axios.get(`http://localhost:8087/api/coordenadas/cxr/2?pageNumber=${page}`);
      setDatos(response.data.content);
      setTotalPages(response.data.totalPages); // Actualiza el estado de totalPages
      console.log(response.data.content);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  const handlePreviousPage = () => {
    setPageNumber(goToPreviousPage(currentPage)); // <-- Usa la función desde el módulo importado
    setCurrentPage(goToPreviousPage(currentPage)); // <-- Usa la función desde el módulo importado
  };
  
  const handleNextPage = () => {
    setPageNumber(goToNextPage(currentPage, totalPages)); // <-- Usa la función desde el módulo importado
    setCurrentPage(goToNextPage(currentPage, totalPages)); // <-- Usa la función desde el módulo importado
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
    const requestData = {
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
    const requestData = {
      coordenadas: dato.coordenadas,
      radio: dato.radio,
      sonidosVelocidadModel: {
        id: dato.velocidad,
        nombre: dato.velocidadValor,
        codvel: dato.codvel,
      },
      sonidosGeocercaModel: {
        id: dato.sonidoGeocerca,
        codsonido: dato.codsonidoG,
      },
      rutasModel: {
        id: ruta,
      },
    };
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

  const generateTextFile = () => {
    const content = datos
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
    <>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <Button style={{ width: "100%" }} onClick={() => navigation("/rutas")}>
          Atras
        </Button>
        <h1>Coordenadas de la ruta {nomRuta}</h1>
        <Button variant="success" style={{ margin: "30px" }} onClick={() => handleShowModal("Nuevo")}>
          <BsPlusCircleFill /> Agregar
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Latitud - Longuitud</th>
              <th>Radio</th>
              <th>Velocidad</th>
              <th>Sonido Velocidad</th>
              <th>Sonido Geocerca</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos &&
              datos.map((coordenada) => (
                <tr key={coordenada.id}>
                  <td>{coordenada.id}</td>
                  <td>{coordenada.coordenadas}</td>
                  <td>{coordenada.radio}</td>
                  <td>{coordenada.sonidosVelocidadModel.nombre}</td>
                  <td>{coordenada.sonidosVelocidadModel.codvel}</td>
                  <td>{coordenada.sonidosGeocercaModel.codsonido}</td>
                  <td>
                    <Button variant="warning" style={{ marginInline: "10px" }} onClick={() => datosAEditar(coordenada)}>
                      <GrEdit /> Editar
                    </Button>
                    <Button variant="danger" style={{ marginInline: "10px" }} onClick={() => handleEliminar(coordenada.id)}>
                      <BsXCircleFill /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {/* Botones de paginación */}
        <div style={{ marginTop: "30px", width:"100%", userSelect: "none"  }}>
          <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
            Anterior
          </Button>
          <span style={{ margin: "0 10px" }}>Página {currentPage + 1} de {totalPages}</span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Siguiente
          </Button>
        </div>

        <Button onClick={generateTextFile} style={{ marginTop: "30px"}}>
          <FaDownload /> Descargar txt
        </Button>
      </div>
      <CoordenadasModal mostrar={show} cerrar={handleCerrar} guardar={handleGuardar} datosaeditar={datosEdit} editar={handleEditar} limp={limp} />
    </>
  );
}
