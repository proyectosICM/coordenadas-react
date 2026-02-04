import React, { useEffect, useState } from "react";
import NavBar from "../../../Common/NavBar";
import { useNavigate } from "react-router-dom";
import { EmpresasTabla } from "./EmpresasTabla";
import { EmpresasModel } from "./EmpresasModal";
import { EmpresasURL } from "../../../API/apiurls";
import { GuardarElementos, ListarElementos } from "../../../Hooks/CRUDHooks";
import { requestDataEmpresa } from "./requestDataEmpresa";
import Swal from "sweetalert2";
import axios from "axios";

export function Empresas() {
  const navigation = useNavigate();

  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);
  const [show, setShow] = useState(false);

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

  const [datos, setDatos] = useState();
  ListarElementos(`${EmpresasURL}`, setDatos);

  const cargarDatos = async (page, size) => {
    try {
      const response = await axios.get(`${EmpresasURL}`);
      setDatos(response.data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [setDatos]);

  const handleGuardar = (datos) => {
    setTimeout(() => {
      Swal.fire({
        title: "Cargando...",
        timer: 500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        const requestData = requestDataEmpresa(datos);

        GuardarElementos(EmpresasURL, requestData, datos, setDatos).then(() => {
          cargarDatos();
        });
        handleCerrar();
      });
    }, 500);
  };
 
  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
  };


  const handleEditar = (dato) => {

    const requestData = requestDataEmpresa(dato);
    axios
      .put(`${EmpresasURL}/${dato.id}`, requestData)
      .then((response) => {
        // Actualiza los datos localmente en la lista
        const indice = datos.findIndex((item) => item.id === dato.id);
        if (indice !== -1) {
          const nuevosDatos = [...datos];
          nuevosDatos[indice] = response.data;
          setDatos(nuevosDatos);
        }

        handleCerrar();
        cargarDatos();
      })
      .catch((error) => {
        console.error("Error al editar los datos:", error);
        Swal.fire("Error", "Hubo un error al editar el registro", "error");
      });
  };

  const handleConfirmDelete = (id) => {
    axios
      .delete(`${EmpresasURL}/${id}`)
      .then(async () => {
        handleCerrar();
        alert("Eliminado correctamente");
        const response = await axios.get(`${EmpresasURL}`);
        setDatos(response.data);
      })
      .catch((error) => {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al intentar eliminar");
      });
  };

  return (
    <div>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <EmpresasTabla show={show} cerrar={handleCerrar} datosEdit={datosEdit} guardar={handleGuardar} handleShowModal={handleShowModal}
         datos={datos} eliminar={handleConfirmDelete} datosaeditar={datosAEditar} editar={handleEditar} />
      </div>
      <EmpresasModel mostrar={show} datosaeditar={datosEdit}  editar={handleEditar}  cerrar={handleCerrar} datos={datos} guardar={handleGuardar} ></EmpresasModel>
    </div>
  );
}
