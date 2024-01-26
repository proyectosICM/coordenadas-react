import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { DispositivosURL, ReasignarDisp, VerificarDisp, coordenadasURL, rutasxEmpresaURL } from "../../API/apiurls";
import { ListarElementos } from "../../Hooks/CRUDHooks";
import axios from "axios";

export function DispositivosModal({ mostrar, cerrar, guardar, editar, datosaeditar, limpiar, title }) {
  const handleClose = () => {
    cerrar();
    //limpiarFormulario();
  };

  const { userData } = useGlobalState();
  const { empresaId, empresaNombre } = userData;

  const [existeCodigo, setExisteCodigo] = useState(false);
  const [rutas, setRutas] = useState([]);

  // Function to retrieve and display data based on page
  const Listar = async () => {
    try {
      const response = await axios.get(`${rutasxEmpresaURL}?empresaId=1&estado=${empresaId}`);
      setRutas(response.data);
    } catch (error) {
      console.error("Error al listar", error);
    }
  };

  // useEffect hook to trigger data loading when 'pageNumber' changes
  useEffect(() => {
    Listar();
  }, []);

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
      velocidad: "",
      volumen: "",
    });
  };

  const [formData, setFormData] = useState({
    codigo: "",
    ruta: "",
    velocidad: "",
    volumen: "",
  });

  useEffect(() => {
    // Si hay datos para editar, inicializa el formulario con esos datos
    if (datosaeditar) {
      setFormData({
        codigo: datosaeditar.codigo || "",
        ruta: datosaeditar.rutasModel.id || "",
        velocidad: datosaeditar.velocidad || "",
        volumen: datosaeditar.volumen || "",
      });
    }
  }, [datosaeditar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  useEffect(() => {
    if (formData.codigo) {
      handleVerificar(formData.codigo, empresaid);
    }
  }, [formData.codigo, empresaId]);

  const handleGuardar = async () => {
    try {
      const requestData = {
        id: datosaeditar.id,
        rutasModel: {
          id: formData.ruta,
        },
        empresasModel: {
          id: empresaId,
        },
        velocidad: formData.velocidad,
        volumen: formData.volumen,
      };

      // Verifica si es una edición o creación
      if (datosaeditar) {
        await editar(requestData);
      } else {
        await guardar(requestData);
      }

      // Cierra el modal después de guardar o actualizar
      cerrar();
      limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar o actualizar los datos:", error);
    }
  };

  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Ruta</Form.Label>
            <Form.Control as="select" name="ruta" value={formData.ruta} onChange={handleInputChange}>
              <option value="">Seleccionar ruta</option>
              {rutas.map((ruta) => (
                <option key={ruta.id} value={ruta.id}>
                  {ruta.nomruta}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Velocidad</Form.Label>
            <input type="text" name="velocidad" value={formData.velocidad} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Volumen</Form.Label>
            <input type="text" name="volumen" value={formData.volumen} onChange={handleInputChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={handleClose}>
            Cerrar
          </button>
          <button variant="primary" onClick={handleGuardar}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
