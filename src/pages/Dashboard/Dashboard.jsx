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
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
      <div className="mb-6 sm:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
            Dashboard principal
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Resumen de operaciones y métricas clave de CREDURIX
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard title="Total colocado" value={stats.totalColocado} percentage="+12.5%" isUp={true} type="total" />
        <StatCard title="Cobros de hoy" value={stats.cobrosHoy} percentage="+8.2%" isUp={true} type="cobros" />
        <StatCard title="Cartera vencida" value={stats.carteraVencida} percentage="-3.1%" isUp={false} type="vencida" />
        <StatCard title="Préstamos activos" value={stats.prestamosActivos} type="autorizar" />
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Grid para mostrar ambas gráficas ordenadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <RecoveryChart datosGrafica={chartData} />
          </div>
          
          {/* 4. Llamamos la gráfica de pastel aquí */}
          <div className="w-full">
            <VisitasPieChart datosGrafica={visitasChartData} />
          </div>
        </div>

        <div className="w-full pb-8 overflow-x-auto">
          <div className="min-w-[650px] lg:min-w-full">
            <MovimientosTable />
          </div>
        </div>
      </div>
    </div>
  );
}