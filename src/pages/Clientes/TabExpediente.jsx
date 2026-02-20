import React from 'react';

export default function TabExpediente() {
  const archivos = [
    "Identificación Oficial (INE)",
    "Comprobante de domicilio",
    "Archivo libre 1",
    "Archivo libre 2",
    "Archivo libre 3"
  ];

  return (
    <div className="px-16 pb-12 pt-4 space-y-8 animate-in fade-in duration-300">
      {archivos.map((archivo, index) => (
        <div key={index} className="flex items-center gap-8">
          <span className="w-64 text-gray-700 font-medium">{archivo}</span>
          <button className="border border-[#e74c3c] bg-[#e5e5e5] text-gray-500 px-8 py-2.5 rounded-[2rem] hover:bg-red-50 transition-colors">
            Adjuntar archivo
          </button>
        </div>
      ))}
    </div>
  );
}