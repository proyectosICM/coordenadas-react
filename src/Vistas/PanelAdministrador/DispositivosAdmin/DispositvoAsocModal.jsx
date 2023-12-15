import React, { useEffect, useState } from "react";
import { Form, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { ListarElementos } from "../../../Hooks/CRUDHooks";
import { EmpresasURL, rutasxEmpresaURL } from "../../../API/apiurls";
import { useGlobalState } from "../../../Context/GlobalStateContext";

export function DispositivoAsocModal({ mostrar, cerrar, datosaeditar, editar, guardar }) {
  const { userData } = useGlobalState();
  const { empresaId, empresaNombre } = userData;
  const [rutas, setRutas] = useState();
  const [empresas, setEmpresas] = useState();
  const [formData, setFormData] = useState({
    nombre: "",
    ruta: null,
    empresa: null,
  });
 
  const handleClose = () => {
    cerrar();
    limpiar();
  };

  const limpiar = () => {
    setFormData({
      nombre: "",
      ruta: "",
      agregarARuta: null,
    });
  };

  ListarElementos(`${rutasxEmpresaURL}1/${empresaId}`, setRutas);
  ListarElementos(`${EmpresasURL}`, setEmpresas);

  useEffect(() => {
    if (datosaeditar) {
      console.log("ds")
      console.log(datosaeditar)
      console.log("ds")
      setFormData({
        nombre: datosaeditar.nombre,
        ruta: datosaeditar.rutas,
        password: datosaeditar.password,
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

  const handleChange = (e) => {
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
        <ModalHeader closeButton>
          <ModalTitle></ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div>
            <h5>Ingrese el codigo del dispositivo</h5>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={{ width: "420px" }} />
          </div>

          <div>
            <h5>Seleccione la empresa a la que pertenece el dispositivo</h5>
            <Form.Select name="empresa" value={formData.empresa} onChange={handleInputChange} style={{ width: "420px" }}>
              <option value="">Seleccionar empresa</option>
              {empresas &&
                empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre}
                  </option>
                ))}
            </Form.Select>
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
        </ModalBody>
        <ModalFooter>
          <button>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </ModalFooter>
      </Modal>
    </>
  );
}
