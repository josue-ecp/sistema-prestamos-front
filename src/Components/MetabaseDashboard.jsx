import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MetabaseDashboard = () => {
    const [dashboardUrl, setDashboardUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Solicitamos la URL firmada a nuestra API de Laravel
        axios.get('http://localhost:8000/api/metabase/dashboard-token')
            .then(response => {
                setDashboardUrl(response.data.url);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener el token del dashboard de Metabase:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-6 text-center">Cargando dashboard analítico...</div>;
    }

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Analítico (Metabase)</h1>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                {dashboardUrl ? (
                    <iframe
                        src={dashboardUrl}
                        frameBorder="0"
                        width="100%"
                        height="850px"
                        allowTransparency="true"
                        title="Metabase Dashboard Credurix"
                    />
                ) : (
                    <p className="p-4 text-red-500">No se pudo cargar el enlace de incrustación.</p>
                )}
            </div>
        </div>
    );
};

export default MetabaseDashboard;