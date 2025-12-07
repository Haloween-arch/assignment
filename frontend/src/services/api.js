// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://assignment-j50b.onrender.com/api", // 🔥 deployed backend
});

export default api;
