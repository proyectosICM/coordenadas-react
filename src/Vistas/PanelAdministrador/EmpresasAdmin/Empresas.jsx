import React, { useEffect, useState } from "react";
import NavBar from "../../../Common/NavBar";
import { EmpresasTabla } from "./EmpresasTabla";
import { EmpresasModel } from "./EmpresasModal";
import { EmpresasURL } from "../../../API/apiurls";
import { GuardarElementos } from "../../../Hooks/CRUDHooks";
import { requestDataEmpresa } from "./requestDataEmpresa";
import Swal from "sweetalert2";
import axios from "axios";

export function Empresas() {
  const [datosEdit, setDatosEdit] = useState(null);
  const [show, setShow] = useState(false);
  const [datos, setDatos] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => setShow(true);
  const handleCerrar = () => {
    setShow(false);
    setDatosEdit(null);
  };

  const cargarDatos = async (p = page, s = size) => {
    setLoading(true);
    try {
      const response = await axios.get(`${EmpresasURL}/page`, {
        params: { page: p, size: s },
      });

      // response.data = Page<EmpresasModel>
      setDatos(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
      setTotalElements(response.data.totalElements ?? 0);
      setPage(response.data.number ?? p);
      setSize(response.data.size ?? s);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos(0, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuardar = (dataForm) => {
    setTimeout(() => {
      Swal.fire({
        title: "Cargando...",
        timer: 500,
        timerProgressBar: true,
        didOpen: () => Swal.showLoading(),
      }).then(() => {
        const requestData = requestDataEmpresa(dataForm);

        GuardarElementos(EmpresasURL, requestData, dataForm, setDatos).then(() => {
          // recargar página actual
          cargarDatos(page, size);
        });

        handleCerrar();
      });
    }, 500);
  };

  const datosAEditar = (empresa) => {
    setDatosEdit(empresa);
    setShow(true);
  };

  const handleEditar = (dato) => {
    const requestData = requestDataEmpresa(dato);

    axios
      .put(`${EmpresasURL}/${dato.id}`, requestData)
      .then(() => {
        handleCerrar();
        cargarDatos(page, size);
      })
      .catch((error) => {
        console.error("Error al editar los datos:", error);
        Swal.fire("Error", "Hubo un error al editar el registro", "error");
      });
  };

  const handleConfirmDelete = (id) => {
    axios
      .delete(`${EmpresasURL}/${id}`)
      .then(() => {
        alert("Eliminado correctamente");

        // si borras el último elemento de la página, retrocede una página si hace falta
        const isLastItemOnPage = datos.length === 1 && page > 0;
        const nextPage = isLastItemOnPage ? page - 1 : page;

        cargarDatos(nextPage, size);
      })
      .catch((error) => {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al intentar eliminar");
      });
  };

  const handlePrev = () => {
    if (page > 0) cargarDatos(page - 1, size);
  };

  const handleNext = () => {
    if (page + 1 < totalPages) cargarDatos(page + 1, size);
  };

  return (
    <div>
      <NavBar />

      <div className="camionesMenu-contenedor">
        <EmpresasTabla
          datos={datos}
          eliminar={handleConfirmDelete}
          datosaeditar={datosAEditar}
          handleShowModal={handleShowModal}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          size={size}
          loading={loading}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      <EmpresasModel
        mostrar={show}
        datosaeditar={datosEdit}
        editar={handleEditar}
        cerrar={handleCerrar}
        guardar={handleGuardar}
        title={datosEdit ? "Editar Empresa" : "Nueva Empresa"}
      />
    </div>
  );
}
