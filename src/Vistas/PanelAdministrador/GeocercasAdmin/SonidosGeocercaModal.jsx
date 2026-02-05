// SonidosGeocercaModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { TipoSURL, paisesURL } from "../../../API/apiurls";

function safeFile(input = "") {
  const s = (input ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "_");
  return s || "SIN_NOMBRE";
}

function pad5(n) {
  const x = Number(n);
  if (Number.isNaN(x) || x < 0) return "00000";
  return String(x).padStart(5, "0");
}

export function SonidosGeocercaModal({ mostrar, cerrar, guardar, editar, datosaeditar, title }) {
  const isEdit = Boolean(datosaeditar?.id);

  const [loading, setLoading] = useState(false);
  const [tipos, setTipos] = useState([]);
  const [paises, setPaises] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    tipoS: "",
    pais: "",
    urlImagen: "",
    urlSonido: "",
    codsonido: "",
    detalle: "",
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const [imgPreview, setImgPreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");

  const [imgOk, setImgOk] = useState(true);
  const [audioOk, setAudioOk] = useState(true);

  useEffect(() => {
    if (!mostrar) return;

    const nombre = datosaeditar?.nombre ?? "";
    const tipoS = datosaeditar?.tipoSModel?.id ? String(datosaeditar.tipoSModel.id) : "";
    const pais = datosaeditar?.paisesModel?.id ? String(datosaeditar.paisesModel.id) : "";

    setFormData({
      id: datosaeditar?.id ?? null,
      nombre,
      tipoS,
      pais,
      urlImagen: datosaeditar?.urlImagen ?? "",
      urlSonido: datosaeditar?.urlSonido ?? "",
      codsonido: datosaeditar?.codsonido ?? "",
      detalle: datosaeditar?.detalle ?? "",
    });

    setImagenFile(null);
    setAudioFile(null);
    setImgPreview("");
    setAudioPreview("");

    setImgOk(true);
    setAudioOk(true);
  }, [datosaeditar, mostrar]);

  useEffect(() => {
    if (!mostrar) return;

    const loadCombos = async () => {
      try {
        setLoading(true);
        const [resTipos, resPaises] = await Promise.all([axios.get(TipoSURL), axios.get(paisesURL)]);

        const tiposList = resTipos.data || [];
        const paisesList = resPaises.data || [];

        tiposList.sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0));
        paisesList.sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0));

        setTipos(tiposList);
        setPaises(paisesList);

        setFormData((prev) => {
          const next = { ...prev };
          if (!next.tipoS && tiposList.length > 0) next.tipoS = String(tiposList[0].id);
          if (!next.pais && paisesList.length > 0) next.pais = String(paisesList[0].id);
          return next;
        });
      } catch (e) {
        console.error(e);
        Swal.fire("Error", "No se pudieron cargar tipos/países", "error");
      } finally {
        setLoading(false);
      }
    };

    loadCombos();
  }, [mostrar]);

  useEffect(() => {
    return () => {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
      if (audioPreview) URL.revokeObjectURL(audioPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasCod = formData.codsonido !== "" && formData.codsonido !== null && formData.codsonido !== undefined;

  const disableGuardar = useMemo(() => {
    if (loading || !formData.nombre || !formData.tipoS || !formData.pais || !hasCod) return true;

    // ✅ recomendado: en "Nuevo" exige archivos (coherencia total)
    if (!isEdit) return !imagenFile || !audioFile;

    // ✅ en editar: puedes actualizar campos sin subir nuevos archivos
    return false;
  }, [loading, formData, hasCod, isEdit, imagenFile, audioFile]);

  const handleClose = () => cerrar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "urlImagen") setImgOk(true);
    if (name === "urlSonido") setAudioOk(true);
  };

  const handlePickImagen = (e) => {
    const file = e.target.files?.[0] ?? null;
    setImagenFile(file);

    if (imgPreview) URL.revokeObjectURL(imgPreview);

    if (file) {
      setImgPreview(URL.createObjectURL(file));
      setImgOk(true);
    } else {
      setImgPreview("");
    }
  };

  const handlePickAudio = (e) => {
    const file = e.target.files?.[0] ?? null;
    setAudioFile(file);

    if (audioPreview) URL.revokeObjectURL(audioPreview);

    if (file) {
      setAudioPreview(URL.createObjectURL(file));
      setAudioOk(true);
    } else {
      setAudioPreview("");
    }
  };

  const handleSave = () => {
    if (disableGuardar) return;

    const payload = {
      ...formData,
      imagenFile,
      audioFile,
    };

    if (isEdit) editar(payload);
    else guardar(payload);

    cerrar();
  };

  const filenameImg = `${safeFile(formData.nombre)}.jpg`;
  const filenameAud = `${pad5(formData.codsonido)}.mp3`;

  return (
    <Modal show={mostrar} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <Spinner size="sm" /> <span>Cargando datos...</span>
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} />
        </Form.Group>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Form.Group style={{ flex: "1 1 220px" }} className="mb-3">
            <Form.Label>Tipo de señal (TipoS)</Form.Label>
            <Form.Select name="tipoS" value={formData.tipoS} onChange={handleChange} disabled={tipos.length === 0}>
              {tipos.length === 0 ? (
                <option value="">(No hay tipos)</option>
              ) : (
                tipos.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.nombre ?? t.tipo ?? "Tipo"} (ID: {t.id})
                  </option>
                ))
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group style={{ flex: "1 1 220px" }} className="mb-3">
            <Form.Label>País</Form.Label>
            <Form.Select name="pais" value={formData.pais} onChange={handleChange} disabled={paises.length === 0}>
              {paises.length === 0 ? (
                <option value="">(No hay países)</option>
              ) : (
                paises.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.nombre ?? p.pais ?? "País"} (ID: {p.id})
                  </option>
                ))
              )}
            </Form.Select>
          </Form.Group>
        </div>

        {/* ========================= */}
        {/* IMAGEN: FILE + PREVIEW     */}
        {/* ========================= */}
        <Form.Group className="mb-2">
          <Form.Label>Imagen (archivo)</Form.Label>
          <Form.Control type="file" accept="image/png,image/jpeg" onChange={handlePickImagen} />
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
            {isEdit ? "(Opcional) Si no subes, se mantiene o se renombra según nombre/país." : "(Obligatorio en Nuevo)"}
          </div>
        </Form.Group>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Preview imagen:</div>

          {imgPreview ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={imgPreview}
                alt="preview"
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </div>
          ) : formData.urlImagen && imgOk ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={formData.urlImagen}
                alt="preview"
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                onError={() => setImgOk(false)}
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px dashed rgba(255,255,255,0.2)",
                textAlign: "center",
                opacity: 0.75,
                fontSize: 12,
              }}
            >
              {formData.urlImagen ? "No se pudo cargar la imagen." : "Sin imagen"}
            </div>
          )}
        </div>

        {/* ========================= */}
        {/* AUDIO: FILE + PREVIEW      */}
        {/* ========================= */}
        <Form.Group className="mb-2">
          <Form.Label>Audio (archivo)</Form.Label>
          <Form.Control type="file" accept="audio/mpeg" onChange={handlePickAudio} />
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
            {isEdit ? "(Opcional) Si no subes, se mantiene o se renombra según código." : "(Obligatorio en Nuevo)"}
          </div>
        </Form.Group>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Preview sonido:</div>

          {audioPreview ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <audio controls preload="none" style={{ width: "100%", maxWidth: 420, height: 34 }}>
                <source src={audioPreview} />
                Tu navegador no soporta audio.
              </audio>
            </div>
          ) : formData.urlSonido && audioOk ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <audio
                controls
                preload="none"
                style={{ width: "100%", maxWidth: 420, height: 34 }}
                onError={() => setAudioOk(false)}
              >
                <source src={formData.urlSonido} />
                Tu navegador no soporta audio.
              </audio>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px dashed rgba(255,255,255,0.2)",
                textAlign: "center",
                opacity: 0.75,
                fontSize: 12,
              }}
            >
              {formData.urlSonido ? "No se pudo cargar el audio." : "Sin sonido"}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Form.Group style={{ flex: "1 1 160px" }} className="mb-3">
            <Form.Label>Código sonido</Form.Label>
            <Form.Control type="number" name="codsonido" value={formData.codsonido} onChange={handleChange} />
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              Se guardará como: <b>{filenameAud}</b>
            </div>
          </Form.Group>

          <Form.Group style={{ flex: "2 1 280px" }} className="mb-3">
            <Form.Label>Detalle</Form.Label>
            <Form.Control name="detalle" value={formData.detalle} onChange={handleChange} />
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              Imagen se guardará como: <b>{filenameImg}</b>
            </div>
          </Form.Group>
        </div>

        {/* opcional: mantener solo para ver qué hay en DB, no afecta payload */}
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          URLs actuales (solo informativo):
          <div>Imagen: <span style={{ wordBreak: "break-all" }}>{formData.urlImagen || "-"}</span></div>
          <div>Audio: <span style={{ wordBreak: "break-all" }}>{formData.urlSonido || "-"}</span></div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 10 }}>
          * El guardado manda <b>multipart</b>: JSON en <b>data</b> + archivos <b>imagen</b>/<b>audio</b> si los eliges.
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={disableGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
