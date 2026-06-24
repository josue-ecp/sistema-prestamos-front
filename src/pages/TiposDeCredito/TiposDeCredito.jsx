import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const api = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: { Authorization: `Bearer ${token}` },
  });
};

const mapTipoCredito = (item) => ({
  id: item.id_tipo_credito,
  tipoCredito: item.nombre_tipo || '',
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
      // CAMBIADO: Usando guion bajo para alinearse con el api.php de Laravel
      const response = await api().get('/tipos-creditos');
      
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
      // CAMBIADO: Usando guion bajo también para la ruta de eliminación
      await api().delete(`/tipos-creditos/${deleteModal.id}`);
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
    <div className="p-8 w-full min-h-screen bg-[#f8fafc] animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tipos de crédito</h1>
            <p className="text-sm text-gray-500 mt-2">Lista de tipos de crédito vinculados a la empresa del usuario.</p>
          </div>

          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 uppercase tracking-wide"
          >
            <Plus size={16} />
            Nuevo tipo de crédito
          </button>
        </div>

        {message.text && (
          <div className={`rounded-3xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        )}

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tipo de crédito..."
            className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] rounded-md border-none outline-none"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-4 border-r border-white/50">Tipo de crédito</th>
                  <th className="py-4 px-4 border-r border-white/50">Descripción</th>
                  <th className="py-4 px-4 border-r border-white/50">Periodicidad</th>
                  <th className="py-4 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-gray-500 font-semibold uppercase">
                      Cargando tipos de crédito...
                    </td>
                  </tr>
                ) : filteredTipos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-gray-500 font-semibold uppercase">
                      No hay tipos de crédito para esta empresa.
                    </td>
                  </tr>
                ) : (
                  filteredTipos.map((tipo) => (
                    <tr key={tipo.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-semibold uppercase text-gray-900">{tipo.tipoCredito}</td>
                      <td className="py-4 px-4 text-gray-600">{tipo.descripcion}</td>
                      <td className="py-4 px-4 text-gray-600 uppercase font-semibold">{tipo.periodicidad}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(tipo.id)}
                            className="bg-[#3b82f6] hover:bg-blue-700 text-white p-2 rounded shadow-sm transition-colors"
                            title="Ver"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(tipo.id)}
                            className="bg-[#f59e0b] hover:bg-orange-500 text-white p-2 rounded shadow-sm transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(tipo)}
                            className="bg-[#ef4444] hover:bg-red-600 text-white p-2 rounded shadow-sm transition-colors"
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

          <div className="bg-[#f8f9fa] px-6 py-4 border-t border-gray-100">
            <span className="text-gray-500 uppercase font-semibold">
              MOSTRANDO {filteredTipos.length} REGISTROS
            </span>
          </div>
        </div>
      </div>

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
              <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar el tipo de crédito</p>
              <p className="font-bold text-slate-900 text-xl mb-4">"{deleteModal.nombre}"?</p>
              <p className="text-sm font-semibold text-red-600 mb-8">Esta acción no se puede deshacer.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ open: false, id: null, nombre: '' })}
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