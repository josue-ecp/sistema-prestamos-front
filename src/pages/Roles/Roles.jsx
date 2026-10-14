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
        <div className="min-h-screen w-full bg-slate-50/70 p-4 sm:p-6 lg:p-8 relative">
            <div className="mb-7">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Administración</p>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestión de Roles</h1>
                <p className="mt-1 text-sm text-slate-500">Define perfiles y permisos de acceso al sistema.</p>
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
                        placeholder="Buscar rol..."
                    />
                </div>

                <button
                    onClick={abrirModal}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Rol
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-gray-800 border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                <th className="border-b border-slate-200 px-6 py-4 text-left">ID</th>
                                <th className="border-b border-slate-200 px-6 py-4 text-left">Nombre</th>
                                <th className="border-b border-slate-200 px-6 py-4 text-left">Descripción</th>
                                <th className="border-b border-slate-200 px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-800">
                            {loading ? (
                                <tr><td colSpan="4" className="py-12 text-center text-slate-400">Cargando...</td></tr>
                            ) : filteredRoles.length === 0 ? (
                                <tr><td colSpan="4" className="py-12 text-center text-slate-400">No hay roles registrados</td></tr>
                            ) : (
                                filteredRoles.map((rol) => (
                                    <tr key={rol.id_rol} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                                        <td className="px-6 py-4 text-slate-500">{rol.id_rol}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{rol.nombre_rol}</td>
                                        <td className="px-6 py-4 text-slate-600">{rol.descripcion || 'Sin descripción'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => prepararEdicion(rol)}
                                                    className="rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => abrirModalEliminar(rol.id_rol, rol.nombre_rol)}
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
                            <p className="text-gray-600 text-lg leading-relaxed">¿Estás seguro de que deseas eliminar el rol</p>
                            <p className="text-xl font-bold text-slate-900">"{modalBorrar.nombre}"?</p>
                            <p className="text-sm font-semibold text-slate-500">Esta acción no se puede deshacer.</p>
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
                    <div className="w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200 sm:p-8">
                        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                {isEditing ? 'Editar Rol' : 'Registrar Nuevo Rol'}
                            </h2>
                            <button onClick={cerrarModal} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">ID del rol</label>
                                <input
                                    type="text"
                                    value={formData.id_rol || ''}
                                    onChange={(e) => setFormData({ ...formData, id_rol: e.target.value })}
                                    disabled={true}
                                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
                                    placeholder={isEditing ? 'ID asignado' : 'Se asignará automáticamente'}
                                />
                                <p className="mt-1 text-xs text-slate-500">El ID no se puede modificar.</p>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Nombre del rol</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre_rol}
                                    onChange={(e) => setFormData({ ...formData, nombre_rol: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Descripción</label>
                                <textarea
                                    rows="4"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                                    placeholder="Describe la función del rol..."
                                />
                            </div>

                            <div className="mt-2 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                                <button type="button" onClick={cerrarModal} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 transition hover:bg-slate-100">Cancelar</button>
                                <button type="submit" className="flex-1 rounded-xl bg-blue-800 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-blue-900">
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
