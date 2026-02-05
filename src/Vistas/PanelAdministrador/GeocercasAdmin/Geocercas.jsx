import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../../../Common/NavBar";
import { SonidosGeocercaTabla } from "./SonidosGeocercaTabla";
import { SonidosGeocercaModal } from "./SonidosGeocercaModal";
import axios from "axios";
import Swal from "sweetalert2";
import { Form } from "react-bootstrap";

import { GeocercaURL, GeocercaxPaisURL, paisesURL } from "../../../API/apiurls";

function buildMultipartPayload(form) {
  // ✅ este objeto debe matchear SonidosGeocercaUpsertRequest del backend
  const data = {
    nombre: (form.nombre ?? "").trim(),
    tipoSId: form.tipoS ? Number(form.tipoS) : null,
    paisId: form.pais ? Number(form.pais) : null,
    codsonido:
      form.codsonido === "" || form.codsonido === null || form.codsonido === undefined
        ? null
        : Number(form.codsonido),
    detalle: form.detalle ?? "",

    // opcional: si no subes archivo, puedes mandar URL manual
    urlImagen: (form.urlImagen ?? "").trim() || null,
    urlSonido: (form.urlSonido ?? "").trim() || null,
  };

  const fd = new FormData();
  fd.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

  if (form.imagenFile) fd.append("imagen", form.imagenFile);
  if (form.audioFile) fd.append("audio", form.audioFile);

  return fd;
}

export function SonidosGeocerca() {
  const [datosEdit, setDatosEdit] = useState(null);
  const [show, setShow] = useState(false);

  // ✅ datos base (si ALL = page content; si filtro = lista completa por país)
  const [datosRaw, setDatosRaw] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ PAISES (FILTRO)
  const [loadingPaises, setLoadingPaises] = useState(false);
  const [paises, setPaises] = useState([]);
  const [paisFiltro, setPaisFiltro] = useState("ALL"); // "ALL" o "ID"
  const filtroActivo = paisFiltro !== "ALL";

  const handleShowModal = () => setShow(true);

  const handleCerrar = () => {
    setShow(false);
    setDatosEdit(null);
  };

  // ✅ cargar países al montar
  useEffect(() => {
    const loadPaises = async () => {
      try {
        setLoadingPaises(true);
        const res = await axios.get(`${paisesURL}`);
        const list = res.data || [];
        list.sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0));
        setPaises(list);
      } catch (e) {
        console.error("Error cargando países:", e);
        setPaises([]);
      } finally {
        setLoadingPaises(false);
      }
    };

    loadPaises();
  }, []);

  // ✅ cargar datos (ALL = paginado backend / filtro = lista por país)
  const cargarDatos = async (p = 0, s = size, pf = paisFiltro) => {
    setLoading(true);
    try {
      if (pf === "ALL") {
        const response = await axios.get(`${GeocercaURL}/page`, {
          params: { page: p, size: s },
        });

        setDatosRaw(response.data.content || []);
        setTotalPages(response.data.totalPages ?? 0);
        setTotalElements(response.data.totalElements ?? 0);
        setPage(response.data.number ?? p);
        setSize(response.data.size ?? s);
      } else {
        const pid = Number(pf);
        const res = await axios.get(`${GeocercaxPaisURL}${pid}`);
        const list = res.data || [];

        setDatosRaw(list);

        // ✅ paginación local
        const tp = Math.ceil(list.length / s);
        setTotalPages(tp);
        setTotalElements(list.length);
        setPage(p);
        setSize(s);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      Swal.fire("Error", "No se pudo cargar la lista de geocercas", "error");

      setDatosRaw([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ carga inicial
  useEffect(() => {
    cargarDatos(0, size, "ALL");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ cuando cambia el país filtro: vuelve a página 0 y recarga
  useEffect(() => {
    setPage(0);
    cargarDatos(0, size, paisFiltro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paisFiltro]);

  const datosAEditar = (geo) => {
    setDatosEdit(geo);
    setShow(true);
  };

  // ✅ CREATE multipart
  const handleGuardar = async (dataFormWithFiles) => {
    try {
      Swal.fire({
        title: "Guardando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fd = buildMultipartPayload(dataFormWithFiles);

      await axios.post(GeocercaURL, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.close();
      handleCerrar();
      cargarDatos(page, size, paisFiltro);
      Swal.fire("OK", "Guardado correctamente", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Hubo un error al guardar", "error");
    }
  };

  // ✅ UPDATE multipart
  const handleEditar = async (dataFormWithFiles) => {
    try {
      Swal.fire({
        title: "Actualizando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const id = dataFormWithFiles?.id;
      if (!id) {
        Swal.close();
        Swal.fire("Error", "ID inválido para editar", "error");
        return;
      }

      const fd = buildMultipartPayload(dataFormWithFiles);

      await axios.put(`${GeocercaURL}/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.close();
      handleCerrar();
      cargarDatos(page, size, paisFiltro);
      Swal.fire("OK", "Actualizado correctamente", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Hubo un error al editar", "error");
    }
  };

  const handleConfirmDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar geocerca?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .delete(`${GeocercaURL}/${id}`)
        .then(() => {
          Swal.fire("OK", "Eliminado correctamente", "success");

          const isLastItemOnPage = (datosRaw?.length ?? 0) === 1 && page > 0;
          const nextPage = isLastItemOnPage ? page - 1 : page;

          if (filtroActivo) {
            setPage(nextPage);
            cargarDatos(0, size, paisFiltro);
          } else {
            cargarDatos(nextPage, size, "ALL");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          Swal.fire("Error", "Hubo un error al intentar eliminar", "error");
        });
    });
  };

  // ✅ datos para la tabla (si filtro: slice local / si ALL: ya viene paginado)
  const datosTabla = useMemo(() => {
    if (!filtroActivo) return datosRaw;
    const start = page * size;
    const end = start + size;
    return (datosRaw || []).slice(start, end);
  }, [datosRaw, filtroActivo, page, size]);

  const handlePrev = () => {
    if (page <= 0) return;
    const next = page - 1;
    setPage(next);
    if (!filtroActivo) cargarDatos(next, size, "ALL");
  };

  const handleNext = () => {
    if (page + 1 >= totalPages) return;
    const next = page + 1;
    setPage(next);
    if (!filtroActivo) cargarDatos(next, size, "ALL");
  };

  return (
    <div>
      <NavBar />

      <div className="camionesMenu-contenedor">
        {/* ✅ FILTRO POR PAÍS */}
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 12 }}>
          <Form.Label style={{ color: "white", opacity: 0.9 }}>Filtrar por país</Form.Label>
          <Form.Select
            value={paisFiltro}
            onChange={(e) => setPaisFiltro(e.target.value)}
            className="bg-dark text-light border-secondary"
            disabled={loadingPaises || loading}
          >
            <option value="ALL">TODOS</option>
            {paises.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.nombre ?? p.pais ?? "País"} (ID: {p.id})
              </option>
            ))}
          </Form.Select>
        </div>

        <SonidosGeocercaTabla
          datos={datosTabla}
          eliminar={handleConfirmDelete}
          datosaeditar={datosAEditar}
          handleShowModal={handleShowModal}
          page={page}
          totalPages={Math.max(totalPages, 1)}
          totalElements={totalElements}
          loading={loading}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      <SonidosGeocercaModal
        mostrar={show}
        datosaeditar={datosEdit}
        editar={handleEditar}
        cerrar={handleCerrar}
        guardar={handleGuardar}
        title={datosEdit ? "Editar Geocerca" : "Nueva Geocerca"}
      />
    </div>
  );
}
