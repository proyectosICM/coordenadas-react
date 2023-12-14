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

export function EmpresasTabla({ handleShowModal, datos }) {
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

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i); 
      const value = localStorage.getItem(key); 
    
      console.log(`Clave: ${key}, Valor: ${value}`);
    }
    
  })

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
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Contraseña</th>
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
                  <Button variant="warning" style={{ marginInline: "10px" }}>
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

      <EmpresaEliminarModal idEmp={empresaEliminar} show={showDeleteModal} close={handleCloseDeleteModal} />
    </>
  );
}
