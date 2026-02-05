import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import { EmpresaEliminarModal } from "./EmpresaEliminarModal";
import {
  RiArrowLeftLine,
  RiHashtag,
  RiBuilding2Line,
  RiUserLine,
  RiLockPasswordLine,
  RiSettings3Line,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

export function EmpresasTabla({
  handleShowModal,
  datos,
  eliminar,
  datosaeditar,
  page,
  totalPages,
  totalElements,
  size,
  loading,
  onPrev,
  onNext,
}) {
  const navigation = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empresaEliminar, setEmpresaEliminar] = useState();

  const handleEliminar = (id) => {
    setShowDeleteModal(true);
    setEmpresaEliminar(id);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <>
      <Button style={{ width: "100%", marginBottom: "12px" }} onClick={() => navigation("/panel-administrador")}>
        <RiArrowLeftLine style={{ marginRight: 8 }} /> Atras
      </Button>

      {/* Agregar arriba */}
      <div style={{ width: "100%", marginBottom: "12px" }}>
        <Button onClick={() => handleShowModal("Nuevo")}>
          <BsPlusCircleFill /> Agregar
        </Button>
      </div>

      {/* Tabla */}
      <div style={{ width: "100%" }}>
        <div className="table-responsive">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th><RiHashtag style={{ marginRight: 6 }} />Codigo</th>
                <th><RiBuilding2Line style={{ marginRight: 6 }} />Nombre</th>
                <th><RiUserLine style={{ marginRight: 6 }} />Usuario</th>
                <th><RiLockPasswordLine style={{ marginRight: 6 }} />Contraseña</th>
                <th><RiSettings3Line style={{ marginRight: 6 }} />Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(!datos || datos.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", opacity: 0.8 }}>
                    {loading ? "Cargando..." : "No hay registros"}
                  </td>
                </tr>
              )}

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
        </div>
      </div>

      <div
        style={{
          width: "100%",
          marginTop: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Button variant="outline-light" disabled={loading || page <= 0} onClick={onPrev}>
          <RiArrowLeftSLine /> Anterior
        </Button>

        <span style={{ opacity: 0.85 }}>
          {loading ? "Cargando..." : `Página ${page + 1} / ${Math.max(totalPages, 1)} • ${totalElements} registros`}
        </span>

        <Button variant="outline-light" disabled={loading || page + 1 >= totalPages} onClick={onNext}>
          Siguiente <RiArrowRightSLine />
        </Button>
      </div>

      <EmpresaEliminarModal
        idEmp={empresaEliminar}
        show={showDeleteModal}
        close={handleCloseDeleteModal}
        eliminar={eliminar}
      />
    </>
  );
}
