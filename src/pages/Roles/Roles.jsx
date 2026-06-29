import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, Edit, Plus, Search, Trash2, X } from 'lucide-react';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [modalBorrar, setModalBorrar] = useState({ show: false, id: null, nombre: '' });

    const [formData, setFormData] = useState({
        id_rol: '',
        nombre_rol: '',
        descripcion: ''
    });

    const showMessage = (text, type = 'success') => {
        setMessage({ type, text });
        window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/roles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok && data.status) {
                setRoles(data.data || []);
            } else {
                showMessage('No se pudieron cargar los roles.', 'error');
            }
        } catch (error) {
            console.error('Error al cargar roles:', error);
            showMessage('Error de conexión al cargar los roles.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const abrirModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ id_rol: '', nombre_rol: '', descripcion: '' });
        setIsModalOpen(true);
    };

    const prepararEdicion = (rol) => {
        setIsEditing(true);
        setCurrentId(rol.id_rol);
        setFormData({
            id_rol: rol.id_rol,
            nombre_rol: rol.nombre_rol || '',
            descripcion: rol.descripcion || ''
        });
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ id_rol: '', nombre_rol: '', descripcion: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre_rol.trim()) {
            showMessage('El nombre del rol es obligatorio.', 'error');
            return;
        }

        const token = localStorage.getItem('token');
        const url = isEditing
            ? `http://127.0.0.1:8000/api/roles/${currentId}`
            : 'http://127.0.0.1:8000/api/roles';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre_rol: formData.nombre_rol.trim(),
                    descripcion: formData.descripcion.trim()
                })
            });

            const result = await response.json();

            if (response.ok && result.status) {
                showMessage(result.message || 'Rol guardado correctamente.', 'success');
                await fetchRoles();
                cerrarModal();
            } else {
                showMessage(result.message || 'No se pudo guardar el rol.', 'error');
            }
        } catch (error) {
            console.error('Error al guardar rol:', error);
            showMessage('Error de conexión al guardar el rol.', 'error');
        }
    };

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
            const response = await fetch(`http://127.0.0.1:8000/api/roles/${modalBorrar.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && result.status) {
                setRoles((prev) => prev.filter((rol) => rol.id_rol !== modalBorrar.id));
                cancelarEliminar();
                showMessage(result.message || 'Rol eliminado.', 'success');
            } else {
                showMessage(result.message || 'No se pudo eliminar el rol.', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            showMessage('Error de conexión al eliminar el rol.', 'error');
        }
    };

    const filteredRoles = roles.filter((rol) => {
        const search = searchTerm.toLowerCase();
        return (
            String(rol.id_rol).includes(search) ||
            (rol.nombre_rol || '').toLowerCase().includes(search) ||
            (rol.descripcion || '').toLowerCase().includes(search)
        );
    });

    return (
        <div className="p-8 w-full min-h-screen bg-[#f8f9fa] relative">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Roles</h1>

            {message.text && (
                <div className={`mb-6 px-5 py-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-gray-200/70 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar rol..."
                    />
                </div>

                <button
                    onClick={abrirModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Rol
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-gray-800 border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
                                <th className="py-3 px-6 font-semibold border-r border-white/50 text-left">ID</th>
                                <th className="py-3 px-6 font-semibold border-r border-white/50 text-left">Nombre</th>
                                <th className="py-3 px-6 font-semibold border-r border-white/50 text-left">Descripción</th>
                                <th className="py-3 px-6 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-800">
                            {loading ? (
                                <tr><td colSpan="4" className="py-8 text-center text-gray-500">Cargando...</td></tr>
                            ) : filteredRoles.length === 0 ? (
                                <tr><td colSpan="4" className="py-8 text-center text-gray-500">No hay roles registrados</td></tr>
                            ) : (
                                filteredRoles.map((rol) => (
                                    <tr key={rol.id_rol} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-6">{rol.id_rol}</td>
                                        <td className="py-3 px-6 font-semibold text-gray-900">{rol.nombre_rol}</td>
                                        <td className="py-3 px-6 text-gray-600">{rol.descripcion || 'Sin descripción'}</td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => prepararEdicion(rol)}
                                                    className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded shadow-sm transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => abrirModalEliminar(rol.id_rol, rol.nombre_rol)}
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
                            <p className="text-gray-600 text-lg leading-relaxed">¿Estás seguro de que deseas eliminar el rol</p>
                            <p className="font-bold text-[#1a2b4b] text-xl">"{modalBorrar.nombre}"?</p>
                            <p className="text-sm text-[#f44336] font-semibold">Esta acción no se puede deshacer.</p>
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
                    <div className="bg-white w-[520px] rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Editar Rol' : 'Registrar Nuevo Rol'}
                            </h2>
                            <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-700 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">ID del rol</label>
                                <input
                                    type="text"
                                    value={formData.id_rol || ''}
                                    onChange={(e) => setFormData({ ...formData, id_rol: e.target.value })}
                                    disabled={true}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    placeholder={isEditing ? 'ID asignado' : 'Se asignará automáticamente'}
                                />
                                <p className="text-xs text-gray-500 mt-1">El ID no se puede modificar.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre del rol</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre_rol}
                                    onChange={(e) => setFormData({ ...formData, nombre_rol: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
                                <textarea
                                    rows="4"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                                    placeholder="Describe la función del rol..."
                                />
                            </div>

                            <div className="flex justify-between gap-4 pt-4 mt-2">
                                <button type="button" onClick={cerrarModal} className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 px-4 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 shadow-md">
                                    {isEditing ? 'Guardar Cambios' : 'Agregar Rol'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roles;
