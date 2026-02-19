import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta inicial: Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta del Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirección por defecto: si entran a la raíz, van al login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;