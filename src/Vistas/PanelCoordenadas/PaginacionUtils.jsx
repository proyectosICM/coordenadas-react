import axios from "axios";

export const cargarDatos = async (page, routeId) => {
  try {
    const response = await axios.get(`http://localhost:8087/api/coordenadas/cxr/${routeId}?pageNumber=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    return { content: [], totalPages: 0 };
  }
};

export const goToPreviousPage = (currentPage) => {
  if (currentPage > 0) {
    return currentPage - 1;
  }
  return currentPage;
};

export const goToNextPage = (currentPage, totalPages) => {
  if (currentPage < totalPages - 1) {
    return currentPage + 1;
  }
  return currentPage;
};