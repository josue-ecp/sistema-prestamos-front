import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cobratarios() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [cobratarios, setCobratarios] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, nombre: '' });

  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    id_zona: '',
    telefono: ''
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Consultamos ambos endpoints en paralelo
      const [resCob, resZon] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/cobratarios', config),
        axios.get('http://127.0.0.1:8000/api/zonas', config)
      ]);
      
      setCobratarios(resCob.data);
      setZonas(resZon.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  };

  // --- CARGA INICIAL ---
  useEffect(() => {
    setTimeout(fetchData, 0);
  }, []);

  // --- MANEJO DE ENVÍO ---
  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  const resetForm = () => {
    setFormData({ nombre: '', correo: '', password: '', id_zona: '', telefono: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = isEditing
        ? `http://127.0.0.1:8000/api/cobratarios/${editingId}`
        : 'http://127.0.0.1:8000/api/cobratarios';

      if (isEditing) {
        await axios.put(url, formData, config);
        showMessage('Cobratario actualizado correctamente.');
      } else {
        await axios.post(url, formData, config);
        showMessage('Cobratario registrado exitosamente.');
      }

      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error al guardar cobratario', 'error');
    }
  };

  const handleEdit = (cobratario) => {
    console.log('Cobratarios: handleEdit click', cobratario);
    setFormData({
      nombre: cobratario.nombre || '',
      correo: cobratario.correo || '',
      password: '',
      id_zona: cobratario.id_zona || '',
      telefono: cobratario.telefono || ''
    });
    setIsEditing(true);
    setEditingId(cobratario.id_cobratario);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cobratario) => {
    console.log('Cobratarios: handleDeleteClick click', cobratario);
    setDeleteModal({ open: true, id: cobratario.id_cobratario, nombre: cobratario.nombre });
  };

  const confirmDelete = async () => {
    console.log('Cobratarios: confirmDelete click', deleteModal);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/cobratarios/${deleteModal.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteModal({ open: false, id: null, nombre: '' });
      showMessage('Cobratario eliminado correctamente.');
      fetchData();
    } catch (error) {
      setDeleteModal({ open: false, id: null, nombre: '' });
      showMessage(error.response?.data?.message || 'Error al eliminar cobratario', 'error');
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, id: null, nombre: '' });
  };

  // --- FILTRO DE BÚSQUEDA ---
  const filteredCobratarios = cobratarios.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-left">Gestión de Cobratarios</h1>

      {message.text && (
        <div className={`mb-6 rounded-3xl p-4 grid grid-cols-[auto_1fr] gap-4 items-center border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-inner">
            {message.type === 'success' ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-semibold">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar Cobratario..."
          />
        </div>

        <button 
          type="button"
          onClick={() => {
            console.log('Cobratarios: nuevo cobratario click');
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm uppercase tracking-wide active:scale-95"
        >
          <Plus size={16} />
          Nuevo Cobratario
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-4 border-r border-white/50 text-left pl-12">Nombre</th>
                <th className="py-4 px-4 border-r border-white/50 w-64">Zona Asignada</th>
                <th className="py-4 px-4 border-r border-white/50">Ult. Ingreso</th>
                <th className="py-4 px-4 border-r border-white/50">Activo</th>
                <th className="py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {loading ? (
                <tr><td colSpan="5" className="py-10 text-gray-400">Cargando datos...</td></tr>
              ) : filteredCobratarios.map((cobratario) => (
                <tr key={cobratario.id_cobratario} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-left pl-12 font-medium text-gray-900 uppercase">{cobratario.nombre}</td>
                  <td className="py-4 px-4 text-gray-700 font-bold uppercase underline decoration-gray-400 underline-offset-2">
                    {cobratario.zona?.nombre_zona || 'Sin Zona'}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {cobratario.ultimo_ingreso ? new Date(cobratario.ultimo_ingreso).toLocaleString() : 'Nunca'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      {cobratario.estado === 'activo' && (
                        <div className="bg-[#2ecc71] rounded-full p-0.5 text-white shadow-sm">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="relative flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label="Ver perfil"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/cobratarios/detalle/${cobratario.id_cobratario}`);
                        }}
                        className="z-10 bg-[#3b82f6] hover:bg-blue-700 text-white p-1.5 rounded shadow-sm transition-colors"
                        title="Ver Perfil"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Editar cobratario"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(cobratario);
                        }}
                        className="z-10 bg-[#f39c12] hover:bg-orange-500 text-white p-1.5 rounded shadow-sm transition-colors"
                        title="Editar"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Eliminar cobratario"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteClick(cobratario);
                        }}
                        className="z-10 bg-[#e74c3c] hover:bg-red-600 text-white p-1.5 rounded shadow-sm transition-colors"
                        title="Eliminar"
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

        {/* PAGINACIÓN */}
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-100 text-left">
          <p className="text-[10px] text-gray-400 font-bold uppercase text-left">
            Mostrando {filteredCobratarios.length} de {cobratarios.length} registros
          </p>
        </div>
      </div>

      {/* MODAL: NUEVO COBRATARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar Cobratario' : 'Registrar Nuevo Cobratario'}</h2>
              <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">Correo</label>
                  <input 
                    type="email" 
                    required
                    value={formData.correo}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">Contraseña</label>
                  <input 
                    type="password" 
                    required={!isEditing}
                    value={formData.password}
                    placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">Zona Asignada</label>
                <select 
                  required
                  value={formData.id_zona}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFormData({...formData, id_zona: e.target.value})}
                >
                  <option value="">Selecciona una zona...</option>
                  {zonas.map(z => (
                    <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>

              <div className="flex justify-between gap-4 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }} 
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 px-4 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 shadow-md"
                >
                  {isEditing ? 'Actualizar Cobratario' : 'Agregar Cobratario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="bg-red-600 px-8 py-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-100">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <p className="text-3xl font-bold tracking-[0.18em] uppercase">¡Advertencia!</p>
            </div>
            <div className="bg-white p-8">
              <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar el usuario</p>
              <p className="font-bold text-slate-900 text-xl mb-4">"{deleteModal.nombre}"?</p>
              <p className="text-sm font-semibold text-red-600 mb-8">Esta acción no se puede deshacer.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-300 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}