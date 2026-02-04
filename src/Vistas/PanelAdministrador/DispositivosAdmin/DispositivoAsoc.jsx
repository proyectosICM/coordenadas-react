import React, { useEffect, useState } from "react";
import NavBar from "../../../Common/NavBar";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsPlusCircleFill } from "react-icons/bs";
import { DispositivoCard } from "./DispositivoCard";
import { DispositivosURL } from "../../../API/apiurls";
import axios from "axios";
import { DispositivoAsocModal } from "./DispositvoAsocModal";
import { EditarElemento, EliminarElemento, GuardarElementos } from "../../../Hooks/CRUDHooks";
import { dispositivoAsocRequestData } from "./DispositivoAsocRequestData";
import { useGlobalState } from "../../../Context/GlobalStateContext";
import Swal from "sweetalert2";

export function DispositivoAsoc() {
  const { userData } = useGlobalState();
  const { empresaId, empresaNombre } = userData;
  const navigation = useNavigate();
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);

  const handleShowModal = (t) => {
    setShow(true);
    if (t == "Nuevo") {
      setLimp(true);
    }
  };

  const [datos, setDatos] = useState();

  const cargarDatos = async () => {
    const response = await axios.get(`${DispositivosURL}`);
    setDatos(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCerrar = () => {
    setShow(false);
    setLimp(false);
  };

  const handleEliminar = (id) => {
    EliminarElemento(`${DispositivosURL}/${id}`).then(() => {
      cargarDatos();
    }).catch((error) => {
      console.error("Error al eliminar el elemento:", error);
    });
  };

  const handleGuardar = (datosFormulario) => {
    const requestData = dispositivoAsocRequestData(datosFormulario, empresaId);
    GuardarElementos(`${DispositivosURL}`, requestData, datos, setDatos)
      .then(() => {
        setShow(false);
        cargarDatos();
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
        setShow(false);
      });
  };

  const handleEditar = async (dato) => {
    try {
      const requestData = dispositivoAsocRequestData(dato, empresaId);
      await EditarElemento(`${DispositivosURL}/${dato.id}`, requestData).catch((error) => {
        console.error("Error al editar los datos:", error);
        Swal.fire("Error", "Hubo un error al editar el registro", "error");
      });
      setShow(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al editar los datos:", error);
      Swal.fire("Error", "Hubo un error al editar el registro", "error");
    }
  };

  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
    console.log(camion);
  };




  return (
    <div>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <Button style={{ width: "100%" }} onClick={() => navigation("/panel-administrador")}>
          Atras
        </Button>
        <h1 style={{ color: "white" }}>Agrege solo dispositivos que haya generado</h1>
        <Button onClick={() => handleShowModal("Nuevo")}>
          <BsPlusCircleFill /> Agregar
        </Button>

        <div className="camionesMenu-contenedor">
          {datos && datos.map((dato) => <DispositivoCard key={dato.id} eliminar={handleEliminar}  datosAEditar={datosAEditar} dispositivo={dato} />)}
        </div>
        <DispositivoAsocModal mostrar={show}   datosaeditar={datosEdit} guardar={handleGuardar} cerrar={handleCerrar} editar={handleEditar} />
      </div>
    </div>
  );
}


