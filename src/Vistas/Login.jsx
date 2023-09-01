import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiUserLine, RiLockPasswordLine } from "react-icons/ri"; // Importa los íconos de usuario y contraseña desde React Icons
import "../Styles/login.css";
import { loginURL } from "../API/apiurls";

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

    axios
      .post(loginURL, dataInicio)
      .then((response) => {
        console.log("Respuesta:", response);
        console.log("Datos:", response.data);
        console.log("Empresa:", response.data.id);
        console.log("Estado:", response.status);

        localStorage.setItem("empresa", response.data.id);
        localStorage.setItem("empresaNombre", response.data.nombre);
        navigation("/rutas");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error en inicio de sesión");
      });
  };

  return (
    <div className="login-container">
      <div className="underlay-photo"></div>
      <div className="underlay-black"></div>
      <form onSubmit={handleSubmit} className="login-form">
        <p className="login-text">
          <span className="fa-stack fa-lg">
            <i className="fa fa-circle fa-stack-2x"></i>
            <i className="fa fa-lock fa-stack-1x"></i>
          </span>
        </p>
        <div className="input-group">
          <label htmlFor="usuario">
            <RiUserLine /> Usuario:
          </label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="contrasena">
            <RiLockPasswordLine /> Contraseña:
          </label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <a href="#" className="login-forgot-pass">
          Olvido su contraseña?
        </a>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-submit">
          Login
        </button>
      </form>
    </div>
  );
}
