import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Plus, Edit, Trash2, Eye, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mapTipoCredito = (item) => ({
  id: item.id,
  tipoCredito: item.tipo_credito || '',
  descripcion: item.descripcion || '',
  esquema: item.esquema || '',
  tasaInteres: item.tasa_interes || '',
  plazoCredito: item.plazo_credito || '',
  periodicidad: item.periodicidad || '',
  diasVisita: item.dias_visita || [],
  estado: item.estado || 'activo',
  id_empresa: item.id_empresa,
});

export default function TiposDeCredito() {
  const navigate = useNavigate();
  const [tiposCredito, setTiposCredito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, nombre: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  const fetchTiposCredito = async () => {
    try {
      const response = await api.get('/tipos-creditos');
      
      if (response.data && response.data.status) {
        setTiposCredito(response.data.data.map(mapTipoCredito)); 
      } else {
        setTiposCredito([]);
      }
    } catch (error) {
      console.error(error);
      showMessage(error.response?.data?.message || 'No se pudieron cargar los tipos de crédito', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposCredito();
  }, []);

  const handleDelete = (tipo) => {
    setDeleteModal({ open: true, id: tipo.id, nombre: tipo.tipoCredito });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/tipos-creditos/${deleteModal.id}`);
      setTiposCredito((current) => current.filter((item) => item.id !== deleteModal.id));
      showMessage('Tipo de crédito eliminado correctamente.', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'No se pudo eliminar el tipo de crédito', 'error');
    } finally {
      setDeleteModal({ open: false, id: null, nombre: '' });
    }
  };

  const filteredTipos = tiposCredito.filter((tipo) =>
    tipo.tipoCredito.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNew = () => navigate('/tipos-de-credito/nuevo');
  const handleEdit = (id) => navigate(`/tipos-de-credito/editar/${id}`);
  const handleView = (id) => navigate(`/tipos-de-credito/detalle/${id}`);

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Administración de cartera</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tipos de crédito</h1>
            <p className="mt-1 text-sm text-slate-500">Lista de tipos de crédito vinculados a la empresa del usuario.</p>
          </div>

          <button
            onClick={handleNew}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] cursor-pointer"
          >
            <Plus size={16} />
            Nuevo tipo de crédito
          </button>
        </div>

        {message.text && (
          <div className={`rounded-xl border p-4 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
            <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        )}

        <div className="relative max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tipo de crédito..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  <th className="border-b border-slate-200 px-5 py-4">Tipo de crédito</th>
                  <th className="border-b border-slate-200 px-5 py-4">Descripción</th>
                  <th className="border-b border-slate-200 px-5 py-4">Periodicidad</th>
                  <th className="border-b border-slate-200 px-5 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center font-semibold uppercase text-slate-400">
                      Cargando tipos de crédito...
                    </td>
                  </tr>
                ) : filteredTipos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center font-semibold uppercase text-slate-400">
                      No hay tipos de crédito para esta empresa.
                    </td>
                  </tr>
                ) : (
                  filteredTipos.map((tipo) => (
                    <tr key={tipo.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                      <td className="px-5 py-4 font-semibold uppercase text-slate-900">{tipo.tipoCredito}</td>
                      <td className="px-5 py-4 text-slate-600">{tipo.descripcion}</td>
                      <td className="px-5 py-4 font-semibold uppercase text-slate-600">{tipo.periodicidad}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(tipo.id)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 cursor-pointer"
                            title="Ver"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(tipo.id)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-100 cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(tipo)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              MOSTRANDO {filteredTipos.length} REGISTROS
            </span>
          </div>
        </div>
      </div>

      {deleteModal.open && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="bg-blue-900 px-8 py-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-blue-100">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <p className="text-2xl font-bold tracking-[0.12em] uppercase sm:text-3xl">Confirmar eliminación</p>
            </div>
            <div className="bg-white p-8">
              <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar el tipo de crédito</p>
              <p className="font-bold text-slate-900 text-xl mb-4">"{deleteModal.nombre}"?</p>
              <p className="mb-8 text-sm font-semibold text-slate-500">Esta acción no se puede deshacer.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ open: false, id: null, nombre: '' })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 sm:w-auto cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full rounded-xl bg-blue-800 px-6 py-3 font-semibold text-white transition hover:bg-blue-900 sm:w-auto cursor-pointer"
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