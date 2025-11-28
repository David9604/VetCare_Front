import React, { useEffect, useMemo, useRef, useState } from 'react';
import SearchableDropdown from './SearchableDropdown';

const ProductFilters = ({ onChange, categories = [] }) => {
  const [text, setText] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);
  const [categoryId, setCategoryId] = useState('');

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ text, minPrice, maxPrice, activeOnly, categoryId });
  }, [text, minPrice, maxPrice, activeOnly, categoryId]);

  const categoryOptions = useMemo(
    () => [{ id: '', name: 'Todas las categorías' }, ...categories],
    [categories]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col gap-1 lg:col-span-2">
        <label className="text-sm font-medium text-gray-700">Buscar</label>
        <div className="relative">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nombre o descripción"
            className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Precio mínimo</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
            placeholder="$"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Precio máximo</label>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
            placeholder="$"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Categoría</label>
        <SearchableDropdown
          options={categoryOptions}
          value={categoryId}
          onChange={(val) => setCategoryId(val ?? '')}
          placeholder="Todas las categorías"
          getOptionLabel={(option) => option?.name || ''}
          valueKey="id"
          sort
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Estado</label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Solo mostrar activos
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
