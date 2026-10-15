import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api';
import TabDireccion from './TabDireccion';
import TabExpediente from './TabExpediente';

export default function AgregarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('datos');

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    direccion: '',
    telefono: '',
    id_zona: '',
    latitud: '20.9674',
    longitud: '-89.5926'
  });

  const [archivosFiles, setArchivosFiles] = useState({
    ine: null,
    comprobante_domicilio: null,
    archivo_libre_1: null,
    archivo_libre_2: null,
    archivo_libre_3: null
  });

  const [zonas, setZonas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonasRes = await api.get('/zonas');
        setZonas(zonasRes.data);

        if (isEditing) {
          const clienteRes = await api.get(`/clientes/${id}`);
          const cliente = clienteRes.data;
          setFormData({
            nombre: cliente.nombre || '',
            correo: cliente.correo || '',
            password: '', // Se deja vacío por seguridad al editar; solo se llena si desea cambiarla
            direccion: cliente.direccion || '',
            telefono: cliente.telefono || '',
            id_zona: cliente.id_zona || '',
            latitud: cliente.latitud || '20.9674',
            longitud: cliente.longitud || '-89.5926'
          });
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showMessage('Error al cargar la información.', 'error');
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.id_zona) {
      showMessage('El nombre y la zona son obligatorios.', 'error');
      setActiveTab('datos');
      return;
    }

    setSaving(true);
    const data = new FormData();

    data.append('nombre', formData.nombre);
    data.append('correo', formData.correo || '');
    if (formData.password) {
      data.append('password', formData.password);
    }
    data.append('direccion', formData.direccion || '');
    data.append('telefono', formData.telefono || '');
    data.append('id_zona', formData.id_zona);
    data.append('latitud', formData.latitud);
    data.append('longitud', formData.longitud);

    Object.keys(archivosFiles).forEach(key => {
      if (archivosFiles[key]) {
        data.append(key, archivosFiles[key]);
      }
    });

    try {
      const headers = {
        'Content-Type': 'multipart/form-data'
      };

      if (isEditing) {
        data.append('_method', 'PUT');
        await api.post(`/clientes/${id}`, data, { headers });
        showMessage('Cliente actualizado correctamente.');
      } else {
        await api.post('/clientes', data, { headers });
        showMessage('Cliente registrado correctamente.');
      }

      window.setTimeout(() => navigate('/clientes'), 1000);
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      showMessage('Error al guardar el cliente. Revisa los campos.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
      <button 
        type="button"
        onClick={() => navigate('/clientes')}
        className="mb-5 flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
        <div className="bg-blue-900 px-6 py-5 sm:px-8">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Administración de clientes</p>
          <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
            {isEditing ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
          </h2>
        </div>

        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/80">
          <button 
            type="button"
            onClick={() => setActiveTab('datos')}
            className={`whitespace-nowrap border-b-2 px-5 py-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer sm:px-6 ${activeTab === 'datos' ? 'border-blue-700 bg-white text-blue-800' : 'border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-800'}`}
          >
            1. Datos Generales
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('direccion')}
            className={`whitespace-nowrap border-b-2 px-5 py-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer sm:px-6 ${activeTab === 'direccion' ? 'border-blue-700 bg-white text-blue-800' : 'border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-800'}`}
          >
            2. Ubicación / Mapa {formData.latitud !== '20.9674' && '✓'}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('expediente')}
            className={`whitespace-nowrap border-b-2 px-5 py-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer sm:px-6 ${activeTab === 'expediente' ? 'border-blue-700 bg-white text-blue-800' : 'border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-800'}`}
          >
            3. Expediente y Archivos
          </button>
        </div>

        {message.text && (
          <div className={`mx-4 mt-5 rounded-xl border p-4 sm:mx-6 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
            <p className="font-semibold">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          
          {/* Pestaña 1: Datos Generales */}
          <div style={{ display: activeTab === 'datos' ? 'block' : 'none' }}>
            <div className="space-y-6 p-5 animate-in fade-in duration-300 sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez Pool" 
                    required
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 uppercase"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Correo Electrónico (Portal PWA)</label>
                  <input 
                    type="email" 
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="cliente@correo.com" 
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Contraseña {isEditing && '(Opcional)'}</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isEditing ? "Dejar en blanco para mantener actual" : "••••••••"} 
                    autoComplete="new-password"
                    {...(!isEditing ? { required: true } : {})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Dirección</label>
                  <input 
                    type="text" 
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Ej. Calle 20 x 15 y 17" 
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Teléfono</label>
                  <input 
                    type="text" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej. 9991234567" 
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Zona Asignada</label>
                  <select 
                    name="id_zona"
                    value={formData.id_zona}
                    onChange={handleChange}
                    required
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Selecciona una zona...</option>
                    {zonas.map((zona) => (
                      <option key={zona.id_zona} value={zona.id_zona}>
                        {zona.nombre_zona} (ID: {zona.id_zona})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pestaña 2: Mapa */}
          <div style={{ display: activeTab === 'direccion' ? 'block' : 'none' }}>
            <TabDireccion 
              lat={formData.latitud} 
              lng={formData.longitud} 
              onChangeCoordinates={(lat, lng) => {
                setFormData(prev => ({ 
                  ...prev, 
                  latitud: String(lat), 
                  longitud: String(lng) 
                }));
              }}
            />
          </div>
          
          {/* Pestaña 3: Expediente */}
          <div style={{ display: activeTab === 'expediente' ? 'block' : 'none' }}>
            <TabExpediente 
              onFileSelect={(tipoKey, file) => {
                setArchivosFiles(prev => ({ ...prev, [tipoKey]: file }));
              }}
            />
          </div>

          <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
            <button 
              type="button"
              onClick={() => navigate('/clientes')}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold uppercase text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-xl bg-blue-800 px-8 py-3 text-xs font-bold uppercase text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Guardando todo...' : (isEditing ? 'Actualizar Cliente' : 'Guardar Cliente')}
            </button>
          </div>

        </form>
      </div>
      </div>
    </div>
  );
}