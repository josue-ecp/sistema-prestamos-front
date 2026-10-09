import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api' 
  : 'https://credurix-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // <--- Permite cookies y evita bloqueos de Sanctum
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor: Se ejecuta antes de cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;