import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
const axios = require("axios"); // Importa axios para simular llamadas a la API
import { Login } from "../src/Login";


// Mock manual de axios
jest.mock('axios', () => ({
    get: jest.fn(),
  }));
  

describe("Login Component", () => {
  it("should render without errors", () => {
    const { getByText, getByLabelText } = render(<Login />);
    
    // Verifica que elementos importantes estén presentes en el formulario
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByLabelText("Usuario:")).toBeInTheDocument();
    expect(getByLabelText("Contraseña:")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Forgot Password?")).toBeInTheDocument();
  });

  it("should handle form submission correctly", async () => {
    const { getByLabelText, getByText } = render(<Login />);
    
    // Simula la respuesta exitosa de axios
    axios.post.mockResolvedValue({
      data: { id: "someId" },
      status: 200,
    });

    // Ingresa valores en los campos de usuario y contraseña
    fireEvent.change(getByLabelText("Usuario:"), { target: { value: "testuser" } });
    fireEvent.change(getByLabelText("Contraseña:"), { target: { value: "testpassword" } });

    // Simula la presentación del formulario
    fireEvent.submit(getByText("Login"));

    // Espera a que la llamada axios se resuelva
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        usuario: "testuser",
        password: "testpassword",
      });
    });

    // Verifica que la navegación se haya realizado correctamente
    expect(window.location.pathname).toBe("/rutas");
  });

  it("should handle form submission error correctly", async () => {
    const { getByLabelText, getByText } = render(<Login />);
    
    // Simula un error al enviar el formulario
    axios.post.mockRejectedValue(new Error("Login failed"));

    // Ingresa valores en los campos de usuario y contraseña
    fireEvent.change(getByLabelText("Usuario:"), { target: { value: "testuser" } });
    fireEvent.change(getByLabelText("Contraseña:"), { target: { value: "testpassword" } });

    // Simula la presentación del formulario
    fireEvent.submit(getByText("Login"));

    // Espera a que la llamada axios se resuelva
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        usuario: "testuser",
        password: "testpassword",
      });
    });

    // Verifica que se muestre un mensaje de error
    expect(getByText("Error en inicio de sesión")).toBeInTheDocument();
  });
});
