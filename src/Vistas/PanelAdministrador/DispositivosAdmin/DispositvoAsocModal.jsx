// DispositvoAsocModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { rutasURL, EmpresasURL } from "../../../API/apiurls";

export function DispositivoAsocModal({
  mostrar,
  cerrar,
  guardar,
  editar,
  datosaeditar,
  empresaIdLogin,
  empresaNombreLogin,
}) {
  const isEdit = Boolean(datosaeditar?.id);

  // =========================
  // EMPRESAS
  // =========================
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  // empresa seleccionada (string para Form.Select)
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(
    String(datosaeditar?.empresasModel?.id ?? empresaIdLogin ?? "")
  );

  // =========================
  // RUTAS
  // =========================
  const [loadingRutas, setLoadingRutas] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState("");

  // =========================
  // CAMPOS EDITABLES
  // =========================
  const [velocidad, setVelocidad] = useState(67);
  const [volumen, setVolumen] = useState(27);

  // estado (si no lo manejas en UI, se manda default true)
  const [estado, setEstado] = useState(true);

  // =========================
  // Helpers
  // =========================
  const empresaIdSeleccionadaNum = useMemo(
    () => Number(empresaSeleccionada || 0),
    [empresaSeleccionada]
  );

  const empresaSeleccionadaObj = useMemo(() => {
    return empresas.find((e) => Number(e?.id) === empresaIdSeleccionadaNum);
  }, [empresas, empresaIdSeleccionadaNum]);

  const empresaNombreAuto = useMemo(() => {
    return (
      empresaSeleccionadaObj?.nombre ??
      datosaeditar?.empresasModel?.nombre ??
      datosaeditar?.rutasModel?.empresasModel?.nombre ??
      empresaNombreLogin ??
      ""
    );
  }, [empresaSeleccionadaObj, datosaeditar, empresaNombreLogin]);

  // =========================
  // Inicializar estados al abrir modal
  // =========================
  useEffect(() => {
    if (!mostrar) return;

    setEmpresaSeleccionada(String(datosaeditar?.empresasModel?.id ?? empresaIdLogin ?? ""));
    setVelocidad(datosaeditar?.velocidad ?? 67);
    setVolumen(datosaeditar?.volumen ?? 27);
    setEstado(datosaeditar?.estado ?? true);

    // ruta se setea luego de cargar rutas
    setRutaSeleccionada(datosaeditar?.rutasModel?.id ? String(datosaeditar.rutasModel.id) : "");
  }, [mostrar, datosaeditar, empresaIdLogin]);

  // =========================
  // Cargar empresas al abrir
  // - Si quieres que SOLO sea la empresa logeada, deja solo ese fallback.
  // - Si eres admin (empresa 1) y quieres ver todas, aquí ya está habilitado.
  // =========================
  useEffect(() => {
    if (!mostrar) return;

    const loadEmpresas = async () => {
      try {
        setLoadingEmpresas(true);

        // ✅ Si quieres que SOLO admin pueda elegir empresas:
        // const isAdmin = Number(empresaIdLogin) === 1;
        // if (!isAdmin) {
        //   setEmpresas([{ id: Number(empresaIdLogin), nombre: empresaNombreLogin }]);
        //   return;
        // }

        // ✅ Si quieres que SIEMPRE sea seleccionable (aunque haya 1 sola):
        const res = await axios.get(`${EmpresasURL}`);
        const list = res.data || [];

        // opcional: ordenar
        list.sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0));

        setEmpresas(list);

        // si no hay seleccionada aún, setear login
        setEmpresaSeleccionada((prev) => prev || String(empresaIdLogin ?? ""));
      } catch (e) {
        console.error("Error cargando empresas:", e);

        // fallback: solo la empresa logeada
        setEmpresas([
          { id: Number(empresaIdLogin), nombre: empresaNombreLogin ?? `ID ${empresaIdLogin}` },
        ]);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    loadEmpresas();
  }, [mostrar, empresaIdLogin, empresaNombreLogin]);

  // =========================
  // Cargar rutas cada vez que cambia empresaSeleccionada
  // =========================
  useEffect(() => {
    if (!mostrar) return;
    if (!empresaIdSeleccionadaNum) {
      setRutas([]);
      setRutaSeleccionada("");
      return;
    }

    const loadRutas = async () => {
      try {
        setLoadingRutas(true);

        const res = await axios.get(`${rutasURL}`);
        const all = res.data || [];

        const rutasEmpresa = all.filter(
          (r) => Number(r?.empresasModel?.id) === empresaIdSeleccionadaNum
        );

        rutasEmpresa.sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0));
        setRutas(rutasEmpresa);

        // ✅ default: si está editando y la ruta pertenece a esta empresa, mantenerla
        const rutaActualId = datosaeditar?.rutasModel?.id ? String(datosaeditar.rutasModel.id) : "";

        const existeEnEmpresa = rutaActualId
          ? rutasEmpresa.some((r) => String(r.id) === rutaActualId)
          : false;

        if (existeEnEmpresa) {
          setRutaSeleccionada(rutaActualId);
        } else if (rutasEmpresa.length > 0) {
          // ✅ default: primera ruta de esa empresa
          setRutaSeleccionada(String(rutasEmpresa[0].id));
        } else {
          setRutaSeleccionada(""); // sin rutas
        }
      } catch (e) {
        console.error("Error cargando rutas:", e);
        setRutas([]);
        setRutaSeleccionada("");
      } finally {
        setLoadingRutas(false);
      }
    };

    loadRutas();
  }, [mostrar, empresaIdSeleccionadaNum, datosaeditar]);

  const handleClose = () => cerrar();

  const handleSubmit = () => {
    const payload = {
      ...(datosaeditar || {}),
      empresa: empresaIdSeleccionadaNum,
      nombre: empresaNombreAuto,
      velocidad: Number(velocidad ?? 67),
      volumen: Number(volumen ?? 27),
      estado: Boolean(estado ?? true),
      ruta: rutaSeleccionada ? Number(rutaSeleccionada) : null,
    };

    if (isEdit) editar(payload);
    else guardar(payload);

    cerrar();
  };

  return (
    <Modal show={mostrar} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Editar dispositivo" : "Agregar dispositivo"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ marginBottom: 12, opacity: 0.9 }}>
          {/*   <div>
            <b>Nombre (auto):</b> {empresaNombreAuto || "(sin nombre)"}
          </div>*/}
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Defaults: Velocidad 67 KM/h • Volumen 27
          </div>
        </div>

        {/* EMPRESA */}
        <Form.Group className="mb-3">
          <Form.Label>Empresa</Form.Label>

          {loadingEmpresas ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Spinner size="sm" />
              <span>Cargando empresas...</span>
            </div>
          ) : (
            <Form.Select
              value={empresaSeleccionada}
              onChange={(e) => setEmpresaSeleccionada(e.target.value)}
              className="bg-dark text-light border-secondary"
              disabled={empresas.length <= 1}
            >
              {empresas.map((e) => (
                <option key={e.id} value={String(e.id)}>
                  {e.nombre}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {/* RUTA */}
        <Form.Group className="mb-3">
          <Form.Label>Ruta (por defecto: primera ruta de la empresa)</Form.Label>

          {loadingRutas ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Spinner size="sm" />
              <span>Cargando rutas...</span>
            </div>
          ) : (
            <Form.Select
              value={rutaSeleccionada}
              onChange={(e) => setRutaSeleccionada(e.target.value)}
              className="bg-dark text-light border-secondary"
              disabled={rutas.length === 0}
            >
              {rutas.length === 0 ? (
                <option value="">(Esta empresa no tiene rutas)</option>
              ) : (
                rutas.map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.nomruta}
                  </option>
                ))
              )}
            </Form.Select>
          )}
        </Form.Group>

        {/* VELOCIDAD + VOLUMEN */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Form.Group style={{ flex: "1 1 160px" }}>
            <Form.Label>Velocidad (KM/h)</Form.Label>
            <Form.Control
              type="number"
              value={velocidad}
              onChange={(e) => setVelocidad(e.target.value)}
            />
          </Form.Group>

          <Form.Group style={{ flex: "1 1 160px" }}>
            <Form.Label>Volumen</Form.Label>
            <Form.Control
              type="number"
              value={volumen}
              onChange={(e) => setVolumen(e.target.value)}
            />
          </Form.Group>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="primary" onClick={handleSubmit} disabled={loadingEmpresas || loadingRutas}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
