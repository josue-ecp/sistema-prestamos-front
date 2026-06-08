import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, AlertTriangle } from 'lucide-react';

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
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      const resUsuarios = await fetch('http://127.0.0.1:8000/api/usuarios-web', { headers });
      const dataUsuarios = await resUsuarios.json();
      if (resUsuarios.ok && dataUsuarios.status) {
        setUsuarios(dataUsuarios.data);
      }

      const resRoles = await fetch('http://127.0.0.1:8000/api/roles', { headers });
      const dataRoles = await resRoles.json();
      if (resRoles.ok && dataRoles.status) {
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

    const token = localStorage.getItem('token');
    
    const url = isEditing 
      ? `http://127.0.0.1:8000/api/usuarios-web/${currentId}` 
      : 'http://127.0.0.1:8000/api/usuarios-web';
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.status) {
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

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios-web/${modalBorrar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok && result.status) {
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
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h1>

      {message.text && (
        <div className={`mb-6 px-5 py-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-gray-200/70 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar usuario..."
          />
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm text-gray-800 border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold border-r border-white/50 text-left">Nombre</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50 text-left">E-mail</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50 text-left">Ult. Ingreso</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50 text-center">Activo</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50 text-left">Rol</th>
                <th className="py-3 px-6 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {loading ? (
                 <tr><td colSpan="6" className="py-8 text-center text-gray-500">Cargando...</td></tr>
              ) : filteredUsuarios.length === 0 ? (
                 <tr><td colSpan="6" className="py-8 text-center text-gray-500">No hay usuarios registrados</td></tr>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id_usuario_web} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6">{usuario.nombre}</td>
                    <td className="py-3 px-6">
                      <a href={`mailto:${usuario.correo}`} className="underline text-gray-800 hover:text-blue-600">
                        {usuario.correo}
                      </a>
                    </td>
                    <td className="py-3 px-6">Activo Ahora</td>
                    <td className="py-3 px-6 flex justify-center">
                      {usuario.estado === 'activo' && (
                        <div className="bg-green-500 rounded-full p-1 text-white">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-6">{getNombreRol(usuario.id_rol)}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => prepararEdicion(usuario)}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded shadow-sm transition-colors" 
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => abrirModalEliminar(usuario.id_usuario_web, usuario.nombre)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded shadow-sm transition-colors" 
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
            <div className="bg-[#f44336] p-6 text-center flex flex-col items-center rounded-t-[2rem]">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <AlertTriangle className="text-white w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">¡ADVERTENCIA!</h3>
            </div>
            <div className="p-8 text-center space-y-5">
              <p className="text-gray-600 text-lg leading-relaxed">
                ¿Estás seguro de que deseas eliminar el usuario
              </p>
              <p className="font-bold text-[#1a2b4b] text-xl">
                "{modalBorrar.nombre}"?
              </p>
              <p className="text-sm text-[#f44336] font-semibold">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={cancelarEliminar}
                  className="px-6 py-3 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#334155] font-bold rounded-xl transition-colors uppercase tracking-wide"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminar}
                  className="px-6 py-3 bg-[#f44336] hover:bg-[#d32f2f] text-white font-bold rounded-xl shadow-md transition-colors uppercase tracking-wide"
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
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-700 transition-colors"><X className="h-6 w-6" /></button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Correo Electrónico</label>
                <input 
                  required
                  type="email" 
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Contraseña {isEditing && <span className="text-xs text-gray-500 font-normal">(Dejar en blanco para no cambiar)</span>}
                </label>
                <input 
                  required={!isEditing} // Solo es obligatoria si es nuevo
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Rol de la Empresa</label>
                <select 
                  required
                  value={formData.id_rol}
                  onChange={(e) => setFormData({...formData, id_rol: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-blue-500"
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

              <div className="flex justify-between gap-4 pt-4 mt-2">
                <button type="button" onClick={cerrarModal} className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 shadow-md">
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