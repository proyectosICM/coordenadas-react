import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { rutasxEmpresaURL } from "../../API/apiurls";
import { useGlobalState } from "../../Context/GlobalStateContext";

export function DispositivosModal({
  mostrar,
  cerrar,
  guardar,
  editar,
  datosaeditar,
  limp,
  title,
}) {
  const { userData } = useGlobalState();
  const empresaId = userData?.empresaId;

  const isEdit = Boolean(datosaeditar?.id);

  const [loadingRutas, setLoadingRutas] = useState(false);
  const [rutas, setRutas] = useState([]);

  const [formData, setFormData] = useState({
    ruta: "",
    velocidad: "",
    volumen: "",
  });

  const handleClose = () => cerrar();

  // ✅ cargar rutas cuando ABRES el modal y cuando ya existe empresaId
  const cargarRutas = async () => {
    if (!empresaId) return;

    try {
      setLoadingRutas(true);
      const response = await axios.get(rutasxEmpresaURL, {
        params: { empresaId, estado: 1 },
      });

      setRutas(response.data || []);
    } catch (error) {
      console.error("Error al listar rutas", error);
      setRutas([]);
    } finally {
      setLoadingRutas(false);
    }
  };

  useEffect(() => {
    if (!mostrar) return;
    cargarRutas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrar, empresaId]);

  // ✅ precargar form al editar / limpiar al crear
  useEffect(() => {
    if (!mostrar) return;

    if (isEdit) {
      setFormData({
        ruta: datosaeditar?.rutasModel?.id ? String(datosaeditar.rutasModel.id) : "",
        velocidad: datosaeditar?.velocidad ?? "",
        volumen: datosaeditar?.volumen ?? "",
      });
    } else {
      setFormData({
        ruta: "",
        velocidad: "",
        volumen: "",
      });
    }
  }, [mostrar, isEdit, datosaeditar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      const payload = {
        id: datosaeditar?.id,
        rutasModel: { id: Number(formData.ruta) },
        velocidad: formData.velocidad,
        volumen: formData.volumen,
      };

      if (isEdit) await editar(payload);
      else await guardar(payload);

      cerrar();
    } catch (error) {
      console.error("Error al guardar/editar dispositivo:", error);
    }
  };

  const disableSave = !formData.ruta;

  return (
    <Modal show={mostrar} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || (isEdit ? "Editar dispositivo" : "Nuevo dispositivo")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loadingRutas && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Spinner size="sm" /> <span>Cargando rutas...</span>
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Ruta</Form.Label>
          <Form.Select name="ruta" value={formData.ruta} onChange={handleInputChange} disabled={!empresaId || loadingRutas}>
            <option value="">Seleccionar ruta</option>
            {rutas.map((ruta) => (
              <option key={ruta.id} value={String(ruta.id)}>
                {ruta.nomruta}
              </option>
            ))}
          </Form.Select>
          {!empresaId && <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>Cargando empresa...</div>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Velocidad</Form.Label>
          <Form.Control type="number" name="velocidad" value={formData.velocidad} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Volumen</Form.Label>
          <Form.Control type="number" name="volumen" value={formData.volumen} onChange={handleInputChange} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleGuardar} disabled={disableSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
