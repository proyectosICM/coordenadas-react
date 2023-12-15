import React from 'react'
import { Button, Card, CardBody, CardSubtitle, CardTitle } from 'react-bootstrap';

export function DispositivoCard({dispositivo, datosAEditar}){
    return(
        <Card className="cardRuta">
        <CardTitle>Codigo dispositivo</CardTitle>
        <CardTitle>{dispositivo.nombre}</CardTitle>
        <CardTitle>Ruta asociada</CardTitle>
        <CardSubtitle>{dispositivo.rutasModel ? dispositivo.rutasModel.nomruta : "Sin ruta asociada"}</CardSubtitle>
        <CardBody>
          <Button style={{width:"90%", margin: "2px"}}>Cambiar Ruta asociada</Button>
          <Button onClick={() => datosAEditar(dispositivo)} style={{width:"90%", margin: "2px"}}>Editar dispositivo</Button>
          <Button style={{width:"90%", margin: "2px"}}>Eliminar Dispositivo</Button>
        </CardBody>
      </Card>
    );
}