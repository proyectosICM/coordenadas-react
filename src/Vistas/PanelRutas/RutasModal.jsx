import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { paisesURL } from "../../API/apiurls";
import { useListarElementos } from "../../Hooks/CRUDHooks";
import "../../Styles/CoordenadasModal.css";
import Swal from "sweetalert2";
import { FormFields } from "../../Hooks/FormFields";
import { SelectField } from "../../Hooks/SelectField";

function RutasModal({ mostrar, cerrar, guardar, editar, datosaeditar, title }) {
  // State to control the enable/disable state of the save button
  const [isGuardarHabilitado, setIsGuardarHabilitado] = useState(false);

  // State to store the list of countries
  const [pais, setPais] = useState([]);

  // State to hold form data
  const [formData, setFormData] = useState({
    nomruta: "",
    paisId: "",
    paisNombre: "",
  });

  // Retrieve country data using a custom link from an API
  useListarElementos(`${paisesURL}`, pais, setPais);

  // Update form data if 'datosaeditar' exists
  useEffect(() => {
    if (datosaeditar) {
      setFormData({
        id: datosaeditar.id,
        empresa: datosaeditar.empresasModel.id,
        nomruta: datosaeditar.nomruta,
        paisId: datosaeditar.paisesModel.id,
        paisNombre: datosaeditar.paisesModel.nombre,
      });
    }
  }, [datosaeditar]);

  // Function to reset form data
  const limpiar = () => {
    setFormData({
      nomruta: "",
      paisId: "",
      paisNombre: "",
    });
  };

  // Function to close modal and reset form data
  const handleClose = () => {
    cerrar();
    limpiar();
  };

  useEffect(() => {
    setIsGuardarHabilitado(formData.nomruta.trim() !== "" && formData.paisId !== "");
  },[formData.nomruta, formData.paisId ]);

  // Llamada a handleInputChange
  const handleInputChange = (e) => {
    FormFields(e, formData, setFormData, setIsGuardarHabilitado);
  };

  // Function to handle changes in the select input field
  const handleSelectChange = (e) => {
    SelectField(e, formData, setFormData, setIsGuardarHabilitado);
  };

  const validarFormulario = () => {
    const errores = {};
  
    if (formData.nomruta.trim() === "") {
      errores.nomruta = 'El campo "Nombre de Ruta" no puede estar vacío.';
    }
  
    if (formData.paisId === "") {
      errores.paisId = "Debe seleccionar un país.";
    }
  
    return errores;
  };
  
  const handleSave = () => {
    const errores = validarFormulario();
  
    if (Object.keys(errores).length > 0) {
      // Construye el mensaje de error combinando los mensajes de cada campo
      const mensajeError = Object.values(errores).join("\n");
  
      // Muestra el mensaje de error usando SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: mensajeError,
      });
      return;
    }
  
    // Si no hay errores, procede con el guardado o edición de los datos
    if (datosaeditar) {
      editar(formData);
    } else {
      guardar(formData);
    }
  
    // Close modal and reset form data
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
          <div className="input-row">
            <div className="input-column">
              <h5>Nombre de Ruta</h5>
              <input type="text" name="nomruta" value={formData.nomruta} onChange={handleInputChange} style={{ width: "150px" }} />
            </div>
            <div className="input-column">
              <h5>País</h5>
              <select name="paisId" value={formData.paisId} onChange={handleSelectChange} style={{ width: "200px", height: "40px", margin: "10px" }}>
                <option value="">Seleccione un país</option>
                {pais.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button variant="primary" onClick={handleSave} disabled={!isGuardarHabilitado}>
            Guardar
          </button>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default RutasModal;
