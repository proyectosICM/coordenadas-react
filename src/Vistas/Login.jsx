import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiUserLine, RiLockPasswordLine } from "react-icons/ri";
import { useGlobalState } from "../Context/GlobalStateContext";
import { loginURL } from "../API/apiurls";
import "../Styles/login.css";

export function Login() {
  const { userData, setUserData } = useGlobalState();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigate();
 
  useEffect(() => {
    let empresa = localStorage.getItem("empresaid");
    if (empresa) {
      navigation("/rutas");
    }
  }, [navigation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario || !contrasena) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    try {
      const dataInicio = { usuario, password: contrasena };
      const response = await axios.post(loginURL, dataInicio);

      axios
      .post(loginURL, dataInicio)
      .then((response) => {
        localStorage.setItem("empresaid", response.data.id);
        localStorage.setItem("empresaNombre", response.data.nombre);

        setUserData({
          empresaId: response.data.id,
          empresaNombre: response.data.nombre,
          empresaUsuario: response.data.usuario,
        });

        navigation("/rutas");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error en inicio de sesión");
      });
      //navigation("/rutas");
    } catch (error) {
      console.error("Error:", error);
/*
      if (error.response && error.response.status === 401) {
        setError("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
      } else if (error.message === "Network Error") {
        setError("Error de conexión. Comprueba tu conexión a internet.");
      } else {
        setError("Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde.");
      }*/
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="usuario">
            <RiUserLine /> Usuario:
          </label>
          <input type="text" id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required placeholder="Usuario" />
        </div>
        <div className="input-group">
          <label htmlFor="contrasena">
            <RiLockPasswordLine /> Contraseña:
          </label>
          <input type="password" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required placeholder="Password" />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-submit">
          Login
        </button>
      </form>
    </div>
  );
}
