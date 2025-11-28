import React, { useState, useEffect, useRef } from 'react';
import SearchableDropdown from './SearchableDropdown';

const initial = { name: '', description: '', price: '', stock: '', categoryId: '' };

const baseInputClass = 'w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal/50';

const ProductForm = ({ product, onSubmit, onCancel, categories = [] }) => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        categoryId: product.categoryId || product.category?.id || ''
      });
      setFileName(product.image ? 'Imagen existente' : '');
      setImageFile(null);
      setPreview(product.image || '');
    } else {
      setForm(initial);
      setFileName('');
      setImageFile(null);
      setPreview('');
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setImageFile(file);
    setPreview((prevUrl) => {
      if (prevUrl && prevUrl.startsWith('blob:')) {
        URL.revokeObjectURL(prevUrl);
      }
      return URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        categoryId: form.categoryId ? parseInt(form.categoryId, 10) : undefined,
        imageFile
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input name="name" value={form.name} onChange={handleChange} required maxLength={100} className={baseInputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea name="description" value={form.description} onChange={handleChange} required maxLength={500} className={`${baseInputClass} min-h-[120px]`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} required className={baseInputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} required min={0} className={baseInputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <SearchableDropdown
          options={categories}
          value={form.categoryId ? String(form.categoryId) : ''}
          onChange={(val) => setForm((prev) => ({ ...prev, categoryId: val }))}
          placeholder="Selecciona una categoría"
          getOptionLabel={(option) => option?.name || ''}
          valueKey="id"
          required
        />
      </div>
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm shadow-teal-sm hover:shadow-teal-lg"
        >
          <span className="material-icons text-base">cloud_upload</span>
          Seleccionar archivo
        </button>
        <label className="block mt-2 text-sm font-medium text-gray-700">Imagen (PNG/JPEG)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-1">{fileName || 'Ningún archivo seleccionado'}</p>
        {preview && <img src={preview} alt="preview" className="h-28 mt-3 object-cover rounded-lg border border-gray-100 shadow-sm" />}
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
        <button disabled={loading} type="submit" className="px-4 py-2 rounded-lg bg-teal text-white shadow-teal-sm hover:shadow-teal-lg disabled:opacity-70">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
