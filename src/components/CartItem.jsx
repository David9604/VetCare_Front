import React from 'react';

const CartItem = ({ item, quantity, onQuantityChange, onQuantityBlur, onRemove }) => {
  if (!item) return null;
  return (
    <div className="flex gap-3 items-center border-b py-2">
      {item.productImage && (
        <img src={item.productImage} alt={item.productName} className="h-16 w-16 object-cover rounded" />
      )}
      <div className="flex-1">
        <h4 className="font-medium">{item.productName}</h4>
        <p className="text-xs text-gray-600">{item.productDescription}</p>
        <p className="text-sm mt-1">Unit: ${item.unitPrice} | Subtotal: ${item.subtotal}</p>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = e.target.value;
              onQuantityChange?.(item.id, val);
            }}
            onBlur={() => onQuantityBlur?.(item.id)}
            className="border w-20 px-2 py-1 rounded"
          />
          <button onClick={() => onRemove?.(item.id)} className="text-red-600 text-xs underline">Quitar</button>
        </div>
        <p className="text-xs mt-1 text-gray-500">Stock disponible: {item.availableStock}</p>
      </div>
    </div>
  );
};

export default CartItem;
