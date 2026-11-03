import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

const initialForm = { nombre: '', telefono: '', correo: '', direccion: '', notas: '' };

export default function NuevaSolicitud() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    api.get('/solicitudes-cobratario/mis-solicitudes')
      .then(({ data }) => {
        if (active) setSolicitudes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setMessage('No se pudo cargar el historial de solicitudes.');
      })
      .finally(() => {
        if (active) setLoadingSolicitudes(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/solicitudes-cobratario', form);
      setForm(initialForm);
      setMessage('Solicitud enviada para revisión.');
      try {
        const { data } = await api.get('/solicitudes-cobratario/mis-solicitudes');
        setSolicitudes(Array.isArray(data) ? data : []);
      } catch {
        setMessage('Solicitud enviada, pero no se pudo actualizar el historial.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl bg-slate-50 p-4 pb-24">
      <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-blue-800">
        Volver
      </button>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Prospectos</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Levantar solicitud</h1>
        <p className="mt-2 text-sm text-slate-500">La información se enviará al administrador de tu empresa.</p>

        {message && <p role="status" className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">{message}</p>}

        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Nombre de la persona
            <input name="nombre" required maxLength={150} value={form.nombre} onChange={updateField} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Teléfono
            <input name="telefono" required maxLength={20} value={form.telefono} onChange={updateField} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Correo (opcional)
            <input type="email" name="correo" maxLength={150} value={form.correo} onChange={updateField} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Dirección (opcional)
            <textarea name="direccion" maxLength={2000} value={form.direccion} onChange={updateField} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Notas (opcional)
            <textarea name="notas" maxLength={2000} value={form.notas} onChange={updateField} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-blue-800 px-4 py-3 font-bold text-white disabled:opacity-60">
            {loading ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </section>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Mis solicitudes</h2>
        {loadingSolicitudes ? (
          <p className="mt-3 text-sm text-slate-500">Cargando historial...</p>
        ) : solicitudes.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Todavía no tienes solicitudes.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {solicitudes.map((solicitud) => (
              <li key={solicitud.id_solicitud} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{solicitud.nombre}</p>
                    <p className="text-sm text-slate-500">{solicitud.telefono}</p>
                    {solicitud.motivo_rechazo && (
                      <p className="mt-1 text-sm text-rose-700">Motivo: {solicitud.motivo_rechazo}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-700">
                    {solicitud.estado}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
