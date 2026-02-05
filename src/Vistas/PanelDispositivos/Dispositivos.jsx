import React, { useEffect, useState } from "react";
import NavBar from "../../Common/NavBar";
import { Button, Card } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { DispositivosModal } from "./DispositivosModal";

import { DispositivosURL, DisxEmp } from "../../API/apiurls";
import { EditarElemento } from "../../Hooks/CRUDHooks";
import { useGlobalState } from "../../Context/GlobalStateContext";
import useErrorHandler from "../../Hooks/useErrorHandler";
import { PaginacionUtils } from "../../Hooks/PaginacionUtils";
import axios from "axios";

export function Dispositivos() {
  const navigation = useNavigate();

  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const [limp, setLimp] = useState(false);

  const { userData } = useGlobalState();
  const empresaId = userData?.empresaId;
  const { handleErrorResponse } = useErrorHandler();

  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(false);

  const Listar = async (page) => {
    if (!empresaId) return; // ✅ evita request con undefined

    try {
      setLoading(true);

      // ✅ mejor con params (evitas typos en querystring)
      const response = await axios.get(DisxEmp, {
        params: {
          empresaId,
          estado: 1, // o true si tu backend usa boolean
          page,      // si tu endpoint usa "page"
        },
      });

      const data = response.data || {};
      setDispositivos(data.content || []);
      setTotalPages(data.totalPages ?? 0);
      setCurrentPage(data.number ?? page);
    } catch (error) {
      console.error("Error al listar dispositivos", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ahora depende de empresaId también (cuando el contexto carga, re-lista)
  useEffect(() => {
    if (!empresaId) return;
    Listar(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresaId, pageNumber]);

  const handleShowModal = (t) => {
    setShow(true);
    if (t === "Nuevo") setLimp(true);
    else setLimp(false);
  };

  const handleCerrar = () => {
    setShow(false);
    setDatosEdit(null);
  };

  const datosAEditar = (dispositivo) => {
    setDatosEdit(dispositivo);
    setShow(true);
  };

  const handleGuardar = async (dato) => {
    try {
      // OJO: aquí tú estabas usando buildRequestData(dato, empresaId) (no lo incluiste completo)
      // Si tu endpoint /prop solo edita ruta/velocidad/volumen, guarda igual que editar.
      const requestData = {
        rutasModel: { id: Number(dato?.rutasModel?.id) },
        velocidad: dato.velocidad,
        volumen: dato.volumen,
      };

      await EditarElemento(`${DispositivosURL}/prop/${dato.id}`, requestData);
      setShow(false);
      Listar(pageNumber);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleEditar = async (dato) => {
    try {
      const requestData = {
        rutasModel: { id: Number(dato?.rutasModel?.id) },
        velocidad: dato.velocidad,
        volumen: dato.volumen,
      };

      await EditarElemento(`${DispositivosURL}/prop/${dato.id}`, requestData);
      setShow(false);
      Listar(pageNumber);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ color: "white" }}>Dispositivos de la empresa</h1>

      <div className="camionesMenu-contenedor">
        {!empresaId && (
          <div style={{ color: "white", opacity: 0.85, padding: 12 }}>
            Cargando empresa...
          </div>
        )}

        {empresaId && loading && (
          <div style={{ color: "white", opacity: 0.85, padding: 12 }}>
            Cargando dispositivos...
          </div>
        )}

        {empresaId && !loading && (!dispositivos || dispositivos.length === 0) && (
          <div style={{ color: "white", opacity: 0.85, padding: 12 }}>
            No hay dispositivos para esta empresa.
          </div>
        )}

        {dispositivos?.map((dispositivo) => {
          // ✅ evita crashear si viene sin ruta
          const empresaLabel =
            dispositivo?.rutasModel?.empresasModel?.nombre ?? "Sin empresa";
          const rutaLabel =
            dispositivo?.rutasModel?.nomruta ?? "Sin ruta asignada";

          return (
            <Card
              key={dispositivo.id}
              style={{
                width: "18rem",
                marginBottom: "20px",
                margin: "20px",
                padding: "10px",
              }}
            >
              <Card.Body>
                <Card.Title>
                  Identificador de dispositivo: {dispositivo.id}
                </Card.Title>

                <Card.Text>Empresa: {empresaLabel}</Card.Text>
                <Card.Text>Ruta: {rutaLabel}</Card.Text>
                <Card.Text>
                  Velocidad:{" "}
                  {dispositivo.velocidad != null
                    ? `${dispositivo.velocidad} KM/h`
                    : "N/A"}
                </Card.Text>
                <Card.Text>
                  Volumen: {dispositivo.volumen != null ? dispositivo.volumen : "N/A"}
                </Card.Text>
              </Card.Body>

              <Button
                variant="secondary"
                onClick={() => datosAEditar(dispositivo)}
                style={{ backgroundColor: "#727273", borderColor: "black", color: "black" }}
              >
                <BsGearFill /> Configuración
              </Button>
            </Card>
          );
        })}

        <PaginacionUtils
          setPageNumber={setPageNumber}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      <DispositivosModal
        mostrar={show}
        cerrar={handleCerrar}
        guardar={handleGuardar}
        datosaeditar={datosEdit}
        editar={handleEditar}
        limp={limp}  // ✅ el modal debe recibir "limp" si vas a usarlo
        title={datosEdit ? "Editar dispositivo" : "Nuevo dispositivo"}
      />
    </div>
  );
}
