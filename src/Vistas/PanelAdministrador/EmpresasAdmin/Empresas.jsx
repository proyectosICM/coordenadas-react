import React, { useState } from "react";
import NavBar from "../../../Common/NavBar";
import { Button } from "react-bootstrap";
import { BsPlusCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { EmpresasTabla } from "./EmpresasTabla";
import { EmpresasModel } from "./EmpresasModal";
import { EmpresasURL } from "../../../API/apiurls";
import { ListarElementos } from "../../../Hooks/CRUDHooks";

export function Empresas() {
  const navigation = useNavigate();

  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);
  const [show, setShow] = useState(false);
  const handleShowModal = (t) => {
    setShow(true);
    if (t == "Nuevo") {
      setLimp(true);
    }
  };

  const handleCerrar = () => {
    setShow(false);
    setLimp(false);
  };

  const [datos, setDatos] = useState();
  ListarElementos(`${EmpresasURL}`, setDatos);

  return (
    <div>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <EmpresasTabla handleShowModal={handleShowModal} datos={datos} />
      </div>
      <EmpresasModel mostrar={show} cerrar={handleCerrar} datos={datos} setDatos={setDatos} ></EmpresasModel>
    </div>
  );
}
