import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api';

export default function EditarPrestamo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fecha_desembolso: '',
    esquema_cobro: 'semanal',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPayments, setHasPayments] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPrestamo = async () => {
      try {
        const response = await api.get(`/prestamos/${id}`);
        const prestamo = response.data;
        const pagosRegistrados = (prestamo.pagos || []).length > 0;
        setHasPayments(pagosRegistrados);
        setFormData({
          fecha_desembolso: prestamo.fecha_desembolso?.slice(0, 10) || '',
          esquema_cobro: prestamo.esquema_cobro || 'semanal',
        });
      } catch (error) {
        console.error('Error al cargar el préstamo para editar:', error);
        setErrorMessage(error.response?.data?.message || 'No se pudo cargar el préstamo.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamo();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      await api.put(`/prestamos/${id}`, formData);
      navigate(`/prestamos/detalle/${id}`);
    } catch (error) {
      console.error('Error al actualizar el préstamo:', error);
      setErrorMessage(error.response?.data?.message || 'No se pudo actualizar el préstamo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
        <div className="bg-blue-900 px-6 py-5 sm:px-8">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Cartera de crédito</p>
          <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">Editar préstamo #{id}</h1>
        </div>

        <div className="p-5 sm:p-8">
          <button
            type="button"
            onClick={() => navigate(`/prestamos/detalle/${id}`)}
            className="mb-6 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 hover:text-blue-950"
          >
            <ArrowLeft size={18} /> Volver al detalle
          </button>

          {errorMessage && (
            <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Cargando préstamo...</p>
          ) : hasPayments ? (
            <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Este préstamo tiene pagos registrados y no puede editarse para proteger su historial.
            </p>
          ) : !errorMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-slate-600">
                Solo se pueden ajustar la fecha de desembolso y el esquema de cobro. Los importes, cuotas, saldos y pagos no se modifican.
              </p>

              <div>
                <label htmlFor="fecha_desembolso" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Fecha de desembolso
                </label>
                <input
                  id="fecha_desembolso"
                  name="fecha_desembolso"
                  type="date"
                  value={formData.fecha_desembolso}
                  onChange={(event) => setFormData((previous) => ({ ...previous, fecha_desembolso: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="esquema_cobro" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Esquema de cobro
                </label>
                <select
                  id="esquema_cobro"
                  name="esquema_cobro"
                  value={formData.esquema_cobro}
                  onChange={(event) => setFormData((previous) => ({ ...previous, esquema_cobro: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/prestamos/detalle/${id}`)}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold uppercase text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-800 px-6 py-3 text-xs font-bold uppercase text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
