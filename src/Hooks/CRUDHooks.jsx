import axios from "axios";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useListarElementos(url, dato, setDatos) {
  const empresa = localStorage.getItem("empresa");
  const navigation = useNavigate();

  const ListarCarriles = async () => {
    if(empresa){
      try {
        const response = await axios.get(url);
        setDatos(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }else{
      navigation("/");
    }

  };

  useEffect(() => {
    ListarCarriles();
  }, []);

  return dato;
}