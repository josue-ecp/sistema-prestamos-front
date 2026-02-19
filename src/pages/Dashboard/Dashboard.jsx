import Sidebar from '../../components/Sidebar/Sidebar';
import StatCard from '../../components/StatCard/StatCard';
import RecoveryChart from '../../components/RecoveryChart/RecoveryChart'; 
import MovimientosTable from '../../components/MovimientosTable/MovimientosTable'; 
import { Bell, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Barra lateral fija */}
      <Sidebar />
      
      {/* Contenido Principal: ml-64 compensa el ancho del Sidebar fixed */}
      <main className="flex-1 ml-64 flex flex-col">
        
        {/* Header Superior - Sticky para que no se pierda al hacer scroll */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 gap-6 sticky top-0 z-20">
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 leading-none">Admin Principal</p>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Super admin</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
              AP
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </header>

        {/* Zona de Contenido con scroll independiente si es necesario */}
        <div className="p-8 max-w-[1600px] w-full mx-auto">
          
          {/* Títulos de sección */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Dashboard principal</h1>
            <p className="text-gray-500 font-medium">Resumen de operaciones y métricas clave</p>
          </div>

          {/* Grid de Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <StatCard 
              title="Total colocado" 
              value="$1,245,000" 
              percentage="+12.5%" 
              isUp={true} 
              type="total" 
            />
            <StatCard 
              title="Cobros de hoy" 
              value="$324,500" 
              percentage="+8.2%" 
              isUp={true} 
              type="cobros" 
            />
            <StatCard 
              title="Cartera vencida" 
              value="$87,250" 
              percentage="-3.1%" 
              isUp={false} 
              type="vencida" 
            />
            <StatCard 
              title="Préstamos por autorizar" 
              value="24" 
              type="autorizar" 
            />
          </div>

          {/* Sección de Visualización de Datos */}
          <div className="space-y-8">
            {/* Gráfica de Recuperación */}
            <div className="w-full">
              <RecoveryChart />
            </div>

            {/* Tabla de Movimientos Recientes */}
            <div className="w-full pb-8">
              <MovimientosTable />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}