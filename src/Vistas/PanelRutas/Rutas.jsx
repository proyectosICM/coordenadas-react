import React, { useEffect, useState } from "react";
import { Button} from "react-bootstrap";
import "../../Styles/Rutas.css";
import { useNavigate } from "react-router-dom";
import { EditarElemento, GuardarElementos } from "../../Hooks/CRUDHooks";
import { rutasDeshabilitar, rutasURL, rutasxEmpresaURL } from "../../API/apiurls";
import Swal from "sweetalert2";
import axios from "axios";
import RutasModal from "./RutasModal";
import NavBar from "../../Common/NavBar";
import buildRequestData from "./requestDataRutas";
import { RutasCard } from "./RutasCard";
import { useGlobalState } from "../../Context/GlobalStateContext";
 
export function Rutas() {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigate();
  const { userData } = useGlobalState(); 
  const { empresaId, empresaNombre } = userData; 
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const [listadoRealizado, setListadoRealizado] = useState(false); 

  const Listar = async () => {
    try {
      const response = await axios.get(`${rutasxEmpresaURL}1/${empresaId}`);
      setDatos(response.data);
    } catch (error) {
      console.error("Error al listar", error);
    }
  };

  useEffect(() => {
    if (empresaId && !listadoRealizado) { 
      Listar();
      setListadoRealizado(true);
    }
  }, [empresaId, listadoRealizado]);

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
          .put(`${rutasDeshabilitar}${id}`)
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
    const requestData = buildRequestData(datosFormulario, empresaId);
    GuardarElementos(`${rutasURL}`, requestData, datos, setDatos)
      .then((response) => {
        setShow(false);
       Listar();
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
        setShow(false);
      });
  };

  const handleEditar = async (dato) => {
    try {
      const requestData = buildRequestData(dato, empresaId);
      await EditarElemento(`${rutasURL}/${dato.id}`, requestData)
        .catch((error) => {
          console.error("Error al editar los datos:", error);
          Swal.fire("Error", "Hubo un error al editar el registro", "error");
        });
      setShow(false);
      Listar();
    } catch (error) {
      console.error("Error al editar los datos:", error);
      Swal.fire("Error", "Hubo un error al editar el registro", "error");
    }
  };
 
  return (
    <div>
      <NavBar />
      <h1 style={{color: "white"}}>Rutas de la empresa</h1>
      <Button style={{ margin: "10px" }} onClick={() => handleAbrir()}>
        Crear nueva ruta
      </Button>
      <div className="camionesMenu-contenedor">
        {datos &&
          datos.map((ruta, index) => (
          <RutasCard key={ruta.id} ruta={ruta} empresaNombre={empresaNombre} index={index} datosAEditar={datosAEditar} handleEliminar={handleEliminar} />
          ))}
        {datos.length == 0 && <h1 style={{ textAlign: "center" }}>Su empresa no tiene rutas, por favor agregue una</h1>}
      </div>
      <RutasModal mostrar={show} cerrar={() => handleCerrar()} guardar={handleGuardar} datosaeditar={datosEdit} editar={handleEditar} />
    </div>
  );
}
