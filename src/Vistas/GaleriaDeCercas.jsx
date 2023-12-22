import React, { useState, useEffect } from "react";
import NavBar from "../Common/NavBar";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { GeocercaURL, GeocercaxPaisxTipoURL, GeocercaxTipoSURL, TipoSURL, paisesURL } from "../API/apiurls";
import { Form, Col } from "react-bootstrap";
import axios from "axios";
import { GeocercaxPaisURL } from "./../API/apiurls";

export function GaleriaDeCercas() {
  const [cercas, setCercas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [tipoS, setTipoS] = useState([]);
  const [filtroPais, setFiltroPais] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState(""); 

  useListarElementos(GeocercaURL, cercas, setCercas);
  useListarElementos(paisesURL, paises, setPaises);
  useListarElementos(TipoSURL, tipoS, setTipoS);

  useEffect(() => {
    const fetchData = async () => {
      if (filtroPais && !filtroCategoria) {
        setCercas("");
        try {
          const response = await axios.get(`${GeocercaxPaisURL}${filtroPais}`);
          setCercas(response.data);
        } catch (error) {
          console.error(
            "Error al cargar datos:",
            error,
            `${GeocercaxPaisURL}${filtroPais}`
          );
        }
      } else if (!filtroPais && filtroCategoria) {
        setCercas("");
        try {
          const response = await axios.get(`${GeocercaxTipoSURL}${filtroCategoria}`);
          setCercas(response.data);
        } catch (error) {
          console.error(
            "Error al cargar datos:",
            error,
            `${GeocercaxPaisURL}${filtroCategoria}`
          );
        }
      } else if (filtroPais && filtroCategoria) {
        setCercas("");
        try {
          const response = await axios.get(`${GeocercaxPaisxTipoURL}${filtroPais}/${filtroCategoria}`);
          setCercas(response.data);
        } catch (error) {
          console.error(
            "Error al cargar datos:",
            error,
            `${GeocercaxPaisURL}${filtroPais}`
          );
        }
      } else {
        const response = await axios.get(`${GeocercaURL}`);
        setCercas(response.data);
      }
    };

    fetchData();
  }, [filtroPais, filtroCategoria]);

  const categorias = [
    "Todas",
    "Señales Reglamentarias",
    "Señales Informativas",
    "Señales de Prevención",
  ];

  useEffect(() => {}, [filtroCategoria]);

  return (
    <div style={{color: "white"}}>
      <NavBar />
      <h1>Galería de Cercas</h1>

      {/* Filtros */}
      <div style={{ width: "300px", margin: "0 auto", color: "white" }}>
        <Form.Group as={Col} controlId="filtroPais">
          <Form.Label>Filtrar por País: </Form.Label>
          <Form.Control
            as="select"
            value={filtroPais}
            onChange={(e) => setFiltroPais(e.target.value)}
          >
            <option value="">Todos los países</option>
            {paises.map((pais) => (
              <option key={pais.id} value={pais.id}>
                {pais.nombre}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="filtroCategoria">
          <Form.Label>Filtrar por Categoría: </Form.Label>
          <Form.Control
            as="select"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value={""}>Todas</option>
            {tipoS.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                Señales {categoria.nombre}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
      <div
        style={{
          display: "flex",
          width: "80%",
          height: "600px",
          flexWrap: "wrap",
          margin: "20px auto",
          justifyContent: "center",
          overflow: "scroll"
        }}
      >
        {cercas &&
          cercas.map((cerca) => (
            <div
              key={cerca.id}
              style={{
                width: "300px",
                height: "300px",
                border: "2px solid black",
                margin: "2%",
                padding: "2%",
              }}
            >
              <h2>{cerca.nombre}</h2>
              <img
                src={cerca.urlImagen}
                alt="Imagen de Cerca"
                style={{ width: "150px", height: "150px" }}
              />
              <p style={{ margin:"0" }}>Codigo de sonido: {cerca.codsonido}</p>
              <p>Nombre: {cerca.detalle && cerca.detalle}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
