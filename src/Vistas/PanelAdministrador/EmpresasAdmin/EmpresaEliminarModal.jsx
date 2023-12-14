import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { EmpresasURL } from "../../../API/apiurls";
import axios from "axios";

export function EmpresaEliminarModal({show, close, idEmp }) {

    const handleConfirmDelete = (id) => {
        axios
          .delete(`${EmpresasURL}/${id}`)
          .then(() => {
            close();
            alert("Eliminado correctamente");
          })
          .catch((error) => {
            console.error("Error al eliminar:", error);
            alert("Hubo un error al intentar eliminar");
          });
      };

  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación {idEmp}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Esto eliminara la empresa y todas las rutas/coordenadas asociadas</h5>
          <p>Para eliminar, ingrese su contraseña:</p>
          <Form.Control type="password" placeholder="Contraseña" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => handleConfirmDelete(idEmp)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
