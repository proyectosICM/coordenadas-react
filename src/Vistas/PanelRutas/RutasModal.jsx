import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { paisesURL } from "../../API/apiurls";
import { useListarElementos } from "../../Hooks/CRUDHooks";
import "../../Styles/CoordenadasModal.css";
import Swal from "sweetalert2";

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

  // Function to handle input changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Check if both fields have data to enable the save button
    if (name === "nomruta" || name === "paisId") {
      setIsGuardarHabilitado(formData.nomruta.trim() !== "" && formData.paisId !== "");
    }
  };

  // Function to handle changes in the select input field
  const handleSelectChange = (e) => {
    const { value, options } = e.target;
    // Retrieve the selected option from the dropdown
    const selectedOption = options[options.selectedIndex];
    setFormData({
      ...formData,
      paisId: value,
      paisNombre: selectedOption.text,
    });
    // Check if both route name and country ID have data to enable the save button
    setIsGuardarHabilitado(formData.nomruta.trim() !== "" && value !== "");
  };

  // Function to handle form data saving
  const handleSave = () => {
    // Validate that the "Route Name" and "Country" fields are not empty
    if (formData.nomruta.trim() === "" || formData.paisId === "") {
      let mensajeError = "";
      // Check if "Route Name" field is empty
      if (formData.nomruta.trim() === "") {
        mensajeError += 'El campo "Nombre de Ruta" no puede estar vacío.\n';
      }
      // Check if no country is selected
      if (formData.paisId === "") {
        mensajeError += "Debe seleccionar un país.\n";
      }
      // Show alert with error message if any field is empty
      // Reemplaza el alert con SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: mensajeError,
      });

      return; // Stop the function if any field is empty
    }

    // If editing existing data, call 'editar'; otherwise, call 'guardar'
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
