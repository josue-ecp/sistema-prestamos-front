import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Check, X } from 'lucide-react';

const UsuariosWeb = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // 1. Datos iniciales (Fijos)
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan Perez', email: 'JuanPerez@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true, rol: 'Administrador' },
    { id: 2, nombre: 'Juan Perez', email: 'JuanPerez@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true, rol: 'Supervisor' },
    { id: 3, nombre: 'Juan Perez', email: 'JuanPerez@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true, rol: 'Administrador' },
    { id: 4, nombre: 'Juan Perez', email: 'JuanPerez@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true, rol: 'Supervisor' },
  ]);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Administrador'
  });

  // Función para Guardar (Nuevo o Editado)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Lógica para editar (solo si es dinámico)
      setUsuarios(usuarios.map(u => u.id === currentId ? { ...u, ...formData } : u));
    } else {
      // Lógica para agregar nuevo
      const nuevo = {
        id: Date.now(), // ID único para los nuevos
        nombre: formData.nombre,
        email: formData.email,
        ultIngreso: 'Justo ahora',
        activo: true,
        rol: formData.rol
      };
      setUsuarios([...usuarios, nuevo]);
    }
    
    cerrarModal();
  };

  // Función para borrar (Solo dinámicos > ID 4)
  const handleEliminar = (id) => {
    if (id <= 4) {
      alert("Este usuario es fijo y no se puede eliminar.");
      return;
    }
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  // Función para preparar edición (Solo dinámicos > ID 4)
  const prepararEdicion = (usuario) => {
    if (usuario.id <= 4) {
      alert("Este usuario es fijo y no se puede editar.");
      return;
    }
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol
    });
    setCurrentId(usuario.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ nombre: '', email: '', password: '', rol: 'Administrador' });
  };

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
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
                <th className="py-3 px-6 font-semibold border-r border-white/50">Nombre</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50">E-mail</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50">Ult. Ingreso</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50">Activo</th>
                <th className="py-3 px-6 font-semibold border-r border-white/50">Rol</th>
                <th className="py-3 px-6 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6">{usuario.nombre}</td>
                  <td className="py-3 px-6">
                    <a href={`mailto:${usuario.email}`} className="underline text-gray-800 hover:text-blue-600">
                      {usuario.email}
                    </a>
                  </td>
                  <td className="py-3 px-6">{usuario.ultIngreso}</td>
                  <td className="py-3 px-6 flex justify-center">
                    {usuario.activo && (
                      <div className="bg-green-500 rounded-full p-1 text-white">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-6">{usuario.rol}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => prepararEdicion(usuario)}
                        className={`${usuario.id <= 4 ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'} text-white p-1.5 rounded shadow-sm transition-colors`} 
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEliminar(usuario.id)}
                        className={`${usuario.id <= 4 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white p-1.5 rounded shadow-sm transition-colors`} 
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Correo Electrónico</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Contraseña</label>
                  <input 
                    required
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Rol</label>
                <select 
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div className="flex justify-between gap-4 pt-4 mt-2">
                <button type="button" onClick={cerrarModal} className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
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