import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { EmpresasURL } from "../../../API/apiurls";
import axios from "axios";
import { ListarElementos } from "../../../Hooks/CRUDHooks";

export function EmpresaEliminarModal({show, close, idEmp, setDatos, eliminar }) {



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
          <Button variant="danger" onClick={() => eliminar(idEmp)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
