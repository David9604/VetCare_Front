import React from 'react';

const ServiceCard = ({ icon = 'description', title = 'Título', description = 'Descripción' }) => (
  <div className="w-full">
    <div className="h-full rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col">
      <div className="flex justify-center mb-6">
        <i className="material-icons text-teal text-5xl">{icon}</i>
      </div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-center text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default ServiceCard;