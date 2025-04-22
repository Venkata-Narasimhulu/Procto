import api from "./api"; // Use the custom axios instance

const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request
    api.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete the token from header
    delete api.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
