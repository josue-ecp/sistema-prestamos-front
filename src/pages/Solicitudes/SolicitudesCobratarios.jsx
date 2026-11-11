import { useCallback, useEffect, useState } from 'react';
import api from '../../api';

export default function SolicitudesCobratarios() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/solicitudes-cobratario');
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resolve = async (id, action) => {
    const motivo = action === 'rechazar' ? window.prompt('Motivo del rechazo (opcional):') : null;
    if (action === 'rechazar' && motivo === null) return;

    setWorkingId(id);
    setError('');
    try {
      await api.post(`/solicitudes-cobratario/${id}/${action === 'aprobar' ? 'aprobar' : 'rechazar'}`, action === 'rechazar' ? { motivo_rechazo: motivo } : {});
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo resolver la solicitud.');
    } finally {
      setWorkingId(null);
    }
  };

  const showDetail = async (id) => {
    setLoadingDetail(true);
    setError('');
    try {
      const { data } = await api.get(`/solicitudes-cobratario/${id}`);
      setDetail(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo cargar el detalle.');
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Administración</p>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes de cobratarios</h1>
        <p className="mt-1 text-sm text-slate-500">Revisa prospectos antes de registrarlos como clientes.</p>
      </header>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {loading ? <p className="text-sm text-slate-500">Cargando solicitudes...</p> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="p-3">Persona / contacto</th>
                <th className="p-3">Cobratario / zona</th>
                <th className="p-3">Creada</th>
                <th className="p-3">Estado / detalle</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((solicitud) => (
                <tr key={solicitud.id_solicitud} className="border-t border-slate-100 align-top">
                  <td className="p-3">
                    <span className="mb-2 inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                      {solicitud.tipo_solicitud === 'CLIENTE_EXISTENTE' ? 'Nuevo préstamo' : 'Nuevo cliente'}
                    </span>
                    <strong>{solicitud.nombre}</strong>
                    <div>{solicitud.telefono}</div>
                    <div>{solicitud.correo || 'Sin correo'}</div>
                  </td>
                  <td className="p-3">{solicitud.cobratario?.nombre || '—'}<div>{solicitud.zona?.nombre_zona || '—'}</div></td>
                  <td className="p-3">{solicitud.created_at ? new Date(solicitud.created_at).toLocaleString('es-MX') : '—'}</td>
                  <td className="p-3">
                    <span className="font-semibold capitalize">{solicitud.estado}</span>
                    {solicitud.fecha_resolucion && (
                      <p className="mt-1 text-xs text-slate-500">
                        Resuelta por {solicitud.resuelto_por_tipo === 'Empresa' ? 'cuenta Empresa' : (solicitud.usuario_resolvio?.nombre || 'usuario administrativo')} el {new Date(solicitud.fecha_resolucion).toLocaleString('es-MX')}
                      </p>
                    )}
                    <p className="mt-1 whitespace-pre-wrap">{solicitud.direccion || solicitud.notas || 'Sin detalles adicionales'}</p>
                    {solicitud.tipo_solicitud === 'CLIENTE_EXISTENTE' && (
                      <p className="mt-1 text-slate-700">Monto: {solicitud.monto_solicitado} · Plazo: {solicitud.plazo_solicitado}</p>
                    )}
                    {solicitud.motivo_rechazo && <p className="mt-1 text-red-700">{solicitud.motivo_rechazo}</p>}
                    {solicitud.cliente && <p className="mt-1 text-green-700">Cliente: {solicitud.cliente.nombre}</p>}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      {solicitud.tipo_solicitud === 'CLIENTE_EXISTENTE' && (
                        <button disabled={loadingDetail} onClick={() => showDetail(solicitud.id_solicitud)} className="rounded-lg border border-blue-300 px-3 py-2 font-semibold text-blue-800 disabled:opacity-60">Ver historial</button>
                      )}
                      {solicitud.estado === 'pendiente' && (
                        <>
                          <button disabled={workingId === solicitud.id_solicitud} onClick={() => resolve(solicitud.id_solicitud, 'aprobar')} className="rounded-lg bg-blue-800 px-3 py-2 font-semibold text-white disabled:opacity-60">Aprobar</button>
                          <button disabled={workingId === solicitud.id_solicitud} onClick={() => resolve(solicitud.id_solicitud, 'rechazar')} className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 disabled:opacity-60">Rechazar</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {solicitudes.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No hay solicitudes.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {detail && (
        <aside className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Detalle de cliente existente</h2>
              <p className="text-sm text-slate-500">{detail.cliente?.nombre} · {detail.cliente?.telefono}</p>
            </div>
            <button type="button" onClick={() => setDetail(null)} className="text-sm font-semibold text-slate-500">Cerrar</button>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            Empresa: {detail.cliente?.empresa?.nombre_negocio || '—'} · Zona: {detail.cliente?.zona?.nombre_zona || detail.zona?.nombre_zona || '—'} · Cobratario: {detail.cobratario?.nombre || '—'}
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Monto solicitado: {detail.monto_solicitado || '—'} · Plazo: {detail.plazo_solicitado || '—'} · Registro: {detail.created_at ? new Date(detail.created_at).toLocaleString('es-MX') : '—'}
          </p>
          <h3 className="mt-4 font-semibold text-slate-900">Historial de préstamos</h3>
          {detail.cliente?.prestamos?.length ? (
            <ul className="mt-2 space-y-2 text-sm">
              {detail.cliente.prestamos.map((prestamo) => (
                <li key={prestamo.id_prestamo} className="rounded-lg bg-slate-50 p-3">
                  Préstamo #{prestamo.id_prestamo} · Monto original: {prestamo.monto} · Tasa: {prestamo.tasa_interes}% · Estado: {prestamo.estado}
                  <br />Cuota: {prestamo.monto_cuota} · Saldo: {prestamo.saldo_pendiente} · Días de retraso: {prestamo.dias_retraso} · Próximo pago: {prestamo.fecha_siguiente_pago || '—'}
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-slate-500">No hay préstamos registrados.</p>}
        </aside>
      )}
    </section>
  );
}
