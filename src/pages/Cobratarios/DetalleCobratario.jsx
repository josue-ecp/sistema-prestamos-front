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
    <div className="min-h-screen w-full bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
      <button
        type="button"
        onClick={() => navigate('/cobratarios')}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a cobratarios
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.07)] sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
            <p className="text-sm">Cargando cobratario...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-300 bg-slate-100 p-6 text-sm text-slate-800 sm:text-base">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Detalle del cobratario</p>
              <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{cobratario.nombre}</h1>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Correo electrónico</p>
                <p className="mt-2 break-all text-base font-semibold text-slate-900 sm:text-lg">{cobratario.correo}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Teléfono</p>
                <p className="mt-2 text-base font-semibold text-slate-900 sm:text-lg">{cobratario.telefono || 'No disponible'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Zona asignada</p>
                <p className="mt-2 text-base font-semibold uppercase text-slate-900 sm:text-lg">{cobratario.zona?.nombre_zona || 'Sin zona'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Estado</p>
                <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold uppercase ${cobratario.estado === 'activo' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'}`}>
                  {cobratario.estado || 'Desconocido'}
                </p>
              </div>
              </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
}