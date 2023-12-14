import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    empresaId: '',
    empresaNombre: '',
    empresaUsuario: '',
  });

  return (
    <GlobalStateContext.Provider value={{ userData, setUserData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
