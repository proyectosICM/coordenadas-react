// requestDataSonidosGeocerca.js
// ⚠️ Con multipart ya no enviamos el Model completo.
// Este mapper ahora devuelve el DTO SonidosGeocercaUpsertRequest (JSON "data").
export const requestDataSonidosGeocerca = (dataForm) => {
  return {
    nombre: (dataForm.nombre ?? "").trim(),
    tipoSId: dataForm.tipoS ? Number(dataForm.tipoS) : null,
    paisId: dataForm.pais ? Number(dataForm.pais) : null,
    codsonido:
      dataForm.codsonido === "" || dataForm.codsonido === null || dataForm.codsonido === undefined
        ? null
        : Number(dataForm.codsonido),
    detalle: dataForm.detalle ?? "",
    // ✅ Backend genera URLs determinísticas, NO enviar manualmente
    urlImagen: null,
    urlSonido: null,
  };
};
