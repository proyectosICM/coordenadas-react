import axios from "axios";
import { Button } from "react-bootstrap";
import { useState } from "react";

export const cargarDatos = async (page, routeId) => {
  try {
    const response = await axios.get(`http://localhost:8087/api/coordenadas/cxr/${routeId}?pageNumber=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    return { content: [], totalPages: 0 };
  }
};

export function PaginacionUtils({ setPageNumber, setCurrentPage, currentPage, totalPages }) {
  const goToPreviousPage = () => {
    setPageNumber((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage)); // Actualizar currentPage
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : prevPage));
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : prevPage)); // Actualizar currentPage
  };

  return (
    <div style={{ marginTop: "30px", width: "100%", userSelect: "none" }}>
      <Button onClick={goToPreviousPage} disabled={currentPage === 0}>
        Anterior
      </Button>
      <span style={{ margin: "0 10px" }}>
        Página {currentPage + 1} de {totalPages}
      </span>
      <Button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
        Siguiente
      </Button>
    </div>
  );
}

