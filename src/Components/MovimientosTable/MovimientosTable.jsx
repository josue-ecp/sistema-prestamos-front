const movimientos = [
  { cliente: 'Maria González', monto: '$2,500', tipo: 'Efectivo', cobratario: 'Juan Pérez', hora: '09:15 AM', estado: 'Pagado' },
  { cliente: 'Carlos Ramirez', monto: '$1,800', tipo: 'Transferencia', cobratario: 'Pedro Torres', hora: '10:30 AM', estado: 'Pagado' },
  { cliente: 'Laura Martínez', monto: '$3,200', tipo: 'Efectivo', cobratario: 'Ana López', hora: '11:45 AM', estado: 'Pendiente' },
  { cliente: 'Roberto Sánchez', monto: '$1,500', tipo: 'Efectivo', cobratario: 'Pedro Torres', hora: '01:20 PM', estado: 'Atrasado' },
];

const statusStyles = {
  Pagado: 'bg-green-100 text-green-600',
  Pendiente: 'bg-yellow-100 text-yellow-600',
  Atrasado: 'bg-red-100 text-red-600',
};

export default function MovimientosTable() {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h3 className="font-bold text-gray-800">Últimos Movimientos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-bold">
            <tr>
              <th className="px-8 py-4">Cliente</th>
              <th className="px-8 py-4">Monto</th>
              <th className="px-8 py-4">Cobratario</th>
              <th className="px-8 py-4">Hora</th>
              <th className="px-8 py-4">Estado</th>
              <th className="px-8 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {movimientos.map((m, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4 font-semibold text-gray-700">{m.cliente}</td>
                <td className="px-8 py-4 text-gray-600">{m.monto}</td>
                <td className="px-8 py-4 text-gray-500">{m.cobratario}</td>
                <td className="px-8 py-4 text-gray-400">{m.hora}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${statusStyles[m.estado]}`}>
                    {m.estado}
                  </span>
                </td>
                <td className="px-8 py-4 text-center">
                  <button className="text-blue-600 font-bold hover:underline">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}