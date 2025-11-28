import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useAuth } from '../context/AuthContext';

const ProductCatalogPublic = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [list, cats] = await Promise.all([
          fetchProducts(),
          fetchCategories().catch(() => [])
        ]);
        // Mostrar solo productos activos
        const activeProducts = (list || []).filter(p => p.active);
        setProducts(activeProducts);
        setFiltered(activeProducts);
        setCategories(cats);
      } catch (e) {
        setError(e.message || 'Error cargando productos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
    if (categoryId) {
      list = list.filter(p => (p.categoryId || p.category?.id) == categoryId);
    }
    setFiltered(list);
  };

  const goDetail = (id) => {
    if (user) {
      navigate(`/productos/${id}`);
    } else {
      navigate('/login', { state: { from: `/productos/${id}` } });
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">store</span>
            <h1 className="text-3xl font-bold text-gray-800">Catálogo de Productos</h1>
          </div>
          <p className="text-gray-600">Explora nuestros productos veterinarios</p>
          {!user && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="material-icons text-sm align-middle mr-1">info</span>
                Para comprar productos, por favor{' '}
                <Link to="/login" className="font-semibold underline hover:text-blue-900">
                  inicia sesión
                </Link>
                {' '}o{' '}
                <Link to="/registro" className="font-semibold underline hover:text-blue-900">
                  regístrate
                </Link>
              </p>
            </div>
          )}
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

        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}

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
    </div>
  );
};

export default ProductCatalogPublic;
