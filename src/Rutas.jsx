import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useListarElementos } from './Hooks/CRUDHooks';
import { rutasURL, rutasxEmpresaURL } from './API/apiurls';
import './Styles/Rutas.css'
import { useNavigate } from 'react-router-dom';
export function Rutas() {
    const [datos, setDatos] = useState([]);
    const navigation = useNavigate();
    useListarElementos(`${rutasxEmpresaURL}`, datos, setDatos);
    const empresaid = localStorage.getItem('empresa')
    return (
        <div>
            <h1>Rutas de la empresa {empresaid}</h1>
            <div className="card-container">
                {datos.map((ruta) => (
                    <Card key={ruta.id} style={{ width: '18rem', marginBottom: '20px' }}>
                        <Card.Body>
                            <Card.Title>ID: {ruta.id}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nombre de Ruta: {ruta.nomruta}</Card.Subtitle>
                            <Card.Text>Empresa: {ruta.empresasModel.nombre}</Card.Text>
                            <Card.Text>País: {ruta.paisesModel.nombre}</Card.Text>
                        </Card.Body>
                        <Button onClick={() => navigation(`/coordenadas/${ruta.id}`)}>Ver Coordenadas</Button>
                        <Button>Descargar txt</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
