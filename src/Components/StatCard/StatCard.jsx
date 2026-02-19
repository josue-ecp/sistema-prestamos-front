import * as Lucide from 'lucide-react';

export default function StatCard({ title, value, percentage, isUp, type }) {
  
 
  const getIcon = () => {
    switch (type) {
      case 'total': return { icon: <Lucide.TrendingUp size={24} />, bg: "bg-green-100", text: "text-green-600" };
      case 'cobros': return { icon: <Lucide.DollarSign size={24} />, bg: "bg-blue-100", text: "text-blue-600" };
      case 'vencida': return { icon: <Lucide.AlertCircle size={24} />, bg: "bg-red-100", text: "text-red-600" };
      case 'autorizar': return { icon: <Lucide.Clock size={24} />, bg: "bg-yellow-100", text: "text-yellow-600" };
      default: return { icon: <Lucide.Activity size={24} />, bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const config = getIcon();

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-gray-800">{value}</h3>
        {percentage && (
          <div className={`flex items-center gap-1 text-sm font-bold mt-3 ${isUp ? 'text-green-500' : 'text-red-400'}`}>
            {isUp ? <Lucide.TrendingUp size={14} /> : <Lucide.TrendingDown size={14} />}
            {percentage}
          </div>
        )}
      </div>
      
      {/* Icono con sus colores */}
      <div className={`p-4 rounded-2xl ${config.bg} ${config.text} flex items-center justify-center`}>
        {config.icon}
      </div>
    </div>
  );
}