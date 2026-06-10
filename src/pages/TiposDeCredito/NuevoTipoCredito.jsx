import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

const api = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: { Authorization: `Bearer ${token}` },
  });
};

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
        const response = await api().get(`/tipos-creditos/${id}`);
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
      ? api().put(`/tipos-creditos/${id}`, toApiPayload(formData))
      : api().post('/tipos-creditos', toApiPayload(formData));

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
    <div className="w-full min-h-screen bg-[#f8fafc]">
      <div className="bg-[#0b66c2] px-6 py-3">
        <h2 className="text-white text-sm font-medium">{id ? 'Editar tipo de crédito' : 'Agregar tipo de crédito'}</h2>
      </div>

      <div className="bg-[#f8fafc] p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/tipos-creditos')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Volver a tipos de crédito
            </button>
          </div>

          {message.text && (
            <div className={`mb-6 rounded-3xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
              <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
              <p className="text-sm leading-6">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de crédito</label>
                <input
                  type="text"
                  name="tipoCredito"
                  value={formData.tipoCredito}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Esquema</label>
                <div className="relative">
                  <select
                    name="esquema"
                    value={formData.esquema}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Tasa de interés</label>
                <input
                  type="text"
                  name="tasaInteres"
                  value={formData.tasaInteres}
                  onChange={handleChange}
                  placeholder="Porcentaje de interés"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Plazo de crédito</label>
                <input
                  type="text"
                  name="plazoCredito"
                  value={formData.plazoCredito}
                  onChange={handleChange}
                  placeholder="Plazo del crédito"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <p className="text-gray-700 text-sm font-medium">Asigne la periodicidad de visitas</p>
              <hr className="my-4 border-gray-300" />
              <p className="text-gray-700 text-sm font-medium mb-4">Tipo de periodicidad para el cliente</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  <select
                    name="periodicidad"
                    value={formData.periodicidad}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SEMANAL">SEMANAL</option>
                    <option value="MENSUAL">MENSUAL</option>
                    <option value="QUINCENAL">QUINCENAL</option>
                  </select>
                </div>

                <div className="flex-1">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                          <th key={dia} className="border border-gray-300 py-2 px-2 text-xs font-medium text-gray-700">{dia}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                          <td key={dia} className="border border-gray-300 py-2 px-2 text-center">
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

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded text-sm uppercase transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : id ? 'Actualizar' : 'Aceptar'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tipos-creditos')}
                disabled={saving}
                className="bg-[#e74c3c] hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded text-sm uppercase transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
