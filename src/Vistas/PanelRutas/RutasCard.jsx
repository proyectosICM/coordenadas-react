import React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { AiFillProfile } from "react-icons/ai";
import { BsXCircleFill } from "react-icons/bs";
import { DownloadTxt } from "../PanelCoordenadas/DownloadTXT";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export function RutasCard({ ruta, index, empresaNombre, datosAEditar, handleEliminar }) {
  const navigation = useNavigate();

  const handleVerCoordenadas = async (dato) => {
    await localStorage.setItem("nomRuta", dato.nomruta);
    await localStorage.setItem("pais", dato.paisesModel.id);
    navigation(`/coordenadas/${dato.id}`);
  };

  return (
    <Card key={ruta.id} style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px" }}>
      <Card.Body>
        <Card.Title>{index + 1}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Nombre de Ruta: {ruta.nomruta}</Card.Subtitle>
        <Card.Text>Empresa: {empresaNombre}</Card.Text>
        <Card.Text>País: {ruta.paisesModel && ruta.paisesModel.nombre}</Card.Text>
      </Card.Body>
      <Button onClick={() => handleVerCoordenadas(ruta)} style={{ backgroundColor: "#40609F", borderColor: "black", color: "white" }}>
        <AiFillProfile /> Ver Coordenadas
      </Button>
      <DownloadTxt ruta={ruta.id} />
      <ButtonGroup style={{ marginTop: "10px" }}>
        <Button variant="warning" onClick={() => datosAEditar(ruta)} style={{ backgroundColor: "#727273", borderColor: "black", marginRight: "5px" }}>
          <GrEdit /> Editar
        </Button>
        <Button variant="danger" onClick={() => handleEliminar(ruta.id)} style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}>
          <BsXCircleFill /> Eliminar
        </Button>
      </ButtonGroup>
    </Card>
  );
}
