import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { BsPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { ListarElementos } from "../../Hooks/CRUDHooks";
import { Empresas } from './../PanelAdministrador/EmpresasAdmin/Empresas';

export function CoordenadasTabla({ datos, datosAEditar, handleEliminar, handleShowModal }) {
  const navigation = useNavigate(); 
 
  return (
    <>
      <Button style={{ width: "100%" }} onClick={() => navigation("/rutas")}>
        Atras
      </Button>
      <h1>Coordenadas de la ruta </h1>
      <Button variant="success" style={{ margin: "30px" }} onClick={() => handleShowModal("Nuevo")}>
        <BsPlusCircleFill /> Agregar
      </Button>
      <Table striped bordered hover variant="dark">
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
                <td>{coordenada.sonidosVelocidadModel ? coordenada.sonidosVelocidadModel.nombre : ""}</td>
                <td>{coordenada.sonidosVelocidadModel ? coordenada.sonidosVelocidadModel.codvel : ""}</td>
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
    </>
  );
}
