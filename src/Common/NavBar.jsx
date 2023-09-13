import { Button, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigation = useNavigate();
    const handleEliminar = () => {
        localStorage.removeItem("empresa");
        navigation('/')
    }
  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <Navbar.Brand style={{marginLeft: "25px"}} href="/rutas">Ruta Segura</Navbar.Brand>
      <Nav>
        <Nav.Link onClick={() => navigation("/rutas")} >Rutas</Nav.Link>
        <Nav.Link onClick={() => navigation("/galeria")}>Galería de Cercas</Nav.Link>
      </Nav>
      <Button onClick={() => handleEliminar() } style={{marginRight: "25px"}} variant="outline-light">Cerrar Sesión</Button>
    </Navbar>
  );
};

export default NavBar;
