import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
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
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const zonasRes = await axios.get('http://127.0.0.1:8000/api/zonas', { headers });
        setZonas(zonasRes.data);

        if (isEditing) {
          const clienteRes = await axios.get(`http://127.0.0.1:8000/api/clientes/${id}`, { headers });
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
    const token = localStorage.getItem('token');
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
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      if (isEditing) {
        data.append('_method', 'PUT');
        await axios.post(`http://127.0.0.1:8000/api/clientes/${id}`, data, { headers });
        showMessage('Cliente actualizado correctamente.');
      } else {
        await axios.post('http://127.0.0.1:8000/api/clientes', data, { headers });
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
    <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <button 
        type="button"
        onClick={() => navigate('/clientes')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
        <div className="bg-[#0b66c2] px-6 py-4">
          <h2 className="text-white text-base font-bold uppercase tracking-wide">
            {isEditing ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
          </h2>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <button 
            type="button"
            onClick={() => setActiveTab('datos')}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === 'datos' ? 'border-b-4 border-blue-600 text-blue-600 bg-white shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
          >
            1. Datos Generales
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('direccion')}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === 'direccion' ? 'border-b-4 border-blue-600 text-blue-600 bg-white shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
          >
            2. Ubicación / Mapa {formData.latitud !== '20.9674' && '✓'}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('expediente')}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === 'expediente' ? 'border-b-4 border-blue-600 text-blue-600 bg-white shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
          >
            3. Expediente y Archivos
          </button>
        </div>

        {message.text && (
          <div className={`mx-6 mt-6 rounded-2xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            <p className="font-semibold">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          
          {/* Pestaña 1: Datos Generales */}
          <div style={{ display: activeTab === 'datos' ? 'block' : 'none' }}>
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez Pool" 
                    required
                    autoComplete="off"
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800 uppercase"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Correo Electrónico (Portal PWA)</label>
                  <input 
                    type="email" 
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="cliente@correo.com" 
                    autoComplete="off"
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Contraseña {isEditing && '(Opcional)'}</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isEditing ? "Dejar en blanco para mantener actual" : "••••••••"} 
                    autoComplete="new-password"
                    {...(!isEditing ? { required: true } : {})}
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Dirección</label>
                  <input 
                    type="text" 
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Ej. Calle 20 x 15 y 17" 
                    autoComplete="off"
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Teléfono</label>
                  <input 
                    type="text" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej. 9991234567" 
                    autoComplete="off"
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Zona Asignada</label>
                  <select 
                    name="id_zona"
                    value={formData.id_zona}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800 cursor-pointer"
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

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/clientes')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-2.5 rounded-lg text-xs uppercase transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-lg text-xs uppercase transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Guardando todo...' : (isEditing ? 'Actualizar Cliente' : 'Guardar Cliente')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}