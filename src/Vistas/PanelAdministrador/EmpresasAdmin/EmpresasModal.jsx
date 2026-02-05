import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { EmpresaFNombre, EmpresaFUsuario } from "../../../API/apiurls";

export function EmpresasModel({ mostrar, cerrar, guardar, editar, datosaeditar, title }) {
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    usuario: "",
    password: "",
  });

  // Guardamos valores originales para saber si el usuario cambió algo al editar
  const [original, setOriginal] = useState({ nombre: "", usuario: "" });

  const [disableGuardar, setDisableGuardar] = useState(false);
  const [nombreEnUso, setNombreEnUso] = useState(false);
  const [usuarioEnUso, setUsuarioEnUso] = useState(false);

  // Cargar datos cuando se edita / limpiar cuando es nuevo
  useEffect(() => {
    if (datosaeditar) {
      const nombre = datosaeditar.nombre ?? "";
      const usuario = datosaeditar.usuario ?? "";

      setFormData({
        id: datosaeditar.id ?? null,
        nombre,
        usuario,
        password: datosaeditar.password ?? "",
      });

      setOriginal({ nombre, usuario });
    } else {
      setFormData({ id: null, nombre: "", usuario: "", password: "" });
      setOriginal({ nombre: "", usuario: "" });
    }

    // Reset flags cada vez que se abre o cambia el modo
    setNombreEnUso(false);
    setUsuarioEnUso(false);
    setDisableGuardar(false);
  }, [datosaeditar, mostrar]);

  // Validar nombre duplicado (solo si cambió cuando editas)
  useEffect(() => {
    const handleBuscarNombre = async () => {
      if (!formData.nombre) {
        setNombreEnUso(false);
        return;
      }

      // Si estás editando y no cambió el nombre, no validar / no bloquear
      if (datosaeditar && formData.nombre === original.nombre) {
        setNombreEnUso(false);
        return;
      }

      try {
        await axios.get(`${EmpresaFNombre}/${formData.nombre}`);
        // Si devuelve 200, existe alguien con ese nombre
        setNombreEnUso(true);
      } catch {
        setNombreEnUso(false);
      }
    };

    handleBuscarNombre();
  }, [formData.nombre, datosaeditar, original.nombre]);

  // Validar usuario duplicado (solo si cambió cuando editas)
  useEffect(() => {
    const handleBuscarUsuario = async () => {
      if (!formData.usuario) {
        setUsuarioEnUso(false);
        return;
      }

      if (datosaeditar && formData.usuario === original.usuario) {
        setUsuarioEnUso(false);
        return;
      }

      try {
        await axios.get(`${EmpresaFUsuario}/${formData.usuario}`);
        setUsuarioEnUso(true);
      } catch {
        setUsuarioEnUso(false);
      }
    };

    handleBuscarUsuario();
  }, [formData.usuario, datosaeditar, original.usuario]);

  // El botón depende SOLO de los flags actuales
  useEffect(() => {
    setDisableGuardar(nombreEnUso || usuarioEnUso);
  }, [nombreEnUso, usuarioEnUso]);

  const limpiar = () => {
    setFormData({ id: null, nombre: "", usuario: "", password: "" });
    setOriginal({ nombre: "", usuario: "" });
    setNombreEnUso(false);
    setUsuarioEnUso(false);
    setDisableGuardar(false);
  };

  const handleClose = () => {
    cerrar();
    limpiar();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (datosaeditar) editar(formData);
    else guardar(formData);

    cerrar();
    limpiar();
  };

  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <h5>Ingrese el nombre de la empresa</h5>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={{ width: "420px" }}
            />
            {nombreEnUso && <p style={{ color: "red" }}>Este nombre de empresa ya está en uso</p>}
          </div>

          <div>
            <h5>Ingrese el usuario para la empresa</h5>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              style={{ width: "420px" }}
            />
            {usuarioEnUso && <p style={{ color: "red" }}>Este usuario ya está en uso</p>}
          </div>

          <div>
            <h5>Ingrese la contraseña</h5>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: "420px" }}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button onClick={handleClose}>Cancelar</button>
          <button onClick={handleSave} disabled={disableGuardar}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
