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
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1500px]">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Administración</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestión de Clientes</h1>
        <p className="mt-1 text-sm text-slate-500">Consulta y administra la información de tus clientes.</p>
      </div>

      {message.text && (
        <div className={`mb-6 rounded-xl border p-4 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
          <p className="font-semibold">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.035)] sm:flex-row sm:items-center sm:p-5">
        <div className="relative w-full sm:max-w-md sm:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            placeholder="Buscar cliente por nombre o dirección..."
          />
        </div>

        <button 
          onClick={() => navigate('/clientes/nuevo')}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]"
        >
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-center">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="border-b border-slate-200 px-5 py-4">Zona ID</th>
                <th className="border-b border-slate-200 px-5 py-4 pl-8 text-left">Cliente</th>
                <th className="border-b border-slate-200 px-5 py-4">Teléfono</th>
                <th className="border-b border-slate-200 px-5 py-4">Estado</th>
                <th className="border-b border-slate-200 px-5 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="py-12 text-slate-400">Cargando clientes...</td></tr>
              ) : filteredClientes.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-slate-400">No hay clientes registrados.</td></tr>
              ) : filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                  <td className="px-5 py-4 font-semibold text-slate-500">{cliente.id_zona}</td>
                  <td className="py-4 pl-8 pr-5 text-left font-semibold uppercase text-slate-800">{cliente.nombre}</td>
                  <td className="px-5 py-4 text-slate-600">{cliente.telefono || 'N/A'}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-blue-100 p-1 text-blue-700"><Check size={12} strokeWidth={3} /></div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                        aria-label={`Editar ${cliente.nombre}`}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente.id, cliente.nombre)}
                        aria-label={`Eliminar ${cliente.nombre}`}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
    </div>
  );
}