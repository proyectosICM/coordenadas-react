import React, { useEffect, useState } from "react";
import NavBar from "../../Common/NavBar";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DispositivosURL } from "../../API/apiurls";
import { GrEdit } from "react-icons/gr";
import { BsXCircleFill } from "react-icons/bs";

export function ConfiguracionDispositivos() {
  const navigation = useNavigate();
  const [datos, setDatos] = useState();

  const Listar = async () => {
    try {
      // const response = await axios.get(`${DispositivosURL}${empresaid}`);
      const response = await axios.get(`${DispositivosURL}`);
      setDatos(response.data);
    } catch (error) {
      console.error("Error al listar", error);
    }
  };

  useEffect(() => {
    Listar();
  }, [setDatos]);

  return (
    <div>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <Button style={{ width: "100%" }} onClick={() => navigation("/dispositivos")}>
          Atras
        </Button>
        <div style={{ width: "100%" }}>Configuracion</div>
        <div>Dispositivos </div>
        <Table  striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Codigo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos &&
            datos.map((dispositivo) => (
              <tr key={dispositivo.id}>
                <td>{dispositivo.id}</td>
                <td>{dispositivo.nombre}</td>
                <td>{dispositivo.rutasModel.nombre}</td>

                <td>
                  <Button variant="warning" style={{ marginInline: "10px" }} onClick={() => console.log("ds")}>
                    <GrEdit /> Editar
                  </Button>
                  <Button variant="danger" style={{ marginInline: "10px" }} onClick={() => console.log("ds")}>
                    <BsXCircleFill /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
        </Table>
      </div>
    </div>
  );
}
