import React, { useState } from "react";
import NavBar from "../../../Common/NavBar";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsPlusCircleFill } from "react-icons/bs";

export function DispositivoAsoc() {
  const navigation = useNavigate();
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);

  const handleShowModal = (t) => {
    setShow(true);
    if (t == "Nuevo") {
      setLimp(true);
    }
  };
  
  return (
    <div>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <Button style={{ width: "100%" }} onClick={() => navigation("/panel-administrador")}>
          Atras
        </Button>
        <h1>Agrege solo dispositivos que haya generado</h1>
        <Button onClick={() => handleShowModal("Nuevo")}>
          <BsPlusCircleFill /> Agregar
        </Button>
      </div>
    </div>
  );
}
