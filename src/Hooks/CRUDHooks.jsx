import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGlobalState } from "../Context/GlobalStateContext";

export function useListarElementos(url, dato, setDatos) {

  const { userData } = useGlobalState(); 
  const { empresaId } = userData; 

  const navigation = useNavigate();
 
  const ListarCarriles = async () => {
    if (empresaId) {
      try {
        const response = await axios.get(url);
        setDatos(response.data);

      } catch (error) {
        console.error("Error al obtener los datos:", error, url);
      }
    } else {
      // navigation("/");
      console.log("Yia")
    }
  };

  useEffect(() => {
    ListarCarriles();
  }, [setDatos]);

  return dato;
}

export function ListarElementos(url, setDatos) {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setDatos(response.data);
        console.log("Datos actualizados");
      } catch (error) {
        console.error("Error al listar", error);
      }
    };

    fetchData();
  }, [url, setDatos]);
}

export function GuardarElementos(url, requestData, datos, setDatos) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${url}`, requestData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
        reject(error); 
      });
  });
}

export function EditarElemento(url, requestData) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${url}`, requestData)
      .then((response) => {
        resolve(response.data); 
      })
      .catch((error) => {
        console.error("Error al editar los datos:", error);
        reject(error); 
        Swal.fire("Error", "Hubo un error al editar el registro", "error");
      });
  });
}
