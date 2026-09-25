import React, { useState } from 'react';

export default function TabExpediente({ onFileSelect }) {
  const [archivos, setArchivos] = useState([
    { nombre: "Identificación Oficial (INE)", tipoKey: "ine", file: null },
    { nombre: "Comprobante de domicilio", tipoKey: "comprobante_domicilio", file: null },
    { nombre: "Archivo libre 1", tipoKey: "archivo_libre_1", file: null },
    { nombre: "Archivo libre 2", tipoKey: "archivo_libre_2", file: null },
    { nombre: "Archivo libre 3", tipoKey: "archivo_libre_3", file: null }
  ]);

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const nuevosArchivos = [...archivos];
      nuevosArchivos[index].file = file;
      setArchivos(nuevosArchivos);
      
      // Notificamos al formulario principal
      if (onFileSelect) {
        onFileSelect(nuevosArchivos[index].tipoKey, file);
      }
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 pb-8 sm:pb-12 pt-4 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {archivos.map((archivo, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-8 pb-4 sm:pb-0 border-b sm:border-b-0 border-gray-100">
          <span className="w-full sm:w-64 text-gray-700 font-medium text-sm sm:text-base">
            {archivo.nombre}
            {archivo.file && <span className="block text-[10px] text-green-600 font-bold uppercase mt-1">✓ Seleccionado: {archivo.file.name}</span>}
          </span>
          
          <label className="cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => handleFileChange(index, e)} 
            />
            <span className="inline-block border border-[#e74c3c] bg-[#e5e5e5] text-gray-600 px-6 sm:px-8 py-2.5 rounded-[2rem] text-xs sm:text-sm hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm font-bold uppercase tracking-wide cursor-pointer">
              {archivo.file ? 'Cambiar archivo' : 'Adjuntar archivo'}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}