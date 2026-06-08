import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function DetalleCobratario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cobratario, setCobratario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCobratario = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://127.0.0.1:8000/api/cobratarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCobratario(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar el cobratario');
      } finally {
        setLoading(false);
      }
    };

    fetchCobratario();
  }, [id]);

  return (
    <div className="p-8 min-h-screen bg-[#f8f9fa]">
      <button
        type="button"
        onClick={() => navigate('/cobratarios')}
        className="inline-flex items-center gap-2 mb-6 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a cobratarios
      </button>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
            <Loader2 className="animate-spin h-8 w-8" />
            <p>Cargando cobratario...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Detalle del cobratario</p>
              <h1 className="text-3xl font-bold text-slate-900">{cobratario.nombre}</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Correo electrónico</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{cobratario.correo}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Teléfono</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{cobratario.telefono || 'No disponible'}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Zona asignada</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{cobratario.zona?.nombre_zona || 'Sin zona'}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Estado</p>
                <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${cobratario.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {cobratario.estado || 'Desconocido'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
