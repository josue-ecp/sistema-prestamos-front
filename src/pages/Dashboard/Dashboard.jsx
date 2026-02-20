import StatCard from '../../components/StatCard/StatCard';
import RecoveryChart from '../../components/RecoveryChart/RecoveryChart'; 
import MovimientosTable from '../../components/MovimientosTable/MovimientosTable'; 

export default function Dashboard() {
  return (
    // Ya no necesitamos flex ni ml-64 porque App.jsx se encarga de eso.
    <div className="p-8 max-w-[1600px] w-full mx-auto">
      
      {/* Títulos de sección */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Dashboard principal</h1>
        <p className="text-gray-500 font-medium">Resumen de operaciones y métricas clave</p>
      </div>

      {/* Grid de Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <StatCard title="Total colocado" value="$1,245,000" percentage="+12.5%" isUp={true} type="total" />
        <StatCard title="Cobros de hoy" value="$324,500" percentage="+8.2%" isUp={true} type="cobros" />
        <StatCard title="Cartera vencida" value="$87,250" percentage="-3.1%" isUp={false} type="vencida" />
        <StatCard title="Préstamos por autorizar" value="24" type="autorizar" />
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
  );
}