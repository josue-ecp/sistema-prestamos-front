import axios from 'axios';
import { Capacitor } from '@capacitor/core';

const getBaseUrl = () => {
  const hostname = window.location.hostname;

  // Capacitor serves the app from localhost, but must use the deployed API.
  if (Capacitor.isNativePlatform()) {
    return 'https://credurix-backend-production.up.railway.app/api';
  }

  // Si estamos en desarrollo local web (localhost o 127.0.0.1)
  if (import.meta.env.DEV && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    return 'http://localhost:8000/api';
  }
  
  // Para Vercel o la aplicación compilada en Android (Railway)
  return 'https://credurix-backend-production.up.railway.app/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
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