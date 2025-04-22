
import axios from "axios";

// Create an instance of axios with your backend's base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://your-render-backend.onrender.com",
  withCredentials: true, // Optional: only if you're using cookies
});

export default api;
