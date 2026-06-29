import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register';

// Registro automático del Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nueva actualización disponible. ¿Actualizar?')) {
      updateSW();
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)