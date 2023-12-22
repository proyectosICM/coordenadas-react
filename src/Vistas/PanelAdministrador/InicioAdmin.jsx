import React, { useEffect } from "react";
import NavBar from "../../Common/NavBar";
import { Button, Card } from "react-bootstrap";
import { VerificarDisp } from './../../API/apiurls';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function InicioAdmin() {

  const navigation = useNavigate();
 
  useEffect(() => {
    showWarning();
  }, []);

  const showWarning = () => {
    Swal.fire({
      title: '¡Advertencia!',
      text: 'Las modificaciones en este panel son sensibles y pueden afectar el sistema. continue solo si esta seguro',
      icon: 'warning',
      confirmButtonText: 'Entendido',
      background: "black",
      color: "white"
    });
  };

      
  return (
    <div>
      <NavBar />
      <h1>Panel Administrador</h1>
      <div className="camionesMenu-contenedor">
        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px", background: "#878787" }}> 
          <Card.Body>
            <Card.Title>Agregar Dispositivos</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Agregue o edite los dispositivos que genero</Card.Subtitle>
          </Card.Body>
          <Card.Footer>
            <Button style={{width: "90%"}} onClick={() => navigation('/dispositivo-asoc')}>IR</Button>
          </Card.Footer>
        </Card>

        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px", background: "#878787" }}> 
          <Card.Body>
            <Card.Title>Agregar Empresas</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Configure el acceso para nuevas empresas</Card.Subtitle>
          </Card.Body>
          <Card.Footer>
            <Button style={{width: "90%"}} onClick={() => navigation('/empresas-admin')}>IR</Button>
          </Card.Footer>
        </Card>

        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px", background: "#878787" }}> 
          <Card.Body>
            <Card.Title>Rehabilitar rutas  </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Revise las rutas eliminadas por las empresas y rehabilitelas si es necesario</Card.Subtitle>
          </Card.Body>
          <Card.Footer>
            <Button style={{width: "90%"}} onClick={() => navigation('/rutas-admin')}>IR</Button>
          </Card.Footer>
        </Card>

        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px", background: "#878787" }}> 
          <Card.Body>
            <Card.Title>Cambiar servidor de Imagenes y audios </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Cambie el de origen de los datos</Card.Subtitle>
          </Card.Body>
          <Card.Footer>
            <Button style={{width: "90%"}}>IR</Button>
          </Card.Footer>
        </Card>

        <Card style={{ width: "18rem", marginBottom: "20px", margin: "20px", padding: "10px", background: "#878787" }}> 
          <Card.Body>
            <Card.Title>Editar imagenes o audios </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Cambie o edite las imagenes o audios de las geocercas</Card.Subtitle>
          </Card.Body>
          <Card.Footer>
            <Button style={{width: "90%"}}>IR</Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
