// utils/axios.js
import axios from "axios";

// Create the axios instance
const api = axios.create({
  // baseURL: "https://ipr01250401003b.onrender.com",
  baseURL: "http://localhost:8080",
//   withCredentials: true, // Replace with your API base URL
  // withCredentials: true, // Only needed if you're using cookies with auth
});

export default api;
