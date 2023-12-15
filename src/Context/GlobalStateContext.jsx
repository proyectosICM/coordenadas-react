import React, { createContext, useContext, useEffect, useState } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Verificar si hay datos de usuario en el almacenamiento local
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : {
      empresaId: '',
      empresaNombre: '',
      empresaUsuario: '',
    };
  });

  // Guardar userData en el almacenamiento local cada vez que cambie
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  return ( 
    <GlobalStateContext.Provider value={{ userData, setUserData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
