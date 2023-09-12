import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { Map, Marker } from "google-maps-react";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { GeocercaURL, sonidosVelocidadURL } from "../API/apiurls";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import { SiGooglemaps } from "react-icons/si";
import { BsSpeedometer2 } from "react-icons/bs";
import { AiFillSound } from "react-icons/ai";
import { BsFillSignpost2Fill } from "react-icons/bs";

function CoordenadasModal({
  mostrar,
  cerrar,
  guardar,
  editar,
  datosaeditar,
  title,
}) {
  // Variables de estado para los campos de entrada y las coordenadas del marcador
  const [formData, setFormData] = useState({
    latitud: "",
    longitud: "",
    radio: "",
    velocidad: "10",
    velocidadValor: "",
    sonidoVelocidad: "",
    sonidoGeocerca: "",
    imagenGeocerca: "",
  });

  const [velocidades, setVelocidades] = useState([]);
  useListarElementos(`${sonidosVelocidadURL}`, velocidades, setVelocidades);

  const [geocercas, setGeocercas] = useState([]);
  useListarElementos(`${GeocercaURL}`, geocercas, setGeocercas);

  const [idvelocidad, setIdvelocidad] = useState([]);
  const [velocidadesS, setVelocidadesS] = useState([]);
  const [geocercaD, setGeocercaD] = useState([]);
  const [audio, setAudio] = useState([]);

  useEffect(() => {
    if (datosaeditar) {
      setFormData({
        id: datosaeditar.id,
        latitud: datosaeditar.latitud,
        longitud: datosaeditar.longitud,
        radio: datosaeditar.radio,
        velocidad: datosaeditar.sonidosVelocidadModel.id,
        velocidadValor: datosaeditar.sonidosVelocidadModel.id,
        sonidoVelocidad: datosaeditar.sonidosVelocidadModel.nombre / 10,
        sonidoGeocerca: datosaeditar.sonidoGeocerca,
      });
      const ListarDatos = async () => {
        try {
          const response = await axios.get(
            `${sonidosVelocidadURL}/${datosaeditar.sonidosVelocidadModel.id}`
          );
          console.log(response.data);
          setVelocidadesS(response.data);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      };
      ListarDatos();
    }
  }, [datosaeditar]);

  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  const handleClose = () => {
    limpiar();
    cerrar();
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
      latitud: "",
      longitud: "",
      radio: "",
      velocidad: "10",
      velocidadValor: "",
      sonidoVelocidad: "",
      sonidoGeocerca: "",
    });
    setVelocidadesS("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleseleccionarAudio = async (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];
    setFormData({
      ...formData,
      sonidoVelocidad: selectedOption.text / 10,
      velocidad: value,
      velocidadValor: selectedOption.text,
    });
    setIdvelocidad(value);

    try {
      const response = await axios.get(`${sonidosVelocidadURL}/${value}`);
      setVelocidadesS(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleseleccionarGeocerca = async (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];
    setFormData({
      ...formData,
      sonidoGeocerca: selectedOption.text,
      imagenGeocerca: selectedOption.value,
    });

    try {
      const response = await axios.get(`${GeocercaURL}/${value}`);
      setGeocercaD(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  // Controlador de eventos para hacer clic en el mapa
  const handleMapClick = (mapProps, map, clickEvent) => {
    const clickedLat = clickEvent.latLng.lat();
    const clickedLng = clickEvent.latLng.lng();

    // Actualiza las coordenadas en las variables de estado
    setFormData({
      ...formData,
      latitud: clickedLat,
      longitud: clickedLng,
    });

    // Actualiza la posición del marcador en el mapa
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
  };

  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-row">
            <div className="input-column">
              <h5>
                {" "}
                <SiGooglemaps /> Latitud
              </h5>
              <input
                type="text"
                name="latitud"
                value={formData.latitud}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
            <div className="input-column">
              <h5>
                <SiGooglemaps /> Longitud
              </h5>
              <input
                type="text"
                name="longitud"
                value={formData.longitud}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
          </div>
          <div>
            <h5>Radio</h5>
            <input
              type="text"
              name="radio"
              value={formData.radio}
              onChange={handleInputChange}
              style={{ width: "420px" }}
            />
          </div>
          <div className="input-row">
            <div className="input-column">
              <h5>
                <BsSpeedometer2 /> Velocidad
              </h5>
              <select
                name="velocidad"
                value={formData.velocidad}
                onChange={handleseleccionarAudio}
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
              <h5>
                <AiFillSound /> Sonido Velocidad
              </h5>
              <input
                type="text"
                name="sonidoVelocidad"
                value={formData.sonidoVelocidad}
                onChange={handleseleccionarAudio}
                style={{ width: "150px" }}
              />
            </div>
          </div>
          {velocidadesS.nombre && (
            <>
              <AiFillSound />
              <div>
                <ReactAudioPlayer src={velocidadesS.sonidoVelocidad} controls />
              </div>
            </>
          )}
          <div className="input-row">
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

            <div className="input-column">
              <h5>
                <BsSpeedometer2 /> Geocerca
              </h5>
              <select
                name="geocerca"
                value={formData.imagenGeocerca}
                onChange={handleseleccionarGeocerca}
                style={{ width: "200px", height: "40px", margin: "10px" }}
              >
                <option value="">Seleccione una velocidad</option>
                {geocercas.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {geocercaD.nombre && (
            <>
              <AiFillSound />
              <div>
                <img
                  src={geocercaD.urlImagen}
                  alt="Logo Inicio"
                  style={{ width: "30%", height: "30%" }}
                  className="imgl"
                />
              </div>

              <AiFillSound />
              <div>
                <ReactAudioPlayer src={geocercaD.urlSonido} controls />
              </div>
            </>
          )}
          <button variant="primary" onClick={handleSave}>
            Guardar
          </button>

          <div style={{ height: "220px", margin: "10px" }}>
            <h5>Mapa</h5>

            <Map
              google={window.google}
              zoom={13}
              style={{ height: "220px", width: "90%" }}
              initialCenter={{
                lat: parseFloat(formData.latitud) || 37.7749,
                lng: parseFloat(formData.longitud) || -122.4194,
              }}
              onClick={handleMapClick} // Agrega el controlador de eventos onClick
            >
              {formData.latitud && formData.longitud ? (
                <Marker
                  position={{
                    lat: parseFloat(formData.latitud),
                    lng: parseFloat(formData.longitud),
                  }}
                />
              ) : null}
            </Map>
          </div>
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
