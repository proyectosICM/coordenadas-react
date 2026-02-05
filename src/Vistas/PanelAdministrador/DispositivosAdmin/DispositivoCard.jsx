import React from "react";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "react-bootstrap";

export function DispositivoCard({ dispositivo, datosAEditar, eliminar }) {
  // ✅ empresa asociada (por si viene directo o viene dentro de la ruta)
  const empresaNombre =
    dispositivo?.empresasModel?.nombre ??
    dispositivo?.rutasModel?.empresasModel?.nombre ??
    "Sin empresa";

  return (
    <Card className="cardRuta">
      <CardTitle>Codigo dispositivo: {dispositivo.id}</CardTitle>

      <CardTitle>Empresa asociada</CardTitle>
      <CardSubtitle>{empresaNombre}</CardSubtitle>

      <CardTitle>Ruta asociada</CardTitle>
      <CardSubtitle>
        {dispositivo.rutasModel ? dispositivo.rutasModel.nomruta : "Sin ruta asociada"}
      </CardSubtitle>

      <CardBody>
        <Button onClick={() => datosAEditar(dispositivo)} style={{ width: "90%", margin: "2px" }}>
          Editar dispositivo
        </Button>
        <Button style={{ width: "90%", margin: "2px" }} onClick={() => eliminar(dispositivo.id)}>
          Eliminar Dispositivo
        </Button>
      </CardBody>
    </Card>
  );
}
