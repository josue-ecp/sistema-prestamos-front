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
    <div className="px-4 sm:px-8 lg:px-16 pb-8 sm:pb-12 pt-4 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {archivos.map((archivo, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-8 pb-4 sm:pb-0 border-b sm:border-b-0 border-gray-100">
          <span className="w-full sm:w-64 text-gray-700 font-medium text-sm sm:text-base">{archivo}</span>
          <button className="self-start sm:self-auto border border-[#e74c3c] bg-[#e5e5e5] text-gray-600 px-6 sm:px-8 py-2.5 rounded-[2rem] text-xs sm:text-sm hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
            Adjuntar archivo
          </button>
        </div>
      ))}
    </div>
  );
}