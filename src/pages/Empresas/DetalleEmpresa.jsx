import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function DetalleEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}`);
        const result = await response.json();

        if (response.ok && result.status) {
          setEmpresa(result.data);
        } else {
          setError(result.message || 'No se pudo cargar la empresa.');
        }
      } catch (err) {
        setError('Error de conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <button
        type="button"
        onClick={() => navigate('/empresas')}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </button>

      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.07)] sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
            <p>Cargando empresa...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-300 bg-slate-100 p-6 text-slate-800">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Detalle de la empresa</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{empresa.nombre_negocio}</h1>
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Responsable</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.responsable}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Correo electrónico</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.correo}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Fecha de vencimiento</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.fecha_vencimiento_licencia ? new Date(empresa.fecha_vencimiento_licencia).toLocaleDateString('es-MX') : 'N/A'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Usuarios WEB</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.limite_usuarios_web ?? 'No definido'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Cobratarios</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.limite_cobratarios ?? 'No definido'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Estado</p>
                <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${empresa.estado === 'activo' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'}`}>
                  {empresa.estado ?? 'Desconocido'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
