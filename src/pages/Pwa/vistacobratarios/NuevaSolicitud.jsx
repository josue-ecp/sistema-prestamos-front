import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

const initialForm = {
  tipo_solicitud: 'NUEVO_CLIENTE',
  nombre: '',
  telefono: '',
  correo: '',
  direccion: '',
  notas: '',
  id_cliente: '',
  monto_solicitado: '',
  plazo_solicitado: '',
};

export default function NuevaSolicitud() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [message, setMessage] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchingClients, setSearchingClients] = useState(false);
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

  useEffect(() => {
    if (form.tipo_solicitud !== 'CLIENTE_EXISTENTE' || clientSearch.trim().length < 2) {
      setClientResults([]);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setSearchingClients(true);
      try {
        const { data } = await api.get('/solicitudes-cobratario/clientes-elegibles', {
          params: { search: clientSearch.trim() },
        });
        if (active) setClientResults(Array.isArray(data) ? data : []);
      } catch {
        if (active) setMessage('No se pudo buscar clientes elegibles.');
      } finally {
        if (active) setSearchingClients(false);
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [clientSearch, form.tipo_solicitud]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.tipo_solicitud === 'CLIENTE_EXISTENTE' && !selectedClient) {
      setMessage('Selecciona un cliente elegible antes de enviar la solicitud.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      await api.post('/solicitudes-cobratario', form.tipo_solicitud === 'CLIENTE_EXISTENTE'
        ? {
          tipo_solicitud: form.tipo_solicitud,
          id_cliente: form.id_cliente,
          monto_solicitado: form.monto_solicitado,
          plazo_solicitado: form.plazo_solicitado,
          notas: form.notas,
        }
        : form);
      setForm(initialForm);
      setSelectedClient(null);
      setClientSearch('');
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
            Tipo de solicitud
            <select name="tipo_solicitud" value={form.tipo_solicitud} onChange={(event) => {
              updateField(event);
              setSelectedClient(null);
              setClientSearch('');
            }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal">
              <option value="NUEVO_CLIENTE">Nuevo cliente</option>
              <option value="CLIENTE_EXISTENTE">Cliente existente</option>
            </select>
          </label>
          {form.tipo_solicitud === 'NUEVO_CLIENTE' ? (
            <>
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
            </>
          ) : (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Buscar cliente por nombre o teléfono
                <input value={clientSearch} onChange={(event) => {
                  setClientSearch(event.target.value);
                  setSelectedClient(null);
                  setForm((current) => ({ ...current, id_cliente: '' }));
                }} minLength={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
              </label>
              {searchingClients && <p className="text-sm text-slate-500">Buscando clientes...</p>}
              {clientResults.length > 0 && (
                <ul className="divide-y rounded-lg border border-slate-200">
                  {clientResults.map((client) => (
                    <li key={client.id}>
                      <button type="button" onClick={() => {
                        setSelectedClient(client);
                        setClientResults([]);
                        setClientSearch(client.nombre);
                        setForm((current) => ({ ...current, id_cliente: client.id }));
                      }} className="w-full p-3 text-left hover:bg-slate-50">
                        <strong>{client.nombre}</strong>
                        <span className="ml-2 text-sm text-slate-500">{client.telefono}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {selectedClient && (
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                  <p className="font-bold">{selectedClient.nombre}</p>
                  <p>{selectedClient.telefono} · {selectedClient.zona?.nombre_zona || `Zona ${selectedClient.id_zona}`}</p>
                  <p>Identificador: {selectedClient.id}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Monto solicitado
                  <input name="monto_solicitado" required type="number" min="0.01" step="0.01" value={form.monto_solicitado} onChange={updateField} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Plazo solicitado
                  <input name="plazo_solicitado" required type="number" min="1" step="1" value={form.plazo_solicitado} onChange={updateField} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
                </label>
              </div>
            </>
          )}
          <label className="block text-sm font-semibold text-slate-700">
            Observaciones (opcional)
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
                    <p className="font-semibold text-slate-800">{solicitud.tipo_solicitud === 'CLIENTE_EXISTENTE' ? 'Nuevo préstamo · ' : ''}{solicitud.nombre}</p>
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
