import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiUserLine, RiLockPasswordLine } from "react-icons/ri"; 
import "../Styles/login.css";
import { loginURL } from "../API/apiurls";

export function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigate();

  useEffect(()=> {
    let empresa = localStorage.getItem("empresa");
    if(empresa){
      navigation('/rutas');
    }
  },[navigation])

  const handleSubmit = (e) => {

    e.preventDefault();
    const dataInicio = {
      usuario: usuario,
      password: contrasena,
    };

    axios
      .post(loginURL, dataInicio)
      .then((response) => {
        localStorage.setItem("empresa", response.data.id);
        localStorage.setItem("empresaNombre", response.data.nombre);
        navigation("/rutas");
        console.log("hol")
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error en inicio de sesión");
      });

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
