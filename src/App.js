  import React, { useState } from 'react';
  import './App.css';
import { Agregar } from './Agregar';
import { Route,  BrowserRouter as Router, Routes } from 'react-router-dom';
import { routes } from './routes';

  function App() {

    return (
      <div className="App">
     <Router>
        {/*token && <NavBarSelect />*/}
        <div className="App">
          <Routes>

            {routes.map((route, index) => (
              <Route
                key={index}
                exact
                path={route.path}
                element={route.component}
              />
            ))}
          </Routes>
        </div>
      </Router>
    </div>
    );
  }

  export default App;
