// FormFields.js

export const FormFields = (e, formData, setFormData, setIsGuardarHabilitado) => {
  const { name, value } = e.target;

  // Update form data
  const updatedFormData = {
    ...formData,
    [name]: value,
  };
/*
  if (name === "nomruta" || name === "paisId") {
    setIsGuardarHabilitado(formData.nomruta.trim() !== "" && formData.paisId !== "");
  }
  */
  // Update form data with the new values
  setFormData(updatedFormData);
};
