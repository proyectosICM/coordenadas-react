import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { ListarElementos } from "../../../Hooks/CRUDHooks";
import { useNavigate } from "react-router-dom";
import { EmpresasURL, rutasxEmpresaURL } from "../../../API/apiurls";

export function RutasAdminTabla({ handleShowModal }) {
  const navigation = useNavigate();
  const empresaid = 1;
  const [datos, setDatos] = useState();
  ListarElementos(`${rutasxEmpresaURL}0/${empresaid}`, setDatos);

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
            <th>Fecha de eliminacion</th>
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
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}
