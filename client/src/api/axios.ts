// File: src/api/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",   // of gebruik import.meta.env.VITE_API_BASE_URL
  withCredentials: true,                  // indien je cookies gebruikt
});

// In de run-time vullen we hier het token in zodra AuthContext dat doorgeeft
API.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("token") ?? sessionStorage.getItem("token");
  if (jwt && config.headers) {
    config.headers["Authorization"] = `Bearer ${jwt}`;
  }
  return config;
});

export default API;
