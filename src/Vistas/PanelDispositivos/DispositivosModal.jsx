// Importar useState y useEffect si aún no lo has hecho
import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { ReasignarDisp, VerificarDisp, rutasxEmpresaURL } from "../../API/apiurls";
import { ListarElementos } from "../../Hooks/CRUDHooks";
import axios from "axios";

export function DispositivosModal({ mostrar, cerrar, guardar, editar, datosaeditar, limpiar, title }) {
  const handleClose = () => {
    cerrar();
    limpiarFormulario();
  };

  const empresaid = 1;

  const [existeCodigo, setExisteCodigo] = useState(false);

  const [rutas, setRutas] = useState();

  ListarElementos(`${rutasxEmpresaURL}1/${empresaid}`, setRutas);

  const handleVerificar = async (nombre, empresa) => {
    try {
      const url = `${VerificarDisp}/${nombre}/${empresa}`;
      const response = await fetch(url);
      if (response.ok) {
        setExisteCodigo(true);
      } else {
        setExisteCodigo(false);
      }
    } catch (error) {
      console.error("Error al verificar el código:", error);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      codigo: "",
      ruta: "",
      agregarARuta: null,
    });
  };

  const [formData, setFormData] = useState({
    codigo: "",
    ruta: "",
    agregarARuta: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAgregarRutaChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      agregarARuta: value === "si" ? true : null,
    });
  };

  useEffect(() => {
    if (formData.codigo) {
      handleVerificar(formData.codigo, empresaid);
    }
  }, [formData.codigo, empresaid]);

  const handleGuardar = (datos) => {
    const requestData = {
      rutasModel: {
        id: datos.ruta,
      },
      empresasModel: {
        id: empresaid,
      },
    };
    axios.get(`${ReasignarDisp}/`)
    console.log(datos);
  };

  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>Coloque el código del dispositivo</h5>
            <input type="text" name="codigo" value={formData.codigo} onChange={handleInputChange} style={{ width: "420px" }} />
            {existeCodigo ? <p>El dispositivo existe</p> : <p>El dispositivo no existe</p>}
          </div>
          <Form.Group>
            <Form.Label>Desea agregar el dispositivo a una ruta</Form.Label>
            <div>
              <Form.Check
                inline
                label="Sí"
                type="radio"
                name="agregarARuta"
                value="si"
                checked={formData.agregarARuta === true}
                onChange={handleAgregarRutaChange}
              />
              <Form.Check
                inline
                label="No"
                type="radio"
                name="agregarARuta"
                value="no"
                checked={formData.agregarARuta === null}
                onChange={handleAgregarRutaChange}
              />
            </div>
            {formData.agregarARuta && (
              <Form.Control as="select" name="ruta" value={formData.ruta} onChange={handleInputChange}>
                <option value="">Seleccionar ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.id} value={ruta.id}>
                    {ruta.nomruta}
                  </option>
                ))}
              </Form.Control>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={handleClose}>
            Cerrar
          </button>
          <button variant="primary" onClick={() => handleGuardar(formData)} disabled={!existeCodigo}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
