import React, { useCallback, useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, activateProduct, fetchCategories } from '../../api/products';
import ProductForm from '../../components/ProductForm';
import ProductTable from '../../components/ProductTable';
import DashboardLayout from '../../components/DashboardLayout';
import ProductFilters from '../../components/ProductFilters';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    text: '',
    minPrice: '',
    maxPrice: '',
    activeOnly: true,
    categoryId: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const handleFilterChange = useCallback((payload) => setFilters(payload), []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchProducts();
      setProducts(list);
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (e) {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createProduct(payload);
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert('Error creando');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateProduct(editing.id, payload);
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert('Error actualizando');
    }
  };

  const handleDelete = (product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
      await load();
    } catch (e) {
      alert('Error eliminando');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      if (product.active) {
        handleDelete(product);
        return;
      } else {
        await activateProduct(product.id);
      }
      await load();
    } catch (e) {
      alert(product.active ? 'Error desactivando' : 'Error activando');
    }
  };

  const onEdit = (p) => {
    setEditing(p);
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onSelect = (id) => navigate(`/productos/${id}`);

  const filteredProducts = products.filter((p) => {
    const priceValue = typeof p.price === 'number' ? p.price : parseFloat(p.price || 0);
    const matchText = filters.text
      ? [p.name, p.description].some((field) => field?.toLowerCase().includes(filters.text.toLowerCase()))
      : true;
    const cid = p.categoryId || p.category?.id;
    const matchCategory = filters.categoryId ? String(cid) === String(filters.categoryId) : true;
    const matchActive = filters.activeOnly ? p.active !== false : true;
    const matchMin = filters.minPrice ? priceValue >= parseFloat(filters.minPrice) : true;
    const matchMax = filters.maxPrice ? priceValue <= parseFloat(filters.maxPrice) : true;
    return matchText && matchCategory && matchActive && matchMin && matchMax;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">inventory</span>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          </div>
          <p className="text-gray-600">Administra el catálogo de productos</p>
        </div>
        
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
        
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <div className="flex gap-2">
            <button onClick={openNew} className="flex items-center gap-2 bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <span className="material-icons">add_circle</span>
              Agregar Producto
            </button>
            <button onClick={() => navigate('/admin/categorias')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <span className="material-icons">category</span>
              Gestionar Categorías
            </button>
          </div>
          <button onClick={load} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="material-icons">refresh</span>
            Refrescar
          </button>
        </div>
        
        {!showForm && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <ProductFilters
              categories={categories}
              onChange={handleFilterChange}
            />
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        )}
        
        {!showForm && !loading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ProductTable
              products={filteredProducts}
              role="ADMIN"
              onEdit={onEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onSelect={onSelect}
            />
          </div>
        )}
        
        {showForm && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="material-icons text-teal">{editing ? 'edit' : 'add_box'}</span>
              {editing ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <ProductForm
              product={editing}
              categories={categories}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Confirmar eliminación</h2>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar el producto{' '}
                <span className="font-semibold">"{deleteConfirm.name}"</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductManagement;
