import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserCircle, Briefcase, Search, Eye, Edit3, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function EmpresasList() {
  const navigate = useNavigate();

  // Estados
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // NUEVO: Estado para controlar el Modal de Borrar
  const [modalBorrar, setModalBorrar] = useState({ show: false, id: null, nombre: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };


  // Efecto para cargar las empresas al entrar a la pantalla
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/empresas');
        const result = await response.json();

        if (response.ok && result.status) {
          setEmpresas(result.data);
        } else {
          console.error("Error del servidor:", result.message);
        }
      } catch (error) {
        console.error("Error de conexión al cargar empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  // ==========================================
  // FUNCIONES DE BOTONES
  // ==========================================

  // 1. Cuando le dan clic al botón rojo de la tabla (solo abre el modal)
  const clickBorrar = (id, nombre) => {
    setModalBorrar({ show: true, id: id, nombre: nombre });
  };

  // 2. Cuando le dan a "Cancelar" en el modal
  const cancelarBorrar = () => {
    setModalBorrar({ show: false, id: null, nombre: '' });
  };

  // 3. Cuando le dan a "Sí, eliminar" en el modal (Aquí hacemos el fetch real)
  const confirmarBorrado = async () => {
    const id = modalBorrar.id;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();

      if (response.ok && result.status) {
        // Actualizamos la tabla
        setEmpresas(empresas.filter(emp => emp.id_empresa !== id));
        // Cerramos el modal
        setModalBorrar({ show: false, id: null, nombre: '' });
        showMessage('Empresa eliminada correctamente.', 'success');
      } else {
        showMessage('Error: ' + (result.message || 'No se pudo eliminar la empresa'), 'error');
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      showMessage('Error de conexión con el servidor.', 'error');
    }
  };

  const handleEditar = (id) => {
    navigate(`/empresas/editar/${id}`);
  };

  const handleVer = (id) => {
    navigate(`/empresas/detalle/${id}`);
  };

  return (
    <div className="flex-1 p-8 bg-white min-h-screen relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-[#1a2b4b]">Gestión de Empresas</h1>
          <button 
            onClick={() => navigate('/empresas/nueva')}
            className="flex items-center gap-2 bg-[#4285f4] text-white px-6 py-2.5 rounded-lg shadow-md hover:brightness-110 transition-all uppercase"
          >
            <Plus strokeWidth={3} />
            NUEVA EMPRESA
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-3xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        )}

        {/* Buscador */}
        <div className="relative mb-8 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar empresa..."
            className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] rounded-md border-none outline-none"
          />
        </div>

        {/* Tabla */}
        <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#e9ecef] border-b border-gray-200">
                <th className="px-6 py-4 text-gray-600 text-center w-32">Registro</th>
                <th className="px-6 py-4 text-gray-600">Nombre de Empresa</th>
                <th className="px-6 py-4 text-gray-600">Responsable</th>
                <th className="px-6 py-4 text-gray-600">Fecha Vencimiento</th>
                <th className="px-6 py-4 text-gray-600 text-center">Estado</th>
                <th className="px-6 py-4 text-gray-600 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-semibold uppercase">
                    Cargando empresas...
                  </td>
                </tr>
              ) : empresas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-semibold uppercase">
                    No hay empresas registradas aún
                  </td>
                </tr>
              ) : (
                empresas.map((emp) => (
                  <tr key={emp.id_empresa} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center gap-2">
                        <div className="bg-[#2ecc71] p-1.5 rounded-full text-white shadow-sm"><UserCircle /></div>
                        <div className="bg-[#a32a44] p-1.5 rounded-full text-white shadow-sm"><Briefcase /></div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-[#1a2b4b] uppercase font-semibold">
                      {emp.nombre_negocio}
                    </td>
                    <td className="px-6 py-6 text-gray-600 uppercase font-semibold">
                      {emp.responsable}
                    </td>
                    <td className="px-6 py-6 text-gray-600 uppercase font-semibold">
                      {emp.fecha_vencimiento_licencia ? new Date(emp.fecha_vencimiento_licencia).toLocaleDateString('es-MX') : 'N/A'}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center">
                        {emp.estado === 'activo' ? (
                          <CheckCircle2 className="text-[#2ecc71]" strokeWidth={2.5} />
                        ) : (
                          <XCircle className="text-red-500" strokeWidth={2.5} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleVer(emp.id_empresa)}
                          className="bg-[#4285f4] p-1.5 rounded text-white shadow-sm hover:brightness-110"
                        >
                          <Eye strokeWidth={2.5} />
                        </button>
                        
                        <button 
                          onClick={() => handleEditar(emp.id_empresa)}
                          className="bg-[#ff9800] p-1.5 rounded text-white shadow-sm hover:brightness-110"
                        >
                          <Edit3 strokeWidth={2.5} />
                        </button>
                        
                        {/* Botón Borrar: Ahora solo abre el modal */}
                        <button 
                          onClick={() => clickBorrar(emp.id_empresa, emp.nombre_negocio)}
                          className="bg-[#f44336] p-1.5 rounded text-white shadow-sm hover:brightness-110"
                        >
                          <Trash2 strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          <div className="bg-[#f8f9fa] px-6 py-4 border-t border-gray-100">
            <span className="text-gray-500 uppercase font-semibold">
              MOSTRANDO {empresas.length} REGISTROS
            </span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL PERSONALIZADO DE ELIMINAR            */}
      {/* ========================================== */}
      {modalBorrar.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            {/* Cabecera del modal */}
            <div className="bg-[#f44336] p-6 text-center flex flex-col items-center rounded-t-[2rem]">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <AlertTriangle className="text-white w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">¡ADVERTENCIA!</h3>
            </div>
            
            {/* Cuerpo del modal */}
            <div className="p-8 text-center space-y-5">
              <p className="text-gray-600 text-lg leading-relaxed">
                ¿Estás seguro de que deseas eliminar la empresa
              </p>
              <p className="font-bold text-[#1a2b4b] text-xl">
                "{modalBorrar.nombre}"?
              </p>
              <p className="text-sm text-[#f44336] font-semibold">
                Esta acción no se puede deshacer.
              </p>
              
              {/* Botones del modal */}
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={cancelarBorrar}
                  className="px-6 py-3 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#334155] font-bold rounded-xl transition-colors uppercase tracking-wide"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarBorrado}
                  className="px-6 py-3 bg-[#f44336] hover:bg-[#d32f2f] text-white font-bold rounded-xl shadow-md transition-colors uppercase tracking-wide"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}