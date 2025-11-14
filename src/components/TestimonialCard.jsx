import React from 'react';

const TestimonialCard = ({ avatar, name, description, pet, role }) => (
  <div className="w-full">
    <div className="h-full rounded-lg bg-white shadow-sm p-6 flex flex-col items-center text-center">
      <img
        src={avatar}
        alt={name}
        className="w-24 h-24 rounded-full object-cover border-4 border-teal mb-6"
      />
      <p className="italic text-gray-700 leading-relaxed mb-4 text-sm">{description}</p>
      <h6 className="text-gray-800 font-semibold mb-1">
        {name}{pet ? `, ${pet}` : ''}
      </h6>
      <p className="text-gray-500 text-xs">{role}</p>
    </div>
  </div>
);

export default TestimonialCard;