import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { paisesURL } from "../../API/apiurls";
import { useListarElementos } from "../../Hooks/CRUDHooks";
import "../../Styles/CoordenadasModal.css";
import Swal from "sweetalert2";

function RutasModal({ mostrar, cerrar, guardar, editar, datosaeditar, title }) {
  // State variable to countries
  const [pais, setPais] = useState([]);

  // Initializes route form values with existing data or default values.
  const initialValues = {
    id: datosaeditar ? datosaeditar.id : "",
    nomruta: datosaeditar ? datosaeditar.nomruta : "",
    paisId: datosaeditar ? datosaeditar.paisesModel.id : "",
  };

  // Validates form input values to ensure 'nomruta' is not empty and 'paisId' is selected.
  const validate = (values) => {
    const errors = {};
    if (!values.nomruta.trim()) {
      errors.nomruta = 'El campo "Nombre de Ruta" no puede estar vacío.';
    }
    if (!values.paisId) {
      errors.paisId = "Debe seleccionar un país.";
    }
    return errors;
  };

  // Function to get the countries
  useListarElementos(`${paisesURL}`, pais, setPais);

  // Function to save new data
  const handleSave = async (values) => {
    const errores = validate(values);

    if (Object.keys(errores).length > 0) {
      const mensajeError = Object.values(errores).join("\n");
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: mensajeError,
      });
      return;
    }
    if (datosaeditar) {
      await editar(values);
    } else {
      await guardar(values);
    }
    cerrar();
  };

  return (
    <Modal show={mostrar} onHide={cerrar}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={async (values) => {
          await handleSave(values);
        }}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <div className="input-column" style={{width: "100%"}}>
                <h5>Nombre de Ruta</h5>
                <Field type="text" name="nomruta" className="inp2-form" />
                <ErrorMessage name="nomruta" component="div" className="error" />
              </div>

              <div className="input-column">
                  <h5>País</h5>
                  <Field as="select" name="paisId" className="select-form">
                    <option value="">Seleccione un país</option>
                    {pais.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="paisId" component="div" className="error" />
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Guardar
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default RutasModal;
