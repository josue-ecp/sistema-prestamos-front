import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

const api = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: { Authorization: `Bearer ${token}` },
  });
};

const mapTipoCredito = (item) => ({
  id: item.id_tipo_credito,
  tipoCredito: item.tipo_credito || '',
  descripcion: item.descripcion || '',
  esquema: item.esquema || '',
  tasaInteres: item.tasa_interes || '',
  plazoCredito: item.plazo_credito || '',
  periodicidad: item.periodicidad || '',
  diasVisita: item.dias_visita || [],
  estado: item.estado || 'activo',
});

export default function DetalleTipoCredito() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTipoCredito = async () => {
      try {
        const res = await api().get(`/tipos-creditos/${id}`);
        setTipo(mapTipoCredito(res.data.data));
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar el tipo de crédito');
      } finally {
        setLoading(false);
      }
    };

    fetchTipoCredito();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <button
        type="button"
        onClick={() => navigate('/tipos-creditos')}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a tipos de crédito
      </button>

      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.07)] sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
            <p>Cargando tipo de crédito...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-300 bg-slate-100 p-6 text-slate-800">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Detalle del tipo de crédito</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{tipo.tipoCredito}</h1>
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Descripción</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tipo.descripcion || 'No disponible'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Esquema</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tipo.esquema || 'No definido'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Tasa de interés</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tipo.tasaInteres || 'No disponible'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Plazo de crédito</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tipo.plazoCredito || 'No disponible'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Periodicidad</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tipo.periodicidad || 'No disponible'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Días de visita</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tipo.diasVisita?.join(', ') || 'No definido'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
