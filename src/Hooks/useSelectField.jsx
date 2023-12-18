import { useState } from 'react';

const useSelectField = (initialValue = '') => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [selectedText, setSelectedText] = useState('');

  const handleSelectChange = (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];
    
    setSelectedValue(value);
    setSelectedText(selectedOption.text);
  };

  return {
    selectedValue,
    selectedText,
    handleSelectChange,
    setSelectedValue, // Si se requiere establecer el valor desde fuera del hook
    setSelectedText, // Si se requiere establecer el texto desde fuera del hook
  };
};

export default useSelectField;
