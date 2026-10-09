import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function VisitasPieChart({ datosGrafica }) {
  // Colores profesionales para los estados de las visitas
  const COLORS = ['#10B981', '#EF4444', '#3B82F6']; // Verde (Pagado), Rojo (No pagó), Azul (Pendiente)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="w-full mb-4">
        <h3 className="text-lg font-black text-gray-800">Estado de Visitas de Hoy</h3>
        <p className="text-xs text-gray-400 font-medium">Distribución operativa de la ruta diaria</p>
      </div>

      <div className="w-full h-64">
        {datosGrafica && datosGrafica.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosGrafica}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {datosGrafica.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs font-bold">
            No hay datos de visitas registrados hoy.
          </div>
        )}
      </div>
    </div>
  );
}