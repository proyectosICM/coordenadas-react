import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2"; 
import { GuardarElementos } from "../../../Hooks/CRUDHooks";
import { EmpresaFNombre, EmpresaFUsuario, EmpresasURL } from "../../../API/apiurls";
import { requestDataEmpresa } from "./requestDataEmpresa";
import axios from "axios";

export function EmpresasModel({ mostrar, cerrar, guardar, editar, datosaeditar
  , title }) {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    password: "",
  });
  console.log(datosaeditar)
  const [disableGuardar, setDisableGuardar] = useState(false);
  const [nombreEnUso, setNombreEnUso] = useState(false);
  const [usuarioEnUso, setUsuarioEnUso] = useState(false);

  useEffect(() => {
    if (datosaeditar) {
      setFormData({
        nombre: datosaeditar.nombre,
        usuario: datosaeditar.usuario,
        password: datosaeditar.password,
      });
    }
  }, [datosaeditar]);

  useEffect(() => {
    const handleBuscarNombre = async () => {
      try {
        if (formData.nombre != "") {
          const response = await axios.get(`${EmpresaFNombre}/${formData.nombre}`);
          if (response.status === 200) {
            setDisableGuardar(true);
            setNombreEnUso(true); 
          }
        }
      } catch (error) {
        //console.log("No hay coincidencias");
        setNombreEnUso(false); 
      }
    };

    handleBuscarNombre();
  }, [formData.nombre]);

  useEffect(() => {
    const handleBuscarUsuario = async() => {
      try {
        if (formData.usuario != "") {
          const response = await axios.get(`${EmpresaFUsuario}/${formData.usuario}`);
          if (response.status === 200) {
            setDisableGuardar(true);
            setUsuarioEnUso(true);
          }
        }
      } catch (error) {
        setUsuarioEnUso(false)
      }
    };

    handleBuscarUsuario();
  }, [formData.usuario]);

  const handleClose = () => {
    cerrar();
    limpiar();
  };

  const limpiar = () => {
    setFormData({
      nombre: "",
      usuario: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (datosaeditar) {
      editar(formData);
    } else {
      guardar(formData); 
    }
    cerrar();
    limpiar();
  };


  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton style={{ backgroundColor: '#9e9e9e', color: 'white' }}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#9e9e9e', color: 'black' }}>
          <div>
            <h5>Ingrese el nombre de la empresa</h5>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={{ width: "420px" }} />
            {nombreEnUso && <p style={{ color: "red" }}>Este nombre de empresa ya está en uso</p>}
          </div>

          <div>
            <h5>Ingrese el usuario para la empresa</h5>
            <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} style={{ width: "420px" }} />
            {usuarioEnUso && <p style={{ color: "red" }}>Este usuario ya está en uso</p>}
          </div>

          <div>
            <h5>Ingrese la contraseña</h5>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: "420px" }} />
          </div>
        </Modal.Body> 
        <Modal.Footer style={{ backgroundColor: '#9e9e9e', color: 'white' }}>
          <button onClick={handleClose}>Cancelar</button>
          <button onClick={() => handleSave(formData)} disabled={disableGuardar}>Guardar</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
