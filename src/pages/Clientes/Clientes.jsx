import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Check, User, MapPin, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(response.data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      showMessage('Error al cargar la lista de clientes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar al cliente "${nombre}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('Cliente eliminado correctamente.');
      fetchClientes();
    } catch (error) {
      showMessage('Error al eliminar el cliente.', 'error');
    }
  };

  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.direccion && c.direccion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Gestión de Clientes</h1>

      {message.text && (
        <div className={`mb-6 rounded-3xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          <p className="font-semibold">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar cliente por nombre o dirección..."
          />
        </div>

        <button 
          onClick={() => navigate('/clientes/nuevo')}
          className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm uppercase tracking-wide active:scale-95"
        >
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-4 border-r border-white/50">Zona ID</th>
                <th className="py-4 px-4 border-r border-white/50 text-left pl-8">Cliente</th>
                <th className="py-4 px-4 border-r border-white/50">Teléfono</th>
                <th className="py-4 px-4 border-r border-white/50">Estado</th>
                <th className="py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {loading ? (
                <tr><td colSpan="5" className="py-10 text-gray-400">Cargando clientes...</td></tr>
              ) : filteredClientes.length === 0 ? (
                <tr><td colSpan="5" className="py-10 text-gray-400">No hay clientes registrados.</td></tr>
              ) : filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-bold text-gray-600">{cliente.id_zona}</td>
                  <td className="py-4 px-4 text-left pl-8 font-semibold uppercase">{cliente.nombre}</td>
                  <td className="py-4 px-4">{cliente.telefono || 'N/A'}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <div className="bg-[#2ecc71] rounded-full p-0.5 text-white"><Check size={12} strokeWidth={4} /></div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                        className="bg-[#f39c12] hover:bg-orange-500 text-white p-1.5 rounded transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente.id, cliente.nombre)}
                        className="bg-[#e74c3c] hover:bg-red-600 text-white p-1.5 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}