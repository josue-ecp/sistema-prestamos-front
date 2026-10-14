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
    <div className="space-y-4 p-5 animate-in fade-in duration-300 sm:space-y-5 sm:p-8">
      {archivos.map((archivo, index) => (
        <div key={index} className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-8 sm:px-5">
          <span className="w-full text-sm font-semibold text-slate-700 sm:flex-1 sm:text-base">
            {archivo.nombre}
            {archivo.file && <span className="mt-1 block text-[10px] font-bold uppercase text-blue-700">✓ Seleccionado: {archivo.file.name}</span>}
          </span>
          
          <label className="cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => handleFileChange(index, e)} 
            />
            <span className="inline-block cursor-pointer rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-blue-800 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-100 sm:px-6 sm:text-sm">
              {archivo.file ? 'Cambiar archivo' : 'Adjuntar archivo'}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}