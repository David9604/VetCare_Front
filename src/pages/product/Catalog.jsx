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
  const [filters, setFilters] = useState({
    text: '',
    minPrice: '',
    maxPrice: '',
    activeOnly: true,
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const applyFilters = (list = [], { text, minPrice, maxPrice, activeOnly, categoryId }) => {
    let result = [...list];
    if (text) {
      const t = text.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t)
      );
    }
    if (minPrice) {
      result = result.filter((p) => parseFloat(p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => parseFloat(p.price) <= parseFloat(maxPrice));
    }
    if (activeOnly) {
      result = result.filter((p) => p.active);
    }
    if (categoryId) {
      result = result.filter((p) => (p.categoryId || p.category?.id) == categoryId);
    }
    return result;
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar productos y categorías en paralelo
      const [list, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories().catch(() => []) // Si falla categorías, continuar con array vacío
      ]);
      setProducts(list);
      setFiltered(applyFilters(list, filters));
      setCategories(cats);
    } catch (e) {
      setError(e.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    setFiltered(applyFilters(products, filters));
  }, [products]);

  const handleFilters = (nextFilters) => {
    setFilters(nextFilters);
    setFiltered(applyFilters(products, nextFilters));
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      const productName = products.find(p => p.id === productId)?.name || 'Producto';
      setSuccessMessage(`${productName} agregado al carrito exitosamente`);
      setError(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e) {
      setError(e.response?.data || 'Error al agregar al carrito. Por favor intenta de nuevo.');
      setSuccessMessage(null);
      setTimeout(() => setError(null), 4000);
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
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-red-600 text-sm bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
        {successMessage && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg mb-4">
            <span className="material-icons">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}
        
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={goDetail} />
            ))}
          </div>
        )}
        
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
