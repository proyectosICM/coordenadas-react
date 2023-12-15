import React from "react";
import NavBar from "../../../Common/NavBar";
import { RutasAdminTabla } from './RutasAdminTabla';

export function RutasAdmin() {
  return (
    <div>
      <NavBar />
      <div className="camionesMenu-contenedor">
        <RutasAdminTabla />
      </div>
    </div>
  );
} 
