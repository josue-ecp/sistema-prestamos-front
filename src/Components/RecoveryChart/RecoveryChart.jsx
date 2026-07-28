import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RecoveryChart({ datosGrafica }) {
  // Si no han cargado los datos, ponemos la estructura en ceros
  const finalData = datosGrafica?.length > 0 ? datosGrafica : [
    { name: 'Lun', actual: 0, proyectado: 0 },
    { name: 'Mar', actual: 0, proyectado: 0 },
    { name: 'Mie', actual: 0, proyectado: 0 },
    { name: 'Jue', actual: 0, proyectado: 0 },
    { name: 'Vie', actual: 0, proyectado: 0 },
    { name: 'Sab', actual: 0, proyectado: 0 },
    { name: 'Dom', actual: 0, proyectado: 0 },
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full mb-8">
      <h3 className="font-bold text-gray-800 mb-6 text-lg">Recuperación semanal</h3>
      
      <div className="h-[350px] w-full">
        {/* Cambiar width a 99% quita el warning amarillo de consola */}
        <ResponsiveContainer width="99%" height="100%">
          <LineChart data={finalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#ec4899" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 8 }} 
            />
            
            <Line 
              type="monotone" 
              dataKey="proyectado" 
              stroke="#d4d0c8" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={{ r: 4, fill: '#d4d0c8' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}