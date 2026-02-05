import React, { useEffect } from "react";
import NavBar from "../../Common/NavBar";
import { Button, Card, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// react-icons (Remix Icon)
import {
  RiDeviceLine,
  RiBuilding2Line,
  RiRoadMapLine,
  RiServerLine,
  RiImageEditLine,
  RiArrowRightLine,
} from "react-icons/ri";

import "./admin.css"; // <-- crea este CSS (abajo te lo paso)

export function InicioAdmin() {
  const navigation = useNavigate();

  useEffect(() => {
    const empresaId = Number(localStorage.getItem("empresaid"));
    if (empresaId !== 1) {
      navigation("/", { replace: true });
      return;
    }

    Swal.fire({
      title: "¡Advertencia!",
      text: "Las modificaciones en este panel son sensibles y pueden afectar el sistema. Continúe solo si está seguro.",
      icon: "warning",
      confirmButtonText: "Entendido",
    });
  }, [navigation]);

  const items = [
    {
      title: "Agregar Dispositivos",
      subtitle: "Agregue o edite los dispositivos que generó.",
      icon: <RiDeviceLine size={26} />,
      to: "/dispositivo-asoc",
      badgeClass: "badge-blue",
      enabled: true,
    },
    {
      title: "Agregar Empresas",
      subtitle: "Configure el acceso para nuevas empresas.",
      icon: <RiBuilding2Line size={26} />,
      to: "/empresas-admin",
      badgeClass: "badge-green",
      enabled: true,
    },
    {
      title: "Modificar Geocercas",
      subtitle: "Agregue o edite los dispositivos que generó.",
      icon: <RiDeviceLine size={26} />,
      to: "/geo-admin",
      badgeClass: "badge-blue",
      enabled: true,
    },

  ];

  /* No eliminar estos comentzrios nunca, podrian ser utiles: */
  /*
      {
      title: "Rehabilitar rutas",
      subtitle: "Revise rutas eliminadas y rehabilítelas si es necesario.",
      icon: <RiRoadMapLine size={26} />,
      to: "/rutas-admin",
      badgeClass: "badge-orange",
      enabled: true,
    },
    {
      title: "Servidor de imágenes y audios",
      subtitle: "Cambie el origen de los datos.",
      icon: <RiServerLine size={26} />,
      to: "/servidor-media",
      badgeClass: "badge-purple",
      enabled: false,
    },
    {
      title: "Editar imágenes o audios",
      subtitle: "Edite los recursos multimedia de las geocercas.",
      icon: <RiImageEditLine size={26} />,
      to: "/editar-media",
      badgeClass: "badge-pink",
      enabled: false,
    },
  */

  return (
    <div className="admin-page">
      <NavBar />

      <div className="admin-header">
        <h1 className="admin-title">Panel Administrador</h1>
        <p className="admin-subtitle">
          Accesos rápidos a configuraciones sensibles del sistema.
        </p>
      </div>

      <div className="admin-container">
        <Row className="g-4">
          {items.map((it) => (
            <Col key={it.title} xs={12} sm={6} lg={4} xl={3}>
              <Card className={`admin-card h-100 ${!it.enabled ? "is-disabled" : ""}`}>
                <Card.Body className="admin-card-body">
                  <div className="d-flex align-items-start gap-3">
                    <div className={`icon-badge ${it.badgeClass}`}>
                      {it.icon}
                    </div>

                    <div className="flex-grow-1">
                      <Card.Title className="admin-card-title">
                        {it.title}
                      </Card.Title>

                      <Card.Subtitle className="admin-card-subtitle">
                        {it.subtitle}
                      </Card.Subtitle>

                      {!it.enabled && (
                        <div className="soon-pill">Próximamente</div>
                      )}
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="admin-card-footer">
                  <Button
                    className="w-100 admin-btn"
                    variant={it.enabled ? "primary" : "secondary"}
                    disabled={!it.enabled}
                    onClick={() => it.enabled && navigation(it.to)}
                  >
                    Ir <RiArrowRightLine style={{ marginLeft: 8 }} />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
