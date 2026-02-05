export const dispositivoAsocRequestData = (datos, empresaIdLogin, empresaNombreLogin) => {
  const empresaId =
    Number(datos?.empresasModel?.id ?? datos?.rutasModel?.empresasModel?.id ?? empresaIdLogin);

  const empresaNombre =
    datos?.empresasModel?.nombre ??
    datos?.rutasModel?.empresasModel?.nombre ??
    empresaNombreLogin ??
    "";
  const rutaId = datos?.ruta ?? datos?.rutasModel?.id ?? null;

  return {
    nombre: empresaNombre,
    velocidad: datos?.velocidad ?? 67,
    volumen: datos?.volumen ?? 27,
    estado: datos?.estado ?? true,
    rutasModel: rutaId ? { id: Number(rutaId) } : null,
    empresasModel: { id: empresaId },
  };
};
