import React, { useMemo } from 'react';

const ProductCard = ({ product, onSelect }) => {
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }),
    []
  );

  if (!product) return null;
  const { id, name, description, price, image, stock, active } = product;

  return (
    <div
      className={`border rounded-xl p-4 shadow-sm flex flex-col gap-3 bg-white transition hover:shadow-md ${
        !active ? 'opacity-60' : ''
      }`}
    >
      {image && (
        <div className="h-44 w-full overflow-hidden rounded-lg bg-gray-50">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">Producto</p>
        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      <div className="flex justify-between text-sm mt-auto text-gray-700">
        <span className="font-semibold text-teal">
          {currencyFormatter.format(Number(price) || 0)}
        </span>
        <span>Stock: {stock ?? 0}</span>
      </div>
      <button
        onClick={() => onSelect?.(id)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal text-white py-2 text-sm font-medium hover:bg-teal/90 transition-colors"
      >
        <span className="material-icons text-base">visibility</span>
        Ver detalles
      </button>
    </div>
  );
};

export default ProductCard;
