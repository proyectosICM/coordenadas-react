import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
// Asegúrate de importar el script de Google Maps aquí
const googleMapsScript = document.createElement('script');
googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpTqH6b1aeVn6VTSjlE5BIAwoTzkIe9wo&libraries=places`;
googleMapsScript.async = true;
window.document.body.appendChild(googleMapsScript);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


