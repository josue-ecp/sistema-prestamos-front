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
    <div className="min-h-screen flex-1 bg-slate-50/70 p-4 sm:p-6 lg:p-8 relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Encabezado */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-9 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Administración</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestión de Empresas</h1>
            <p className="mt-1 text-sm text-slate-500">Administra empresas y su información de licencia.</p>
          </div>
          <button 
            onClick={() => navigate('/empresas/nueva')}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 uppercase"
          >
            <Plus strokeWidth={3} />
            NUEVA EMPRESA
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-xl border p-4 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
            <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        )}

        {/* Buscador */}
        <div className="relative mb-5 max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar empresa..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Tabla */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="w-32 px-5 py-4 text-center">Registro</th>
                <th className="px-5 py-4">Nombre de Empresa</th>
                <th className="px-5 py-4">Responsable</th>
                <th className="px-5 py-4">Fecha Vencimiento</th>
                <th className="px-5 py-4 text-center">Estado</th>
                <th className="w-32 px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center font-semibold uppercase text-slate-400">
                    Cargando empresas...
                  </td>
                </tr>
              ) : empresas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center font-semibold uppercase text-slate-400">
                    No hay empresas registradas aún
                  </td>
                </tr>
              ) : (
                empresas.map((emp) => (
                  <tr key={emp.id_empresa} className="transition-colors hover:bg-blue-50/40">
                    <td className="px-5 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5 text-blue-800"><UserCircle /></div>
                        <div className="rounded-full bg-slate-100 p-1.5 text-slate-600"><Briefcase /></div>
                      </div>
                    </td>
                    <td className="px-5 py-5 font-semibold uppercase text-slate-900">
                      {emp.nombre_negocio}
                    </td>
                    <td className="px-5 py-5 font-medium uppercase text-slate-600">
                      {emp.responsable}
                    </td>
                    <td className="px-5 py-5 font-medium uppercase text-slate-600">
                      {emp.fecha_vencimiento_licencia ? new Date(emp.fecha_vencimiento_licencia).toLocaleDateString('es-MX') : 'N/A'}
                    </td>
                    <td className="px-5 py-5 text-center">
                      <div className="flex justify-center">
                        {emp.estado === 'activo' ? (
                          <CheckCircle2 className="text-blue-700" strokeWidth={2.5} />
                        ) : (
                          <XCircle className="text-slate-400" strokeWidth={2.5} />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleVer(emp.id_empresa)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:bg-blue-50"
                        >
                          <Eye strokeWidth={2.5} />
                        </button>
                        
                        <button 
                          onClick={() => handleEditar(emp.id_empresa)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-100"
                        >
                          <Edit3 strokeWidth={2.5} />
                        </button>
                        
                        {/* Botón Borrar: Ahora solo abre el modal */}
                        <button 
                          onClick={() => clickBorrar(emp.id_empresa, emp.nombre_negocio)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
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
          </div>
          
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
            <div className="flex flex-col items-center bg-blue-900 p-6 text-center">
              <div className="mb-3 rounded-full bg-white/10 p-3">
                <AlertTriangle className="h-8 w-8 text-blue-100" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">¡ADVERTENCIA!</h3>
            </div>
            
            {/* Cuerpo del modal */}
            <div className="p-8 text-center space-y-5">
              <p className="text-gray-600 text-lg leading-relaxed">
                ¿Estás seguro de que deseas eliminar la empresa
              </p>
              <p className="text-xl font-bold text-slate-900">
                "{modalBorrar.nombre}"?
              </p>
              <p className="text-sm font-semibold text-slate-500">
                Esta acción no se puede deshacer.
              </p>
              
              {/* Botones del modal */}
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={cancelarBorrar}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarBorrado}
                  className="rounded-xl bg-blue-800 px-6 py-3 font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900"
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