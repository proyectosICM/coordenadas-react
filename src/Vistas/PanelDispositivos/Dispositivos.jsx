import React from "react";
import NavBar from "../../Common/NavBar";
import { Button, Card } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import { useNavigate, useNavigation } from "react-router-dom";

export function Dispositivos() {
    const navigation = useNavigate();
  return (
    <div>
      <NavBar />
      <h1>Dispositivos de la empresa</h1>

      <div className="camionesMenu-contenedor">
        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px" }}>
          <Card.Body>
            <Card.Title>Dispositivos de la ruta ADC-009</Card.Title>
            <Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
            <Card.Text>33 Dispositivos actualizados </Card.Text>
          </Card.Body>
          <Button
            variant="danger"
            onClick={() => navigation("/configuracion-dispositivos")}
            style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}
          >
            <BsGearFill /> Configuracion
          </Button>
        </Card>

        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px" }}>
          <Card.Body>
            <Card.Title>Dispositivos libres de la empresa</Card.Title>
            <Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
            <Card.Text>33 Dispositivos actualizados </Card.Text>
          </Card.Body>
          <Button
            variant="danger"
            onClick={() => navigation("/configuracion-dispositivos")}
            style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}
          >
            <BsGearFill /> Configuracion
          </Button>
        </Card>
      </div>
    </div>
  );
}
