import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { Map, Marker } from "google-maps-react";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { GeocercaURL, GeocercaxPaisURL, GeocercaxPaisxTipoURL, sonidosVelocidadURL } from "../API/apiurls";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import { SiGooglemaps } from "react-icons/si";
import { BsSpeedometer2 } from "react-icons/bs";
import { AiFillSound } from "react-icons/ai";
import { BsFillSignpost2Fill } from "react-icons/bs";

function CoordenadasModal({ mostrar, cerrar, guardar, editar, datosaeditar, limp, title }) {
  // Variables de estado para los campos de entrada y las coordenadas del marcador
  const [formData, setFormData] = useState({
    coordenadas: "",
    radio: "",
    velocidad: "10",
    velocidadValor: "",
    sonidoVelocidad: "",
    sonidoGeocerca: "",
    imagenGeocerca: "",
    codsonidoG: "",
    codvel: "",
  });

  const [geocercaTipo, setGeocercaTipo] = useState("Todas");

  const [velocidades, setVelocidades] = useState([]);
  useListarElementos(`${sonidosVelocidadURL}`, velocidades, setVelocidades);

  const pais = localStorage.getItem("pais");
  const [geocercas, setGeocercas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (pais && geocercaTipo == "Todas") {
        setGeocercas("");
        try {
          const response = await axios.get(`${GeocercaxPaisURL}${pais}`);
          setGeocercas(response.data);
        } catch (error) {
          console.error("Error al cargar datos:", error, `${GeocercaxPaisURL}${pais}`);
        }
      } else if (pais && geocercaTipo !== "Todas") {
        setGeocercas("");

        try {
          let tc;
          if (geocercaTipo == "Reglamentarias") {
            tc = 1;
          } else if (geocercaTipo == "Preventivas") {
            tc = 2;
          } else if (geocercaTipo == "Informativas") {
            tc = 3;
          }
          const response = await axios.get(`${GeocercaxPaisxTipoURL}${pais}/${tc}`);
          setGeocercas(response.data);
        } catch (error) {
          console.error("Error al cargar datos:", error, `${GeocercaxPaisURL}${pais}`);
        }
      } else {
        const response = await axios.get(`${GeocercaURL}`);
        setGeocercas(response.data);
      }
    };

    fetchData();
  }, [pais, geocercaTipo]);

  const [idvelocidad, setIdvelocidad] = useState([]);
  const [velocidadesS, setVelocidadesS] = useState([]);
  const [geocercaD, setGeocercaD] = useState([]);
  const [audio, setAudio] = useState([]);

  useEffect(() => {
    if (datosaeditar) {
      setFormData({
        id: datosaeditar.id,
        coordenadas: datosaeditar.coordenadas,
        radio: datosaeditar.radio,
        velocidad: datosaeditar.sonidosVelocidadModel.id,
        velocidadValor: datosaeditar.sonidosVelocidadModel.id,
        codvel: datosaeditar.sonidosVelocidadModel.codvel,
        sonidoGeocerca: datosaeditar.sonidosGeocercaModel.id,
        codsonidoG: datosaeditar.sonidosGeocercaModel.codsonido,
        imagenGeocerca: datosaeditar.sonidosGeocercaModel.id,
      });

      const ListarDatos = async () => {
        try {
          const response = await axios.get(`${sonidosVelocidadURL}/${datosaeditar.sonidosVelocidadModel.id}`);

          setVelocidadesS(response.data);
          const responseGeocercaD = await axios.get(`${GeocercaURL}/${datosaeditar.sonidosGeocercaModel.id}`);
          setGeocercaD(responseGeocercaD.data);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      };
      ListarDatos();
    }
  }, [datosaeditar]);

  useEffect(() => {
    if (limp) {
      limpiar();
    }
  }, [limp]);

  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  const handleClose = () => {
    cerrar();
    limpiar();
  };

  const handleSave = () => {
    if (datosaeditar) {
      editar(formData);
    } else {
      guardar(formData);
    }
    cerrar();
    limpiar();
  };

  const limpiar = () => {
    setFormData({
      coordenadas: "",
      radio: "",
      velocidad: "10",
      velocidadValor: "",
      sonidoVelocidad: "",
      sonidoGeocerca: "",
      imagenGeocerca: "",
      codsonidoG: "",
      codvel: "",
    });
    setVelocidadesS("");
    setGeocercaD("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSeleccionarAudio = async (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];
    try {
      const response = await axios.get(`${sonidosVelocidadURL}/${value}`);
      setVelocidadesS(response.data);

      setFormData({
        ...formData,
        codvel: response.data.codvel,
        velocidad: value,
        velocidadValor: selectedOption.text,
      });
      setIdvelocidad(value);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const [codsonidoG, setSonidoG] = useState();
  const handleSeleccionarGeocerca = async (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];

    try {
      const response = await axios.get(`${GeocercaURL}/${value}`);
      const codsonido = response.data.codsonido;

      setSonidoG(response.data);

      const responseGeocercaD = await axios.get(`${GeocercaURL}/${value}`);
      setGeocercaD(responseGeocercaD.data);

      setFormData({
        ...formData,
        sonidoGeocerca: selectedOption.value,
        imagenGeocerca: selectedOption.value,
        codsonidoG: responseGeocercaD.data.codsonido,
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const openGoogleMaps = () => {
    // Aquí puedes construir la URL de Google Maps con las coordenadas ingresadas
    // const googleMapsUrl = `https://www.google.com/maps?q=-12.046861, -77.042341`;
    const googleMapsUrl = `https://www.google.com/maps?q=-12.046861, -77.042341`;
    // Abre Google Maps en una nueva ventana
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <a href="#" onClick={openGoogleMaps} target="_blank">
                Abrir Google Maps
              </a>
            </div>
            <h5>Coloque latitud y Longuitud</h5>
            <input type="text" name="coordenadas" value={formData.coordenadas} onChange={handleInputChange} style={{ width: "420px" }} />
          </div>
          <div>
            <h5>Radio en metros</h5>
            <input type="number" name="radio" value={formData.radio} onChange={handleInputChange} style={{ width: "420px" }} />
          </div>
          <div className="input-row">
            <div className="input-column">
              <h5>
                <BsSpeedometer2 /> Velocidad
              </h5>
              <select
                name="velocidad"
                value={formData.velocidad}
                onChange={handleSeleccionarAudio}
                style={{ width: "200px", height: "40px", margin: "10px" }}
              >
                <option value="">Seleccione una velocidad</option>
                {velocidades.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-column">
              <AiFillSound style={{ marginRight: "10px" }} />
              {velocidadesS.nombre && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ReactAudioPlayer src={velocidadesS.sonidoVelocidad} controls style={{ width: "200px", marginTop: "15px" }} />
                </div>
              )}
            </div>
          </div>

          {/* Agregar los radio buttons */}
          <div className="input-row">
            <div className="input-column">
              <h5>Tipo de Geocerca</h5>
              <label className="rbstyle">
                <input type="radio" name="geocercaTipo" value="Todas" checked={geocercaTipo === "Todas"} onChange={() => setGeocercaTipo("Todas")} />
                Todas
              </label>
              <label className="rbstyle">
                <input
                  type="radio"
                  name="geocercaTipo"
                  value="Reglamentarias"
                  checked={geocercaTipo === "Reglamentarias"}
                  onChange={() => setGeocercaTipo("Reglamentarias")}
                />
                Reglamentarias
              </label>
              <label className="rbstyle">
                <input
                  type="radio"
                  name="geocercaTipo"
                  value="Preventivas"
                  checked={geocercaTipo === "Preventivas"}
                  onChange={() => setGeocercaTipo("Preventivas")}
                />
                Preventivas
              </label>
              <label className="rbstyle">
                <input
                  type="radio"
                  name="geocercaTipo"
                  value="Informativas"
                  checked={geocercaTipo === "Informativas"}
                  onChange={() => setGeocercaTipo("Informativas")}
                />
                Informativas
              </label>
            </div>
          </div>

          <div className="input-row">
            {/*
            <div className="input-column">
              <h5>
                <BsFillSignpost2Fill /> Sonido Geocerca
              </h5>
              <input
                type="text"
                name="sonidoGeocerca"
                value={formData.sonidoGeocerca}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
              */}

            <div className="input-column">
              <h5>
                <BsSpeedometer2 /> Geocerca
              </h5>
              <select
                name="geocerca"
                value={formData.imagenGeocerca}
                onChange={handleSeleccionarGeocerca}
                style={{ width: "200px", height: "40px", margin: "10px" }}
              >
                <option value="">Seleccione una geocerca</option>
                {geocercas &&
                  geocercas.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombre} {v.detalle && v.detalle}
                    </option>
                  ))}
              </select>
            </div>

            <div className="input-column">
              {geocercaD.nombre && (
                <>
                  <AiFillSound />
                  <div>
                    <ReactAudioPlayer src={geocercaD.urlSonido} controls style={{ width: "200px", marginTop: "15px" }} />
                  </div>
                </>
              )}
            </div>
          </div>

          {geocercaD.nombre && (
            <>
              <AiFillSound />
              <div className="input-column">
                <img src={geocercaD.urlImagen} alt="Logo Inicio" style={{ width: "30%", height: "30%", marginLeft: "35%" }} className="imgl" />
              </div>
            </>
          )}

          <button variant="primary" onClick={handleSave}>
            Guardar
          </button>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

CoordenadasModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  cerrar: PropTypes.func.isRequired,
};

export default CoordenadasModal;
