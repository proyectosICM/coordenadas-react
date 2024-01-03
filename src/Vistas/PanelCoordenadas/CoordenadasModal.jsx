import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { useListarElementos } from "../../Hooks/CRUDHooks";
import { GeocercaURL, GeocercaxPaisURL, GeocercaxPaisxTipoURL, sonidosVelocidadURL } from "../../API/apiurls";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import { SiGooglemaps } from "react-icons/si";
import { BsSpeedometer2 } from "react-icons/bs";
import { AiFillSound } from "react-icons/ai";
import { BsFillSignpost2Fill } from "react-icons/bs";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ModalBody } from "react-bootstrap";
import Select from "react-select";

function CoordenadasModal({ mostrar, cerrar, guardar, editar, datosaeditar, limp, title }) {
  // Variables de estado para los campos de entrada y las coordenadas del marcador


  const [selectedGeocerca, setSelectedGeocerca] = useState(null);
  const [geocercaOptions, setGeocercaOptions] = useState([]);

  const initialValues = {
    id: datosaeditar ? datosaeditar.id : "",
    coordenadas: datosaeditar ? datosaeditar.coordenadas : "",
    radio: datosaeditar ? datosaeditar.radio : "",
    velocidad: datosaeditar ? datosaeditar.velocidad : "",
    velocidadValor: datosaeditar ? datosaeditar.velocidadValor : "",
    sonidoVelocidad: datosaeditar ? datosaeditar.sonidoVelocidad : "",
    sonidoGeocerca: datosaeditar ? datosaeditar.sonidoGeocerca : "",
    imagenGeocerca: datosaeditar ? datosaeditar.imagenGeocerca : "",
    codsonidoG: datosaeditar ? datosaeditar.codsonidoG : "",
    codvel: datosaeditar ? datosaeditar.codvel : "",
  };

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
          const options = response.data.map((geocerca) => ({
            label: `${geocerca.nombre} - ${geocerca.detalle}`, // Combina nombre y detalle
            value: geocerca.id, // Debes proporcionar un valor único, por ejemplo, el ID
          }));
          setGeocercaOptions(options);
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
          const options = response.data.map((geocerca) => ({
            label: `${geocerca.nombre} - ${geocerca.detalle}`,
            value: geocerca.id,
          }));
          setGeocercaOptions(options);
        } catch (error) {
          console.error("Error al cargar datos:", error, `${GeocercaxPaisURL}${pais}`);
        }
      } else {
        const response = await axios.get(`${GeocercaURL}`);
        const options = response.data.map((geocerca) => ({
          label: `${geocerca.nombre} - ${geocerca.detalle}`,
          value: geocerca.id,
        }));
        setGeocercaOptions(options);
      }
    };

    fetchData();
  }, [pais, geocercaTipo]);

  const handleClose = () => {
    cerrar();
  };

  const handleSave = (values) => {
    console.log(values);
    if (datosaeditar) {
      editar(values);
    } else {
      guardar(values);
    }
    resetForm();
    setSelectedGeocerca(null);
    setAudioSrc(null);
    setAudioGSrc(null);
    setImagenGSrc(null);
  
    resetForm(); // Esto restablecerá el formulario a los valores iniciales
    cerrar();
  };

  const openGoogleMaps = () => {
    // Aquí puedes construir la URL de Google Maps con las coordenadas ingresadas
    const googleMapsUrl = `https://www.google.com/maps?q=-12.046861, -77.042341`;
    // Abre Google Maps en una nueva ventana
    window.open(googleMapsUrl, "_blank");
  };

  const [audioSrc, setAudioSrc] = useState();

  const audioDeVelocidad = async (e) => {
    const { value, options } = e.target;
    try {
      const response = await axios.get(`${sonidosVelocidadURL}/${value}`);
      setAudioSrc(response.data.sonidoVelocidad);
      return response.data.sonidoVelocidad;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return null;
    }
  };

  const [audioGSrc, setAudioGSrc] = useState();
  const [imagenGsrc, setImagenGSrc] = useState();

  const audioGeocerca = async (e) => {
    console.log(e);

    try {
      const response = await axios.get(`${GeocercaURL}/${e.value}`);
      setAudioGSrc(response.data.urlSonido);
      setImagenGSrc(response.data.urlImagen);

      console.log(response.data.id)
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return null;
    }
  };

  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            await handleSave(values, resetForm);
          }}
          enableReinitialize={true}
        >
          {(formikProps) => (
            <Form>
              <ModalBody>
                <div className="input-column" style={{ width: "100%" }}>
                  <div>
                    <a href="#" onClick={openGoogleMaps} target="_blank">
                      Abrir Google Maps
                    </a>
                  </div>
                  <h5>Coloque latitud y Longuitud</h5>
                  <Field type="text" name="coordenadas" className="inp2-form" />
                  <ErrorMessage name="coordenadas" component="div" className="error" />
                </div>

                <div className="input-column" style={{ width: "100%" }}>
                  <h5>Radio en metros</h5>
                  <Field type="text" name="radio" className="inp2-form" />
                  <ErrorMessage name="radio" component="div" className="error" />
                </div>

                <div className="input-row">
                  <div className="input-column">
                    <h5>
                      <BsSpeedometer2 /> Velocidad
                    </h5>
                    <Field
                      as="select"
                      name="velocidad"
                      className="select-form"
                      onChange={(e) => {
                        formikProps.handleChange(e);
                        audioDeVelocidad(e);
                      }}
                    >
                      <option value="">Seleccione una velocidad</option>
                      {velocidades.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.nombre}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="input-column">
                    <AiFillSound style={{ marginRight: "10px" }} />
                    {formikProps.values.velocidad && typeof audioSrc === "string" && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ReactAudioPlayer src={audioSrc} controls style={{ width: "200px", marginTop: "15px" }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-column">
                    <h5>Tipo de Geocerca</h5>
                    <label className="rbstyle">
                      <input
                        type="radio"
                        name="geocercaTipo"
                        value="Todas"
                        checked={geocercaTipo === "Todas"}
                        onChange={() => setGeocercaTipo("Todas")}
                      />
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
                  <div className="input-column">
                    <h5>
                      <BsSpeedometer2 /> Geocerca
                    </h5>
                    <Select
                      options={geocercaOptions} // Opciones de geocercas
                      value={selectedGeocerca} // Valor seleccionado
                      name="geocerca"
                      onChange={(selectedOption) => {
                        setSelectedGeocerca(selectedOption);
                        audioGeocerca(selectedOption);
                        //console.log(selectedOption.value)
                        //formikProps.handleChange(selectedOption.value);
                        formikProps.setFieldValue('geocerca', selectedOption.value);
                        // Puedes manejar la selección aquí si lo necesitas
                      }}
                      placeholder="Seleccione una geocerca"
                      isSearchable // Habilita la barra de búsqueda
                    />
                  </div>
                  <div className="input-column">
                    <div className="input-column">
                      <AiFillSound />
                      {selectedGeocerca && typeof audioGSrc === "string" && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <ReactAudioPlayer src={audioGSrc} controls style={{ width: "200px", marginTop: "15px" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="input-column">
                  <div className="input-column">
                    <AiFillSound />
                    {selectedGeocerca && typeof audioGSrc === "string" && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={imagenGsrc} alt="Logo Inicio" style={{ width: "30%", height: "30%", marginLeft: "35%" }} className="imgl" />
                      </div>
                    )}
                  </div>
                </div>

                <ErrorMessage name="geocerca" component="div" className="error" />
              </ModalBody>
              <Modal.Footer>
                {" "}
                <button variant="primary" type="submit">
                  Guardar
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

CoordenadasModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  cerrar: PropTypes.func.isRequired,
};

export default CoordenadasModal;
