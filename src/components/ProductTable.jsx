import React, { useMemo } from 'react';

const ProductTable = ({ products = [], role, onEdit, onToggleActive, onSelect }) => {
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }),
    []
  );

  const resolveCategory = (product) =>
    product.category?.name || product.categoryName || 'Sin categoría';

  const resolvePrice = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return '—';
    return currencyFormatter.format(numeric);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="px-4 py-3">
              <span className="material-icons inline align-middle text-base mr-2">shopping_bag</span>
              Producto
            </th>
            <th className="px-4 py-3">
              <span className="material-icons inline align-middle text-base mr-2">category</span>
              Categoría
            </th>
            <th className="px-4 py-3">
              <span className="material-icons inline align-middle text-base mr-2">attach_money</span>
              Precio
            </th>
            <th className="px-4 py-3">
              <span className="material-icons inline align-middle text-base mr-2">inventory_2</span>
              Stock
            </th>
            <th className="px-4 py-3">
              <span className="material-icons inline align-middle text-base mr-2">check_circle</span>
              Estado
            </th>
            <th className="px-4 py-3 text-center">
              <span className="material-icons inline align-middle text-base mr-2">tune</span>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-semibold text-gray-900">{product.name}</td>
              <td className="px-4 py-3 text-gray-700">{resolveCategory(product)}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{resolvePrice(product.price)}</td>
              <td className="px-4 py-3 text-gray-700">{product.stock ?? '—'}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => onSelect?.(product.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal border border-teal rounded-md hover:bg-teal/10 transition-colors"
                  >
                    <span className="material-icons text-sm">visibility</span>
                    Ver
                  </button>
                  {(role === 'ADMIN' || role === 'EMPLOYEE') && (
                    <>
                      <button
                        onClick={() => onEdit?.(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-400 rounded-md bg-amber-50 hover:bg-amber-100 transition-colors"
                      >
                        <span className="material-icons text-sm">edit</span>
                        Editar
                      </button>
                      <button
                        onClick={() => onToggleActive?.(product)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          product.active
                            ? 'text-red-600 border border-red-300 bg-red-50 hover:bg-red-100'
                            : 'text-green-700 border border-green-400 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        <span className="material-icons text-sm">
                          {product.active ? 'block' : 'check_circle'}
                        </span>
                        {product.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No hay productos que coincidan con los filtros actuales.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
