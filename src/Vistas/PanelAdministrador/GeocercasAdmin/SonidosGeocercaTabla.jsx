import React from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import {
  RiArrowLeftLine,
  RiHashtag,
  RiImageLine,
  RiVolumeUpLine,
  RiMapPin2Line,
  RiSettings3Line,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiBookmark3Line,
} from "react-icons/ri";

export function SonidosGeocercaTabla({
  handleShowModal,
  datos,
  eliminar,
  datosaeditar,
  page,
  totalPages,
  totalElements,
  loading,
  onPrev,
  onNext,
}) {
  const navigation = useNavigate();

  return (
    <>
      <Button style={{ width: "100%", marginBottom: "12px" }} onClick={() => navigation("/panel-administrador")}>
        <RiArrowLeftLine style={{ marginRight: 8 }} /> Atras
      </Button>

      {/* Agregar arriba */}
      <div style={{ width: "100%", marginBottom: "12px" }}>
        <Button onClick={() => handleShowModal("Nuevo")}>
          <BsPlusCircleFill /> Agregar
        </Button>
      </div>

      {/* Tabla */}
      <div style={{ width: "100%" }}>
        <div className="table-responsive">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th><RiHashtag style={{ marginRight: 6 }} />ID</th>
                <th><RiBookmark3Line style={{ marginRight: 6 }} />Nombre</th>
                <th><RiSettings3Line style={{ marginRight: 6 }} />TipoS</th>
                <th><RiMapPin2Line style={{ marginRight: 6 }} />País</th>
                <th><RiImageLine style={{ marginRight: 6 }} />Imagen</th>
                <th><RiVolumeUpLine style={{ marginRight: 6 }} />Sonido</th>
                <th>Cod</th>
                <th>Detalle</th>
                <th><RiSettings3Line style={{ marginRight: 6 }} />Acciones</th>
              </tr>
            </thead>

            <tbody>
              {(!datos || datos.length === 0) && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", opacity: 0.8 }}>
                    {loading ? "Cargando..." : "No hay registros"}
                  </td>
                </tr>
              )}

              {datos?.map((geo) => {
                const tipoLabel = geo?.tipoSModel?.nombre ?? `ID ${geo?.tipoSModel?.id ?? "-"}`;
                const paisLabel = geo?.paisesModel?.nombre ?? `ID ${geo?.paisesModel?.id ?? "-"}`;

                return (
                  <tr key={geo.id}>
                    <td>{geo.id}</td>
                    <td>{geo.nombre}</td>
                    <td>{tipoLabel}</td>
                    <td>{paisLabel}</td>

                    {/* ✅ imagen sin link */}
                    <td style={{ width: 70, textAlign: "center", verticalAlign: "middle" }}>
                      {geo?.urlImagen ? (
                        <img
                          src={geo.urlImagen}
                          alt="img"
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span style={{ opacity: 0.7, fontSize: 12 }}>Sin imagen</span>
                      )}
                    </td>

                    {/* ✅ audio inline */}
                    <td style={{ width: 210, textAlign: "center", verticalAlign: "middle" }}>
                      {geo?.urlSonido ? (
                        <audio controls preload="none" style={{ width: 190, height: 34 }}>
                          <source src={geo.urlSonido} />
                          Tu navegador no soporta audio.
                        </audio>
                      ) : (
                        <span style={{ opacity: 0.7, fontSize: 12 }}>Sin sonido</span>
                      )}
                    </td>

                    <td>{geo.codsonido}</td>
                    <td style={{ maxWidth: 240, wordBreak: "break-word" }}>{geo.detalle}</td>
                    <td>
                      <Button variant="warning" style={{ marginInline: "10px" }} onClick={() => datosaeditar(geo)}>
                        <GrEdit /> Editar
                      </Button>
                      <Button variant="danger" style={{ marginInline: "10px" }} onClick={() => eliminar(geo.id)}>
                        <BsXCircleFill /> Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Paginación */}
      <div
        style={{
          width: "100%",
          marginTop: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Button variant="outline-light" disabled={loading || page <= 0} onClick={onPrev}>
          <RiArrowLeftSLine /> Anterior
        </Button>

        <span style={{ opacity: 0.85 }}>
          {loading ? "Cargando..." : `Página ${page + 1} / ${Math.max(totalPages, 1)} • ${totalElements} registros`}
        </span>

        <Button variant="outline-light" disabled={loading || page + 1 >= totalPages} onClick={onNext}>
          Siguiente <RiArrowRightSLine />
        </Button>
      </div>
    </>
  );
}
