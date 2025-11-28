import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, addToCart } from '../../api/products';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (e) {
        setError(e.message || 'Error cargando detalle');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAdd = async () => {
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setSuccessMessage(`${product.name} agregado al carrito exitosamente`);
      setError(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e) {
      setError(e.response?.data || 'Error al agregar al carrito. Por favor intenta de nuevo.');
      setSuccessMessage(null);
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-teal hover:text-teal-dark mb-6">
          <span className="material-icons">arrow_back</span>
          <span>Volver</span>
        </button>
        
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
        {successMessage && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg mb-4">
            <span className="material-icons">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        )}
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}
        
        {product && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {product.image && (
                <div className="md:w-1/2 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto rounded-md object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
                <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-teal/10 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">Precio</p>
                    <p className="text-2xl font-bold text-teal">${product.price}</p>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">Stock</p>
                    <p className="text-2xl font-bold text-gray-800">{product.stock}</p>
                  </div>
                </div>
                
                {!product.active && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
                    <span className="material-icons text-sm mr-2">info</span>
                    Producto no disponible
                  </div>
                )}
                
                {role === 'OWNER' && product.active && product.stock > 0 && (
                  <button onClick={handleAdd} className="flex items-center gap-2 bg-teal hover:bg-teal-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    <span className="material-icons">shopping_cart</span>
                    Agregar al carrito
                  </button>
                )}
                {role === 'VETERINARIAN' && (
                  <p className="text-sm text-gray-500 italic mt-4">(Funcionalidad "Recomendar" pendiente de definición)</p>
                )}
                {(role === 'ADMIN' || role === 'EMPLOYEE') && (
                  <p className="text-sm text-gray-500 italic mt-4">(Botón editar gestionado desde vista de administración)</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Detail;
