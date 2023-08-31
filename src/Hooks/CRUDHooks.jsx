import axios from "axios";
import { useCallback, useEffect } from "react";

export function useListarElementos(url, dato, setDatos) {
  const ListarCarriles = async () => {
    try {
      const response = await axios.get(url);
      setDatos(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    ListarCarriles();
  }, []);

  return dato;
}