import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import api from '../../api';

const UsuariosWeb = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]); // <-- AHORA SÍ, ESTADO PARA ROLES
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [modalBorrar, setModalBorrar] = useState({ show: false, id: null, nombre: '' });

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    id_rol: '' 
  });

  const fetchData = async () => {
    try {
      const headers = {
        'Accept': 'application/json'
      };

      const resUsuarios = await api.get('/usuarios-web', { headers, validateStatus: () => true });
      const dataUsuarios = resUsuarios.data;
      if (resUsuarios.status >= 200 && resUsuarios.status < 300 && dataUsuarios.status) {
        setUsuarios(dataUsuarios.data);
      }

      const resRoles = await api.get('/roles', { headers, validateStatus: () => true });
      const dataRoles = resRoles.data;
      if (resRoles.status >= 200 && resRoles.status < 300 && dataRoles.status) {
        setRoles(dataRoles.data);
      }

    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. GUARDAR (CREAR O EDITAR)
  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que sí eligieron un rol
    if (!formData.id_rol) {
      showMessage('Por favor, selecciona un rol de la lista.', 'error');
      return;
    }

    const url = isEditing 
      ? `/usuarios-web/${currentId}` 
      : '/usuarios-web';
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await api.request({
        url,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: formData,
        validateStatus: () => true
      });

      const result = response.data;

      if (response.status >= 200 && response.status < 300 && result.status) {
        showMessage(result.message, 'success');
        fetchData(); // Recargamos tabla
        cerrarModal();
      } else {
        showMessage('Error: ' + (result.message || 'Verifica los datos'), 'error');
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage('Error de conexión', 'error');
    }
  };

  // 3. ELIMINAR
  const abrirModalEliminar = (id, nombre) => {
    setModalBorrar({ show: true, id, nombre });
  };

  const cancelarEliminar = () => {
    setModalBorrar({ show: false, id: null, nombre: '' });
  };

  const confirmarEliminar = async () => {
    if (!modalBorrar.id) return;

    try {
      const response = await api.delete(`/usuarios-web/${modalBorrar.id}`, {
        headers: {
          'Accept': 'application/json'
        },
        validateStatus: () => true
      });

      const result = response.data;
      if (response.status >= 200 && response.status < 300 && result.status) {
        setUsuarios(usuarios.filter(u => u.id_usuario_web !== modalBorrar.id));
        cancelarEliminar();
        showMessage(result.message, 'success');
      } else {
        showMessage('Error: ' + result.message, 'error');
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      showMessage('Error de conexión al eliminar', 'error');
    }
  };

  // 4. PREPARAR EDICIÓN
  const prepararEdicion = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '', // En blanco por seguridad
      id_rol: usuario.id_rol
    });
    setCurrentId(usuario.id_usuario_web);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ nombre: '', correo: '', password: '', id_rol: '' });
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getNombreRol(usuario.id_rol).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper dinámico para mostrar el texto del rol en la tabla
  const getNombreRol = (id_rol) => {
    const rolEncontrado = roles.find(r => r.id_rol === id_rol);
    return rolEncontrado ? rolEncontrado.nombre_rol : 'Desconocido';
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/70 p-4 sm:p-6 lg:p-8 relative">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Administración</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestión de Usuarios</h1>
        <p className="mt-1 text-sm text-slate-500">Administra las cuentas y roles de acceso web.</p>
      </div>

      {message.text && (
        <div className={`mb-6 rounded-xl border p-4 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
          {message.text}
        </div>
      )}

      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            placeholder="Buscar usuario..."
          />
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          <Plus className="h-5 w-5" />
          Nuevo Usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm text-gray-800 border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="border-b border-slate-200 px-6 py-4 text-left">Nombre</th>
                <th className="border-b border-slate-200 px-6 py-4 text-left">E-mail</th>
                <th className="border-b border-slate-200 px-6 py-4 text-left">Ult. Ingreso</th>
                <th className="border-b border-slate-200 px-6 py-4 text-center">Activo</th>
                <th className="border-b border-slate-200 px-6 py-4 text-left">Rol</th>
                <th className="border-b border-slate-200 px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {loading ? (
                 <tr><td colSpan="6" className="py-12 text-center text-slate-400">Cargando...</td></tr>
              ) : filteredUsuarios.length === 0 ? (
                 <tr><td colSpan="6" className="py-12 text-center text-slate-400">No hay usuarios registrados</td></tr>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id_usuario_web} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                    <td className="px-6 py-4 font-semibold text-slate-800">{usuario.nombre}</td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${usuario.correo}`} className="text-slate-600 underline transition hover:text-blue-800">
                        {usuario.correo}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-500">Activo Ahora</td>
                    <td className="px-6 py-4 text-center">
                      {usuario.estado === 'activo' && (
                        <div className="inline-flex rounded-full bg-blue-100 p-1 text-blue-700">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{getNombreRol(usuario.id_rol)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => prepararEdicion(usuario)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:bg-blue-50" 
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => abrirModalEliminar(usuario.id_usuario_web, usuario.nombre)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900" 
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalBorrar.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="flex flex-col items-center bg-blue-900 p-6 text-center">
              <div className="mb-3 rounded-full bg-white/10 p-3">
                <AlertTriangle className="h-8 w-8 text-blue-100" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">¡ADVERTENCIA!</h3>
            </div>
            <div className="p-8 text-center space-y-5">
              <p className="text-gray-600 text-lg leading-relaxed">
                ¿Estás seguro de que deseas eliminar el usuario
              </p>
              <p className="text-xl font-bold text-slate-900">
                "{modalBorrar.nombre}"?
              </p>
              <p className="text-sm font-semibold text-slate-500">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={cancelarEliminar}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminar}
                  className="rounded-xl bg-blue-800 px-6 py-3 font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[500px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200 sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
              </h2>
              <button onClick={cerrarModal} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-6 w-6" /></button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Correo Electrónico</label>
                <input 
                  required
                  type="email" 
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Contraseña {isEditing && <span className="text-xs text-gray-500 font-normal">(Dejar en blanco para no cambiar)</span>}
                </label>
                <input 
                  required={!isEditing} // Solo es obligatoria si es nuevo
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Rol de la Empresa</label>
                <select 
                  required
                  value={formData.id_rol}
                  onChange={(e) => setFormData({...formData, id_rol: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">-- Selecciona un rol --</option>
                  {/* MAGIA AQUÍ: Mapeo de la BD */}
                  {roles.map(rol => (
                    <option key={rol.id_rol} value={rol.id_rol}>
                      {rol.nombre_rol}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                <button type="button" onClick={cerrarModal} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 transition hover:bg-slate-100">Cancelar</button>
                <button type="submit" className="flex-1 rounded-xl bg-blue-800 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-blue-900">
                  {isEditing ? 'Guardar Cambios' : 'Agregar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosWeb;