import React from 'react';

const ProductTable = ({ products = [], role, onEdit, onDelete, onActivate, onSelect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Activo</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className={!p.active ? 'opacity-60' : ''}>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">${p.price}</td>
              <td className="p-2 border">{p.stock}</td>
              <td className="p-2 border">{p.active ? 'Sí' : 'No'}</td>
              <td className="p-2 border">
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => onSelect?.(p.id)} className="underline text-blue-600">Ver</button>
                  {(role === 'ADMIN' || role === 'EMPLOYEE') && (
                    <>
                      <button onClick={() => onEdit?.(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                      {p.active ? (
                        <button onClick={() => onDelete?.(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
                      ) : (
                        <button onClick={() => onActivate?.(p.id)} className="bg-indigo-600 text-white px-2 py-1 rounded">Activar</button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
