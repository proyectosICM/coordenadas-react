import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { ListarElementos } from "../../../Hooks/CRUDHooks";
import { useNavigate } from "react-router-dom";
import { EmpresasURL, rutasURL, rutasxEmpresaURL } from "../../../API/apiurls";
import axios from "axios";
import Swal from "sweetalert2";
 
export function RutasAdminTabla({ handleShowModal }) {
  const navigation = useNavigate();
  const empresaid = 1;
  const [datos, setDatos] = useState();

  const cargarDatos = async () => {
    const response = await axios.get(`${rutasxEmpresaURL}0/${empresaid}`);
    setDatos(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);


  const handleHabilitar = async (id) => {
    try {
      await axios.put(`${rutasURL}/habilitar/${id}`);
      cargarDatos(); 
    } catch (error) {
      console.error("Error al habilitar ruta:", error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará permanentemente la ruta y todas las coordenadas asociadas. ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await axios.delete(`${rutasURL}/${id}`);
        cargarDatos();
        Swal.fire("Eliminado", "El registro ha sido eliminado permanentemente", "success");
      }
    } catch (error) {
      console.error("Error al eliminar permanentemente", error);
      Swal.fire("Error", "Hubo un error al eliminar el registro", "error");
    }
  };

  return (
    <>
      <Button style={{ width: "100%" }} onClick={() => navigation("/panel-administrador")}>
        Atras
      </Button>
      <Button onClick={() => handleShowModal("Nuevo")}>
        <BsPlusCircleFill /> Agregar
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre de ruta</th>
            <th>Empresa</th>
            <th>Pais</th>
            <th>Fecha de deshabilitacion</th>
            <th>Fecha para la eliminacion</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {datos &&
            datos.map((dato) => (
              <tr key={dato.id}>
                <th>{dato.id}</th>
                <th>{dato.nomruta}</th>
                <th>{dato.empresasModel.nombre}</th>
                <th>{dato.paisesModel.nombre}</th>
                <th>{dato.diadeshabilitacion ? new Date(dato.diadeshabilitacion).toLocaleDateString() : "-"}</th>
                <td>{dato.diaeliminacion ? new Date(dato.diaeliminacion).toLocaleDateString() : "-"} </td>
                <td>
                  <Button onClick={() => handleHabilitar(dato.id)}>Habilitar</Button>
                  <Button variant="warning" onClick={() => handleEliminar(dato.id)}>Forzar Eliminacion</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}
