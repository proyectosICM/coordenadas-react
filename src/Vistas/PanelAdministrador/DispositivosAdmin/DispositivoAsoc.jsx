import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../../../Common/NavBar";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsPlusCircleFill } from "react-icons/bs";
import { DispositivoCard } from "./DispositivoCard";
import axios from "axios";
import { DispositivoAsocModal } from "./DispositvoAsocModal";
import { EditarElemento, GuardarElementos } from "../../../Hooks/CRUDHooks";
import { dispositivoAsocRequestData } from "./DispositivoAsocRequestData";
import { useGlobalState } from "../../../Context/GlobalStateContext";
import Swal from "sweetalert2";
import { DispositivosURL } from "../../../API/apiurls";

export function DispositivoAsoc() {
  const { userData } = useGlobalState();
  const { empresaId, empresaNombre } = userData;

  const navigation = useNavigate();

  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);

  // ==========================================================
  // ⚠️ FILTRO "RETEN / TODOS" (OCULTO POR AHORA)
  // Si el cliente pide volver a mostrar el combobox:
  // 1) descomenta isAdmin/vista/setVista + el useEffect de vista
  // 2) descomenta getEmpresaIdDispositivo + datosMostrados con filtro
  // 3) descomenta el bloque del <Form.Select /> en el render
  // ==========================================================
  // const isAdmin = Number(empresaId) === 1;
  // const [vista, setVista] = useState(isAdmin ? "RETEN" : "TODOS");
  // useEffect(() => {
  //   if (Number(empresaId) === 1) setVista((prev) => prev || "RETEN");
  //   else setVista("TODOS");
  // }, [empresaId]);

  const handleShowModal = () => {
    setDatosEdit(null);
    setShow(true);
  };

  const [datos, setDatos] = useState([]);

  const cargarDatos = async () => {
    const response = await axios.get(`${DispositivosURL}`);
    setDatos(response.data || []);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCerrar = () => {
    setShow(false);
    setDatosEdit(null);
  };

  // ✅ Eliminar NO permitido: solo alerta
  const handleEliminar = () => {
    Swal.fire({
      icon: "info",
      title: "Acción no permitida",
      text:
        "No se puede eliminar ningún dispositivo. Cámbielo a otra empresa o déjelo en la empresa ICM como reten.",
      confirmButtonText: "Entendido",
    });
  };

  const handleGuardar = (datosFormulario) => {
    const requestData = dispositivoAsocRequestData(datosFormulario, empresaId, empresaNombre);

    GuardarElementos(`${DispositivosURL}`, requestData, datos, setDatos)
      .then(() => {
        setShow(false);
        cargarDatos();
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
        setShow(false);
      });
  };

  const handleEditar = async (dato) => {
    try {
      const requestData = dispositivoAsocRequestData(dato, empresaId, empresaNombre);

      await EditarElemento(`${DispositivosURL}/${dato.id}`, requestData).catch((error) => {
        console.error("Error al editar los datos:", error);
        Swal.fire("Error", "Hubo un error al editar el registro", "error");
      });

      setShow(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al editar los datos:", error);
      Swal.fire("Error", "Hubo un error al editar el registro", "error");
    }
  };

  const datosAEditar = (dispositivo) => {
    setDatosEdit(dispositivo);
    setShow(true);
  };

  // ==========================================================
  // ✅ MOSTRAR SIEMPRE TODOS LOS DISPOSITIVOS (como pediste)
  // (El filtro "RETEN" se dejó comentado arriba para re-habilitarlo)
  // ==========================================================
  const datosMostrados = useMemo(() => {
    return datos || [];
  }, [datos]);

  // ✅ ordenar por id DESC (más alto -> más bajo)
  const datosOrdenados = useMemo(() => {
    return [...datosMostrados].sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0));
  }, [datosMostrados]);

  // ✅ paginación FRONT (no toca API)
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [datosOrdenados.length]);

  const totalPages = Math.max(1, Math.ceil(datosOrdenados.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages - 1);
  const start = pageSafe * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const datosPagina = datosOrdenados.slice(start, end);

  const onPrev = () => setPage((p) => Math.max(0, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div>
      <NavBar />

      <div className="camionesMenu-contenedor">
        {/* ATRÁS full width (se queda igual) */}
        <Button style={{ width: "100%" }} onClick={() => navigation("/panel-administrador")}>
          Atras
        </Button>

        {/* ✅ CONTENIDO CENTRADO Y ORDENADO */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* TÍTULO */}
          <h1 style={{ color: "white", textAlign: "center", marginTop: 14 }}>
            Agrege solo dispositivos que haya generado
          </h1>

          {/* ==========================================================
              ⚠️ COMBOBOX "RETEN / TODOS" (OCULTO)
              Para re-habilitarlo, descomenta el bloque completo y la lógica arriba.
          ========================================================== */}
          {/*
          {isAdmin && (
            <div style={{ width: "100%", maxWidth: 420, marginTop: 10 }}>
              <Form.Select
                value={vista}
                onChange={(e) => setVista(e.target.value)}
                className="bg-dark text-light border-secondary"
              >
                <option value="RETEN">Ver dispositivos de empresa 1</option>
                <option value="TODOS">Ver todos los dispositivos</option>
              </Form.Select>
            </div>
          )}
          */}

          {/* BOTÓN AGREGAR */}
          <div style={{ width: "100%", maxWidth: 420, marginTop: 12, display: "flex", justifyContent: "center" }}>
            <Button onClick={handleShowModal} style={{ width: "100%" }}>
              <BsPlusCircleFill /> Agregar
            </Button>
          </div>

          {/* CARDS */}
          <div style={{ width: "100%", marginTop: 16 }}>
            <div
              style={{
                width: "100%",
                maxWidth: 1200,
                marginInline: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
                alignItems: "start",
                paddingInline: 12,
              }}
            >
              {datosOrdenados.length === 0 && (
                <p style={{ color: "white", opacity: 0.8, marginTop: 12, textAlign: "center", gridColumn: "1 / -1" }}>
                  No hay dispositivos para mostrar.
                </p>
              )}

              {datosPagina.map((dato) => (
                <div key={dato.id} style={{ width: "100%", justifySelf: "center" }}>
                  <DispositivoCard eliminar={handleEliminar} datosAEditar={datosAEditar} dispositivo={dato} />
                </div>
              ))}
            </div>
          </div>

          {/* PAGINACIÓN (abajo) */}
          {datosOrdenados.length > 0 && (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 10, gap: 10 }}>
              <Button variant="outline-light" disabled={pageSafe <= 0} onClick={onPrev}>
                Anterior
              </Button>

              <div style={{ color: "white", display: "flex", alignItems: "center", opacity: 0.9 }}>
                Página {pageSafe + 1} / {totalPages}
              </div>

              <Button variant="outline-light" disabled={pageSafe + 1 >= totalPages} onClick={onNext}>
                Siguiente
              </Button>
            </div>
          )}
        </div>

        <DispositivoAsocModal
          mostrar={show}
          datosaeditar={datosEdit}
          guardar={handleGuardar}
          cerrar={handleCerrar}
          editar={handleEditar}
          empresaIdLogin={empresaId}
          empresaNombreLogin={empresaNombre}
        />
      </div>
    </div>
  );
}
