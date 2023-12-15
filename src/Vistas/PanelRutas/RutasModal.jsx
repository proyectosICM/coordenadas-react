import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "../../Styles/CoordenadasModal.css";
import { paisesURL } from "../../API/apiurls";
import { useListarElementos } from "../../Hooks/CRUDHooks";

function RutasModal({ mostrar, cerrar, guardar, editar, datosaeditar, title }) {
  const [formData, setFormData] = useState({
    nomruta: "",
    paisId: "",
    paisNombre: "",
  });

  const [pais, setPais] = useState([]);
  useListarElementos(`${paisesURL}`, pais, setPais);

  const [isGuardarHabilitado, setIsGuardarHabilitado] = useState(false);

  const handleClose = () => {
    cerrar();
    limpiar();
  };
 
  const handleSave = () => {
    // Validar que los campos "Nombre de Ruta" y "País" no estén vacíos
    if (formData.nomruta.trim() === "" || formData.paisId === "") {
      let mensajeError = "";
      if (formData.nomruta.trim() === "") {
        mensajeError += 'El campo "Nombre de Ruta" no puede estar vacío.\n';
      }
      if (formData.paisId === "") {
        mensajeError += 'Debe seleccionar un país.\n';
      }
      alert(mensajeError);
      return; // Detener la función si algún campo está vacío
    }

    if (datosaeditar) {
      editar(formData);
    } else {
      guardar(formData);
    }
    cerrar();
    limpiar();
  };

  const limpiar = () => {
    setFormData({
      nomruta: "",
      paisId: "",
      paisNombre: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Verificar si ambos campos tienen datos para habilitar el botón de guardar
    if (name === "nomruta" || name === "paisId") {
      setIsGuardarHabilitado(formData.nomruta.trim() !== "" && formData.paisId !== "");
    }
  };

  const handleSelectChange = (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];
    setFormData({
      ...formData,
      paisId: value,
      paisNombre: selectedOption.text,
    });

    setIsGuardarHabilitado(formData.nomruta.trim() !== "" && value !== "");
  };

  useEffect(() => {
    if (datosaeditar) {
      setFormData({
        id: datosaeditar.id,
        empresa: datosaeditar.empresasModel.id,
        nomruta: datosaeditar.nomruta,
        paisId: datosaeditar.paisesModel.id,
        paisNombre: datosaeditar.paisesModel.nombre,
      });
      //setEditando(true);
    } else {
      // ...
    }
  }, [datosaeditar]);

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
