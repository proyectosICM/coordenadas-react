import { useState } from "react";
import Swal from "sweetalert2";

const useErrorHandler = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleErrorResponse = (error) => {
    if (error.response) {
      // Handle errors based on response
      setErrorMessage(`Server responded with an error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      // Handle errors when no response is received
      setErrorMessage("No response received");
    } else {
      // Handle other errors
      setErrorMessage(`Request setup error: ${error.message}`);
    }

    // Display an error message to the user using Swal (or any other preferred method)
    Swal.fire("Error", errorMessage, "error");
  };

  return { errorMessage, handleErrorResponse };
};

export default useErrorHandler;
