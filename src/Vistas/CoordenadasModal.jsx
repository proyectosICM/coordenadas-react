import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Styles/CoordenadasModal.css";

function CoordenadasModal({ mostrar, cerrar, guardar, datosaeditar, title }) {
  const [formData, setFormData] = useState({
    latitud: "",
    longitud: "",
    radio: "",
    velocidad: "10",
    sonidoVelocidad: "",
    sonidoGeocerca: "",
  });

  const [markerPosition, setMarkerPosition] = useState([0, 0]);

  const handleClose = () => {
    cerrar();
  };

  const handleSave = () => {
    //console.log('Datos del formulario:', formData);
    guardar(formData);
    cerrar();
    setFormData({
      latitud: "",
      longitud: "",
      radio: "",
      velocidad: "10",
      sonidoVelocidad: "",
      sonidoGeocerca: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (datosaeditar) {
      setFormData({ ...datosaeditar });
      //setEditando(true);
    } else {
      // ...
    }
  }, [datosaeditar]);

  const handleMarkerDragEnd = (e) => {
    setMarkerPosition(e.target.getLatLng());
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
              <h5>Latitud</h5>
              <input
                type="text"
                name="latitud"
                value={formData.latitud}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
            <div className="input-column">
              <h5>Longitud</h5>
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
              <h5>Velocidad</h5>
              <select
                name="velocidad"
                value={formData.velocidad}
                onChange={handleInputChange}
                style={{ width: "200px", height: "40px", margin: "10px" }}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={(i + 1) * 10}>
                    {(i + 1) * 10}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-column">
              <h5>Sonido Velocidad</h5>
              <input
                type="text"
                name="sonidoVelocidad"
                value={formData.sonidoVelocidad}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
          </div>
          <div>
            <h5>Sonido Geocerca</h5>
            <input
              type="text"
              name="sonidoGeocerca"
              value={formData.sonidoGeocerca}
              onChange={handleInputChange}
              style={{ width: "150px" }}
            />
          </div>
          <div>
            <h5>Mapa</h5>
            <MapContainer
              center={markerPosition}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              doubleClickZoom={false}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={markerPosition}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              />
            </MapContainer>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={handleClose}>
            Cerrar
          </button>
          <button variant="primary" onClick={handleSave}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

CoordenadasModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  cerrar: PropTypes.func.isRequired,
};

export default CoordenadasModal;
