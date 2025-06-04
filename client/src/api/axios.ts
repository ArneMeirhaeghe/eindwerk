// File: client/src/api/axios.ts
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Backend base-URL
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`; // Voegt JWT toe aan elke aanvraag
  }
  return config;
});

export default API;
