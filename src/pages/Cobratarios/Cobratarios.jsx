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
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1500px]">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Administración</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestión de Cobratarios</h1>
        <p className="mt-1 text-sm text-slate-500">Administra cobratarios, zonas asignadas y actividad.</p>
      </div>

      {message.text && (
        <div className={`mb-6 grid grid-cols-[auto_1fr] items-center gap-4 rounded-xl border p-4 shadow-sm ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-inner">
            {message.type === 'success' ? (
              <CheckCircle2 className="h-6 w-6 text-blue-700" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-slate-600" />
            )}
          </div>
          <div>
            <p className="font-semibold">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR */}
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
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]"
        >
          <Plus size={16} />
          Nuevo Cobratario
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="border-b border-slate-200 py-4 pl-8 pr-5 text-left sm:pl-12">Nombre</th>
                <th className="w-48 border-b border-slate-200 px-5 py-4 sm:w-64">Zona Asignada</th>
                <th className="border-b border-slate-200 px-5 py-4">Ult. Ingreso</th>
                <th className="border-b border-slate-200 px-5 py-4">Activo</th>
                <th className="border-b border-slate-200 px-5 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm text-gray-800">
              {loading ? (
                <tr><td colSpan="5" className="py-12 text-slate-400">Cargando datos...</td></tr>
              ) : filteredCobratarios.map((cobratario) => (
                <tr key={cobratario.id_cobratario} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                  <td className="py-4 pl-8 pr-5 text-left font-semibold uppercase text-slate-800 sm:pl-12">{cobratario.nombre}</td>
                  <td className="px-5 py-4 font-semibold uppercase text-blue-800">
                    {cobratario.zona?.nombre_zona || 'Sin Zona'}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {cobratario.ultimo_ingreso ? new Date(cobratario.ultimo_ingreso).toLocaleString() : 'Nunca'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {cobratario.estado === 'activo' && (
                        <div className="rounded-full bg-blue-100 p-1 text-blue-700">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label="Ver perfil"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/cobratarios/detalle/${cobratario.id_cobratario}`);
                        }}
                        className="z-10 rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                        className="z-10 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                        className="z-10 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-left sm:px-6">
          <p className="text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Mostrando {filteredCobratarios.length} de {cobratarios.length} registros
          </p>
        </div>
      </div>

      {/* MODAL: NUEVO COBRATARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200 sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">Administración</p>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{isEditing ? 'Editar Cobratario' : 'Registrar Nuevo Cobratario'}</h2>
              </div>
              <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 text-left">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 text-left">Correo</label>
                  <input 
                    type="email" 
                    required
                    value={formData.correo}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 text-left">Contraseña</label>
                  <input 
                    type="password" 
                    required={!isEditing}
                    value={formData.password}
                    placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 text-left">Zona Asignada</label>
                <select 
                  required
                  value={formData.id_zona}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  onChange={(e) => setFormData({...formData, id_zona: e.target.value})}
                >
                  <option value="">Selecciona una zona...</option>
                  {zonas.map(z => (
                    <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 text-left">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }} 
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:flex-1"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="w-full rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:flex-1"
                >
                  {isEditing ? 'Actualizar Cobratario' : 'Agregar Cobratario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in duration-200">
            <div className="bg-blue-900 px-6 py-6 text-center text-white sm:px-8 sm:py-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-blue-100 sm:h-16 sm:w-16">
                <AlertTriangle className="h-6 sm:h-7 w-6 sm:w-7" />
              </div>
              <p className="text-2xl font-bold tracking-[0.12em] uppercase sm:text-3xl">Confirmar eliminación</p>
            </div>
            <div className="bg-white p-6 sm:p-8">
              <p className="mb-4 text-sm text-slate-600 sm:text-base">¿Estás seguro de que deseas eliminar el usuario</p>
              <p className="mb-4 break-words text-lg font-bold text-slate-900 sm:text-xl">"{deleteModal.nombre}"?</p>
              <p className="mb-6 text-xs font-semibold text-slate-500 sm:mb-8 sm:text-sm">Esta acción no se puede deshacer.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full rounded-xl bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:w-auto"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}