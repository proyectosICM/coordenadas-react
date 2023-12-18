export const SelectField = (e, formData, setFormData, setIsGuardarHabilitado) => {
    const { value, options } = e.target;
    // Retrieve the selected option from the dropdown
    const selectedOption = options[options.selectedIndex];
    setFormData({
      ...formData,
      paisId: value,
      paisNombre: selectedOption.text,
    });
    // Check if both route name and country ID have data to enable the save button
    // setIsGuardarHabilitado(formData.nomruta.trim() !== "" && value !== "");
}