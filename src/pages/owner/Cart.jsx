import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, clearCart, purchaseFromCart } from '../../api/products';
import CartItem from '../../components/CartItem';
import DashboardLayout from '../../components/DashboardLayout';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [localQuantities, setLocalQuantities] = useState({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
      // Inicializar cantidades locales
      const quantities = {};
      data.items?.forEach(item => {
        quantities[item.id] = item.quantity;
      });
      setLocalQuantities(quantities);
    } catch (e) {
      setError('Error cargando carrito');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleQuantityChange = (itemId, value) => {
    // Actualizar cantidad local sin llamar al backend
    setLocalQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleQuantityBlur = async (itemId) => {
    // Al perder el foco, actualizar en el backend si la cantidad es válida
    const quantity = localQuantities[itemId];
    const originalItem = cart.items.find(item => item.id === itemId);
    
    if (quantity === '' || quantity <= 0) {
      // Restaurar cantidad original si es inválida
      if (originalItem) {
        setLocalQuantities(prev => ({
          ...prev,
          [itemId]: originalItem.quantity
        }));
      }
      return;
    }

    // Validar stock disponible antes de actualizar
    if (originalItem && parseInt(quantity, 10) > originalItem.availableStock) {
      setError(`Stock insuficiente para ${originalItem.productName}. Disponible: ${originalItem.availableStock}`);
      // Restaurar cantidad original
      setLocalQuantities(prev => ({
        ...prev,
        [itemId]: originalItem.quantity
      }));
      // Limpiar error después de 5 segundos
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      const data = await updateCartItem(itemId, parseInt(quantity, 10));
      setCart(data);
      setError(null);
    } catch (e) {
      const errorMsg = e.response?.data || 'Error actualizando la cantidad del producto';
      setError(errorMsg);
      // Restaurar cantidad original en caso de error
      if (originalItem) {
        setLocalQuantities(prev => ({
          ...prev,
          [itemId]: originalItem.quantity
        }));
      }
      // Limpiar error después de 5 segundos
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const data = await removeCartItem(itemId);
      setCart(data);
    } catch (e) {
      alert('Error quitando item');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('¿Vaciar carrito?')) return;
    await clearCart();
    load();
  };

  const handlePurchase = async () => {
    if (!cart || cart.totalItems === 0) return;
    
    // Validar que todas las cantidades locales sean válidas
    const invalidItems = cart.items.filter(item => {
      const localQty = localQuantities[item.id];
      return !localQty || localQty === '' || localQty <= 0 || localQty > item.availableStock;
    });
    
    if (invalidItems.length > 0) {
      alert('Por favor, verifica que todas las cantidades sean válidas (mayor a 0 y no excedan el stock disponible)');
      return;
    }
    
    // Sincronizar todas las cantidades con el backend antes de comprar
    try {
      for (const item of cart.items) {
        const localQty = parseInt(localQuantities[item.id], 10);
        if (localQty !== item.quantity) {
          await updateCartItem(item.id, localQty);
        }
      }
    } catch (e) {
      alert('Error sincronizando cantidades');
      return;
    }
    
    setPurchasing(true);
    try {
      const purchase = await purchaseFromCart();
      alert(`Compra realizada. ID: ${purchase.id}`);
      await load();
    } catch (e) {
      alert('Error realizando compra');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">shopping_cart</span>
            <h1 className="text-3xl font-bold text-gray-800">Carrito de Compras</h1>
          </div>
          <p className="text-gray-600">Revisa tus productos antes de confirmar</p>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        )}
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
        
        {cart && cart.items && cart.items.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4 mb-6">
              {cart.items.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  quantity={localQuantities[item.id] || item.quantity}
                  onQuantityChange={handleQuantityChange}
                  onQuantityBlur={handleQuantityBlur}
                  onRemove={handleRemove} 
                />
              ))}
            </div>
            <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Items: <span className="font-medium">{cart.totalItems}</span></p>
                <p className="text-2xl font-bold text-gray-800">Total: ${cart.totalAmount}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleClear} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Vaciar
                </button>
                <button disabled={purchasing} onClick={handlePurchase} className="flex items-center gap-2 px-6 py-2 bg-teal hover:bg-teal-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  <span className="material-icons">check_circle</span>
                  {purchasing ? 'Procesando...' : 'Confirmar compra'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <span className="material-icons text-gray-300 text-6xl mb-4">shopping_cart</span>
              <p className="text-gray-600">Tu carrito está vacío</p>
              <a href="/productos" className="inline-block mt-4 text-teal hover:underline">Explorar productos</a>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default Cart;
