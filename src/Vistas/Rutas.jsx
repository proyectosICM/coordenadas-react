import React, { useState } from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import "../Styles/Rutas.css";
import { useNavigate } from "react-router-dom";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { coordenadasURL, coordenadaxRutaURL, rutasURL, rutasxEmpresaURL } from "../API/apiurls";
import { BsXCircleFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import Swal from "sweetalert2";
import axios from "axios";
import RutasModal from "./RutasModal";
import NavBar from "../Common/NavBar";
import { FaDownload } from "react-icons/fa";
import { AiFillProfile } from "react-icons/ai";

export function Rutas() {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigate();
  const empresaid = localStorage.getItem("empresa");
  const empresaNombre = localStorage.getItem("empresaNombre");
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  useListarElementos(`${rutasxEmpresaURL}${empresaid}`, datos, setDatos);

  const handleVerCoordenadas = async (dato) => {
    await localStorage.setItem("nomRuta", dato.nomruta);
    await localStorage.setItem("pais", dato.paisesModel.id);
    navigation(`/coordenadas/${dato.id}`);
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: `¿Esta seguro de eliminar esta ruta? ${id}`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar ruta",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${rutasURL}/${id}`)
          .then(() => {
            const nuevosDatos = datos.filter((ruta) => ruta.id !== id);
            setDatos(nuevosDatos);
            Swal.fire("Eliminado", "La ruta ha sido eliminada", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar los datos:", error);
            Swal.fire("Error", "Hubo un error al eliminar el registro", "error");
          });
      }
    });
  }; 

  const handleAbrir = () => {
    setShow(true);
  };

  const handleCerrar = () => {
    setShow(false);
    setDatosEdit(null);
  };

  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
  };

  const handleGuardar = (datosFormulario) => {
    const requestData = {
      nomruta: datosFormulario.nomruta,
      empresasModel: {
        id: empresaid,
      },
      paisesModel: {
        id: datosFormulario.paisId,
        nombre: datosFormulario.paisNombre,
      },
    };

    axios
      .post(`${rutasURL}`, requestData)
      .then((response) => {
        setDatos([...datos, response.data]);
        setShow(false);
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
      });
  };

  const handleEditar = (dato) => {
    console.log(dato);
    const requestData = {
      nomruta: dato.nomruta,
      empresasModel: {
        id: empresaid,
      },
      paisesModel: {
        id: dato.paisId,
        nombre: dato.paisNombre,
      },
    };

    axios
      .put(`${rutasURL}/${dato.id}`, requestData)
      .then((response) => {
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
  const [datotxt, setDatotxt] = useState([]);

  const handleDownloand = async (dato) => {
    try {
      // Hacer la solicitud para obtener los datos
      const response = await axios.get(`${coordenadaxRutaURL}${dato}`);
      setDatotxt(response.data);

      // Verificar si los datos se han cargado correctamente
      if (response.data.length > 0) {
        // Generar y descargar el archivo de texto
        const content = response.data
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
      } else {
        Swal.fire(
          "Advertencia",
          "La ruta seleccionada no contiene coordenadas, por favor agregue coordenadas para poder descargar el archivo",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error al descargar datos:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Rutas de la empresa</h1>
      <Button style={{ margin: "10px" }} onClick={() => handleAbrir()}>
        Crear nueva ruta
      </Button>
      <div className="camionesMenu-contenedor">
        {datos &&
          datos.map((ruta, index) => (
            <Card key={ruta.id} style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px" }}>
              <Card.Body>
                <Card.Title>{index + 1}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Nombre de Ruta: {ruta.nomruta}</Card.Subtitle>
                <Card.Text>Empresa: {empresaNombre}</Card.Text>
                <Card.Text>País: {ruta.paisesModel.nombre}</Card.Text>
              </Card.Body>
              <Button onClick={() => handleVerCoordenadas(ruta)} style={{ backgroundColor: "#40609F", borderColor: "black", color: "white" }}>
                <AiFillProfile /> Ver Coordenadas
              </Button>
              <Button variant="success" style={{ marginTop: "10px" }} onClick={() => handleDownloand(ruta.id)}>
                <FaDownload /> Descargar txt
              </Button>
              <ButtonGroup style={{ marginTop: "10px" }}>
                <Button
                  variant="warning"
                  onClick={() => datosAEditar(ruta)}
                  style={{ backgroundColor: "#727273", borderColor: "black", marginRight: "5px" }}
                >
                  <GrEdit /> Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleEliminar(ruta.id)}
                  style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}
                >
                  <BsXCircleFill /> Eliminar
                </Button>
              </ButtonGroup>
            </Card>
          ))}
        {datos.length == 0 && <h1 style={{ textAlign: "center" }}>Su empresa no tiene rutas, por favor agregue una</h1>}
      </div>
      <RutasModal mostrar={show} cerrar={() => handleCerrar()} guardar={handleGuardar} datosaeditar={datosEdit} editar={handleEditar} />
    </div>
  );
}
