import React, { useEffect, useState } from 'react';
import { serviceApi } from '../api/services';
import ServiceCard from '../components/ServiceCard';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceApi.getAll();
        // Mostrar solo servicios activos
        const activeServices = (response.data || []).filter(s => s.active);
        setServices(activeServices);
      } catch (e) {
        setError('Error cargando servicios');
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">medical_services</span>
            <h1 className="text-3xl font-bold text-gray-800">Nuestros Servicios</h1>
          </div>
          <p className="text-gray-600">Conoce todos los servicios veterinarios que ofrecemos</p>
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-16 w-16 rounded-full mx-auto mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mx-auto mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-full mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3 mx-auto mb-4"></div>
                <div className="bg-gray-200 h-8 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}

        {!loading && (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.requiresVeterinarian ? "medical_services" : "home_repair_service"}
                title={service.name}
                description={service.description}
                price={service.price}
              />
            ))}
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <span className="material-icons text-gray-300 text-6xl mb-4">medical_services</span>
            <p className="text-gray-600">No hay servicios disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
