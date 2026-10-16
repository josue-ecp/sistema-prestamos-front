import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

const mapTipoCredito = (item) => ({
  tipoCredito: item.tipo_credito || '',
  descripcion: item.descripcion || '',
  esquema: item.esquema || '',
  tasaInteres: item.tasa_interes || '',
  plazoCredito: item.plazo_credito || '',
  periodicidad: item.periodicidad || 'SEMANAL',
  diasVisita: item.dias_visita || [],
});

const toApiPayload = (data) => ({
  tipo_credito: data.tipoCredito,
  descripcion: data.descripcion,
  esquema: data.esquema,
  tasa_interes: data.tasaInteres,
  plazo_credito: data.plazoCredito,
  periodicidad: data.periodicidad,
  dias_visita: data.diasVisita,
});

export default function NuevoTipoCredito() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    tipoCredito: '',
    descripcion: '',
    esquema: '',
    tasaInteres: '',
    plazoCredito: '',
    periodicidad: 'SEMANAL',
    diasVisita: []
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTipoCredito = async () => {
      if (!id) {
        return;
      }

      try {
        const response = await api.get(`/tipos-creditos/${id}`);
        setFormData(mapTipoCredito(response.data.data));
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo cargar el tipo de crédito' });
        window.setTimeout(() => navigate('/tipos-creditos'), 1800);
      }
    };

    fetchTipoCredito();
  }, [id, navigate]);

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (dia) => {
    setFormData((prev) => ({
      ...prev,
      diasVisita: prev.diasVisita.includes(dia)
        ? prev.diasVisita.filter((d) => d !== dia)
        : [...prev.diasVisita, dia]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const request = id
      ? api.put(`/tipos-creditos/${id}`, toApiPayload(formData))
      : api.post('/tipos-creditos', toApiPayload(formData));

    request
      .then(() => {
        showMessage(id ? 'Tipo de crédito actualizado correctamente.' : 'Tipo de crédito creado correctamente.', 'success');
        setTimeout(() => navigate('/tipos-creditos'), 600);
      })
      .catch((error) => {
        showMessage(error.response?.data?.message || 'Error al guardar tipo de crédito', 'error');
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
      <div className="bg-blue-900 px-6 py-5 sm:px-8">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Administración de cartera</p>
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">{id ? 'Editar tipo de crédito' : 'Agregar tipo de crédito'}</h2>
      </div>

      <div className="p-5 sm:p-8">
        <div className="mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/tipos-creditos')}
              className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <ArrowLeft size={16} />
              Volver a tipos de crédito
            </button>
          </div>

          {message.text && (
            <div className={`mb-6 rounded-xl border p-4 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
              <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
              <p className="text-sm leading-6">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Tipo de crédito</label>
                <input
                  type="text"
                  name="tipoCredito"
                  value={formData.tipoCredito}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Esquema</label>
                <div className="relative">
                  <select
                    name="esquema"
                    value={formData.esquema}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    required
                  >
                    <option value="">SELECCIONE UN ESQUEMA</option>
                    <option value="esquema1">Esquema 1</option>
                    <option value="esquema2">Esquema 2</option>
                    <option value="esquema3">Esquema 3</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Tasa de interés</label>
                <input
                  type="text"
                  name="tasaInteres"
                  value={formData.tasaInteres}
                  onChange={handleChange}
                  placeholder="Porcentaje de interés"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Plazo de crédito</label>
                <input
                  type="text"
                  name="plazoCredito"
                  value={formData.plazoCredito}
                  onChange={handleChange}
                  placeholder="Plazo del crédito"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">Asigne la periodicidad de visitas</p>
              <hr className="my-4 border-slate-200" />
              <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-600">Tipo de periodicidad para el cliente</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-700" />
                  <select
                    name="periodicidad"
                    value={formData.periodicidad}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="SEMANAL">SEMANAL</option>
                    <option value="MENSUAL">MENSUAL</option>
                    <option value="QUINCENAL">QUINCENAL</option>
                  </select>
                </div>

                <div className="flex-1">
                  <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-200">
                    <thead>
                      <tr className="bg-slate-50">
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                          <th key={dia} className="border border-slate-200 px-2 py-3 text-xs font-bold text-slate-600">{dia}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                          <td key={dia} className="border border-slate-100 px-2 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={formData.diasVisita.includes(dia)}
                              onChange={() => handleCheckboxChange(dia)}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-800 px-6 py-3 text-xs font-bold uppercase text-white transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : id ? 'Actualizar' : 'Aceptar'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tipos-creditos')}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold uppercase text-slate-600 transition hover:bg-slate-100 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
