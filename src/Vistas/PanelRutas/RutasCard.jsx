import React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { AiFillProfile } from "react-icons/ai";
import { BsXCircleFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { DownloadTxt } from "../PanelCoordenadas/DownloadTXT"; 
import './RutasStyles.css'
   
export function RutasCard({ ruta, empresaNombre, datosAEditar, handleEliminar }) {
  const navigation = useNavigate();
 
  return (
    <Card key={ruta.id} className="cardRuta">
      <Card.Body>
        {/* <Card.Title>{index + 1}</Card.Title> */}
        <Card.Subtitle  style={{color: "black" }}>Nombre de Ruta: {ruta.nomruta}</Card.Subtitle>
        <Card.Text>Empresa: {empresaNombre}</Card.Text>
        <Card.Text>País: {ruta.paisesModel && ruta.paisesModel.nombre}</Card.Text>
      </Card.Body>
      <Button onClick={() => navigation(`/coordenadas/${ruta.id}`)} className="boton-ver">
        <AiFillProfile /> Ver Coordenadas
      </Button>
      <DownloadTxt ruta={ruta.id} />
      <ButtonGroup className="contenedor-botones">
        <Button variant="warning" onClick={() => datosAEditar(ruta)} className="boton-editar">
          <GrEdit /> Editar
        </Button>
        <Button variant="danger" onClick={() => handleEliminar(ruta.id)} className="boton-eliminar">
          <BsXCircleFill /> Eliminar
        </Button>
      </ButtonGroup>
    </Card>
  );
}
 