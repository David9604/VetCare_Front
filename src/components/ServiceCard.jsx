import React from 'react';

const ServiceCard = ({ icon = 'description', title = 'Título', description = 'Descripción', price }) => {
  const formatPrice = (value) => {
    if (!value && value !== 0) return null;
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full">
      <div className="h-full rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col">
        <div className="flex justify-center mb-6">
          <i className="material-icons text-teal text-5xl">{icon}</i>
        </div>
        <h3 className="text-center text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-center text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
        {price && (
          <div className="mt-auto pt-4 border-t border-gray-100">
            <p className="text-center text-teal font-bold text-xl">
              ${formatPrice(price)}
            </p>
            <p className="text-center text-gray-500 text-xs mt-1">Precio del servicio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;