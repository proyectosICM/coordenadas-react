import React, { useState, useEffect } from "react";
import NavBar from "../Common/NavBar";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { GeocercaURL, TipoSURL, paisesURL } from "../API/apiurls";
import { Form, Col } from "react-bootstrap";

export function GaleriaDeCercas() {
  const [cercas, setCercas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [tipoS, setTipoS] = useState([]);
  const [filtroPais, setFiltroPais] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas"); // Estado para el filtro de categoría

  useListarElementos(GeocercaURL, cercas, setCercas);
  useListarElementos(paisesURL, paises, setPaises);
  useListarElementos(TipoSURL, tipoS, setTipoS);

  const categorias = [
    "Todas",
    "Señales Reglamentarias",
    "Señales Informativas",
    "Señales de Prevención",
  ];

  useEffect(() => {
    // Aquí puedes implementar la lógica para filtrar las cercas según la categoría seleccionada.
  }, [filtroCategoria]);

  return (
    <div>
      <NavBar />
      <h1>Galería de Cercas</h1>

      {/* Filtros */}
      <div style={{ width: "300px", margin: "0 auto" }}>
        <Form.Group as={Col} controlId="filtroPais">
          <Form.Label>Filtrar por País: </Form.Label>
          <Form.Control
            as="select"
            value={filtroPais}
            onChange={(e) => setFiltroPais(e.target.value)}
          >
            <option value="">Todos los países</option>
            {paises.map((pais) => (
              <option key={pais.id} value={pais.nombre}>
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
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>

      {/* Galería de Cercas */}
      <div
        style={{
          display: "flex",
          width: "80%",
          height: "80%",
          flexWrap: "wrap",
          margin: "0 auto",
          justifyContent: "center",
        }}
      >
        {cercas &&
          cercas.map((cerca) => (
            <div
              key={cerca.id}
              style={{
                width: "250px",
                height: "250px",
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
            </div>
          ))}
      </div>
    </div>
  );
}
