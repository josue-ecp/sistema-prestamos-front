import React, { useState, useEffect } from 'react';
import api from '../../api';
import StatCard from '../../Components/StatCard/StatCard';
import RecoveryChart from '../../Components/RecoveryChart/RecoveryChart'; 
import VisitasPieChart from '../../Components/VisitasPieChart/VisitasPieChart'; // <--- 1. Importas el componente
import MovimientosTable from '../../Components/MovimientosTable/MovimientosTable'; 

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalColocado: '$0',
    cobrosHoy: '$0',
    carteraVencida: '$0',
    prestamosActivos: 0
  });

  const [chartData, setChartData] = useState([]);
  const [visitasChartData, setVisitasChartData] = useState([]); // <--- 2. Estado para los datos de la gráfica de pastel

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard-stats');
        
        if (response.data && response.data.stats) {
          setStats({
            totalColocado: `$${response.data.stats.totalColocado}`,
            cobrosHoy: `$${response.data.stats.cobrosHoy}`,
            carteraVencida: `$${response.data.stats.carteraVencida}`,
            prestamosActivos: response.data.stats.pendientes
          });
        }

        if (response.data && response.data.grafica) {
          setChartData(response.data.grafica);
        }

        // 3. Suponiendo que el backend mandará la info de visitas en response.data.visitasGrafica
        if (response.data && response.data.visitasGrafica) {
          setVisitasChartData(response.data.visitasGrafica);
        }

      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
      <div className="mb-7 flex flex-col justify-between gap-3 sm:mb-9 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard principal
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
            Resumen de operaciones y métricas clave de CREDURIX
          </p>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 sm:mb-9 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard title="Total colocado" value={stats.totalColocado} percentage="+12.5%" isUp={true} type="total" />
        <StatCard title="Cobros de hoy" value={stats.cobrosHoy} percentage="+8.2%" isUp={true} type="cobros" />
        <StatCard title="Cartera vencida" value={stats.carteraVencida} percentage="-3.1%" isUp={false} type="vencida" />
        <StatCard title="Préstamos activos" value={stats.prestamosActivos} type="autorizar" />
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Grid para mostrar ambas gráficas ordenadas */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <RecoveryChart datosGrafica={chartData} />
          </div>
          
          {/* 4. Llamamos la gráfica de pastel aquí */}
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <VisitasPieChart datosGrafica={visitasChartData} />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white pb-2 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="min-w-[650px] lg:min-w-full">
            <MovimientosTable />
          </div>
        </div>
      </div>
    </div>
  );
}