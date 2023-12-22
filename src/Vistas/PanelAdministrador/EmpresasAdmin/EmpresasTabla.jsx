import React, { useEffect, useState } from "react";
import { Empresas } from "./Empresas";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { ListarElementos } from "../../../Hooks/CRUDHooks";
import { EmpresasURL } from "../../../API/apiurls";
import { GrEdit } from "react-icons/gr";
import axios from "axios";
import { EmpresaEliminarModal } from "./EmpresaEliminarModal";
import { EmpresasModel } from "./EmpresasModal";

export function EmpresasTabla({ handleShowModal, show, guardar, cerrar,  datos, eliminar, datosaeditar , editar }) {
  const navigation = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empresaEliminar, setEmpresaEliminar] = useState();

  const handleEliminar = (id) => {
    setShowDeleteModal(true);
    setEmpresaEliminar(id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };


  return (
    <>
      <Button style={{ width: "100%" }} onClick={() => navigation("/panel-administrador")}>
        Atras
      </Button>
      <Button onClick={() => handleShowModal("Nuevo")}>
        <BsPlusCircleFill /> Agregar
      </Button>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Contraseña</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {datos &&
            datos.map((empresa) => (
              <tr key={empresa.id}>
                <td>{empresa.id}</td>
                <td>{empresa.nombre}</td>
                <td>{empresa.usuario}</td>
                <td>{empresa.password}</td>
                <td>
                  <Button variant="warning" style={{ marginInline: "10px" }} onClick={() => datosaeditar(empresa)}>
                    <GrEdit /> Editar
                  </Button>
                  <Button variant="danger" style={{ marginInline: "10px" }} onClick={() => handleEliminar(empresa.id)}>
                    <BsXCircleFill /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <EmpresaEliminarModal idEmp={empresaEliminar} show={showDeleteModal} close={handleCloseDeleteModal}  eliminar={eliminar} />
    </>
  );
}
