import React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { AiFillProfile } from "react-icons/ai";
import { BsXCircleFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { DownloadTxt } from "../PanelCoordenadas/DownloadTXT";
import "./RutasStyles.css";

export function RutasCard({ ruta, empresaNombre, datosAEditar, handleEliminar }) {
  const navigation = useNavigate();

  return (
    <Card key={ruta.id} className="cardRuta">
      <Card.Body>
        <Card.Title>{ruta.id}</Card.Title>
        <Card.Subtitle style={{ color: "black" }}>Nombre de Ruta: {ruta.nomruta}</Card.Subtitle>
        <Card.Text>Empresa: {empresaNombre}</Card.Text>
        <Card.Text>País: {ruta.paisesModel && ruta.paisesModel.nombre}</Card.Text>
      </Card.Body>
      <Button onClick={() => navigation(`/coordenadas/${ruta.id}`)} className="boton-ver">
        <AiFillProfile /> Ver Coordenadas
      </Button>
      <DownloadTxt ruta={ruta.id} />
      <ButtonGroup className="contenedor-botones">
        <Button onClick={() => datosAEditar(ruta)} className="boton-editar">
          <div className="content-container">
            <div className="texto-boton">
              <GrEdit />
            </div>
            <div className="icono-boton">
              <span>Editar</span>
            </div>
          </div>
        </Button>
        <Button onClick={() => handleEliminar(ruta.id)} className="boton-eliminar">
          <div className="content-container">
            <div className="texto-boton">
              <BsXCircleFill />
            </div>
            <div className="icono-boton">
              <span>Eliminar</span>
            </div>
          </div>
        </Button>
      </ButtonGroup>
    </Card>
  );
}
