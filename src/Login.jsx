import axios from "axios";
import React, { useState } from "react";
import { loginURL } from "./API/apiurls";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataInicio = {
      usuario: usuario,
      password: contrasena,
    };
  
    axios.post(loginURL, dataInicio)
      .then((response) => {
        console.log("Respuesta:", response);
        console.log("Datos:", response.data);
        console.log("Empresa:", response.data.id);
        console.log("Estado:", response.status);

        localStorage.setItem("empresa", response.data.id)
        navigation('/rutas');
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error en inicio de sesion ");
      });
  };

  return (
    <div className="login-container">
      <h1>Ingreso al Sistema</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="usuario">Usuario:</label>
        <input
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <label htmlFor="contrasena">Contraseña:</label>
        <input
          type="password"
          id="contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      <h1>{error}</h1>
    </div>
  );
}
