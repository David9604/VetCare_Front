import React, { useEffect, useState } from 'react';
import { fetchProducts, addToCart, activateProduct, deleteProduct, fetchCategories } from '../../api/products';
import ProductFilters from '../../components/ProductFilters';
import ProductCard from '../../components/ProductCard';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchProducts();
      setProducts(list);
      setFiltered(list);
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch {}
    } catch (e) {
      setError(e.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFilters = ({ text, minPrice, maxPrice, activeOnly, categoryId }) => {
    let list = [...products];
    if (text) {
      const t = text.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t));
    }
    if (minPrice) {
      list = list.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      list = list.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
    }
    if (activeOnly) {
      list = list.filter(p => p.active);
    }
    if (categoryId) {
      list = list.filter(p => (p.categoryId || p.category?.id) == categoryId);
    }
    setFiltered(list);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      alert('Producto agregado al carrito');
    } catch (e) {
      alert('Error al agregar al carrito');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      alert('Error eliminando');
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateProduct(id);
      await load();
    } catch (e) {
      alert('Error activando');
    }
  };

  const goDetail = (id) => navigate(`/productos/${id}`);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">store</span>
            <h1 className="text-3xl font-bold text-gray-800">Catálogo de Productos</h1>
          </div>
          <p className="text-gray-600">Explora nuestros productos veterinarios</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <ProductFilters onChange={handleFilters} categories={categories} />
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        )}
        {error && <p className="text-red-600 text-sm bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
        
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              role={role}
              onAddToCart={handleAddToCart}
              onDelete={handleDelete}
              onActivate={handleActivate}
              onSelect={goDetail}
            />
          ))}
        </div>
        
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <span className="material-icons text-gray-300 text-6xl mb-4">inventory_2</span>
            <p className="text-gray-600">No se encontraron productos</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Catalog;
