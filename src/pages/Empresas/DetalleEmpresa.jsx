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
    <div className="p-8 min-h-screen bg-[#f8fafc]">
      <button
        type="button"
        onClick={() => navigate('/empresas')}
        className="inline-flex items-center gap-2 mb-6 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </button>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
            <Loader2 className="animate-spin h-8 w-8" />
            <p>Cargando empresa...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Detalle de la empresa</p>
              <h1 className="text-3xl font-bold text-slate-900">{empresa.nombre_negocio}</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Responsable</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.responsable}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Correo electrónico</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.correo}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Fecha de vencimiento</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.fecha_vencimiento_licencia ? new Date(empresa.fecha_vencimiento_licencia).toLocaleDateString('es-MX') : 'N/A'}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Usuarios WEB</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.limite_usuarios_web ?? 'No definido'}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cobratarios</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{empresa.limite_cobratarios ?? 'No definido'}</p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Estado</p>
                <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${empresa.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
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
