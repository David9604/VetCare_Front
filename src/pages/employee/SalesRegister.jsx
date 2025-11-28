import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { fetchProducts, manualPurchase, fetchCategories } from '../../api/products';
import SearchableDropdown from '../../components/SearchableDropdown';
import axios from '../../api/axios';

const SalesRegisterEmployee = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [draftItems, setDraftItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [owners, setOwners] = useState([]);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [list, cats] = await Promise.all([
        fetchProducts({ active: true }),
        fetchCategories().catch(() => []),
      ]);
      setProducts(list);
      setFiltered(list);
      setCategories(cats);
      // Cargar usuarios (Owners). Backend devuelve todos los usuarios, filtramos por rol OWNER.
      try {
        const { data: allUsers } = await axios.get('/users');
        setOwners(
          allUsers.filter((u) => {
            const isOwner = (u.role || u.roles?.includes?.('OWNER')) === 'OWNER';
            const allowInactive = u.email === 'consumidor.final@sistema.local';
            const isActive = u.active !== false || allowInactive;
            return isOwner && isActive;
          }),
        );
      } catch {}
    } catch (e) {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const applyFilters = (textValue = search, categoryValue = categoryFilter) => {
    const normalizedSearch = textValue.toLowerCase();
    const filteredList = products.filter((p) => {
      const matchesSearch =
        !normalizedSearch ||
        p.name.toLowerCase().includes(normalizedSearch) ||
        p.description.toLowerCase().includes(normalizedSearch);
      const catId = p.categoryId || p.category?.id;
      const matchesCategory = !categoryValue || String(catId) === String(categoryValue);
      const isActive = p.active !== false;
      return matchesSearch && matchesCategory && isActive;
    });
    setFiltered(filteredList);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    applyFilters(value, categoryFilter);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    applyFilters(search, value);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const addLine = (product) => {
    setDraftItems(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };
  const updateQuantity = (productId, qty) => {
    setDraftItems(items => items.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  };
  const removeLine = (productId) => setDraftItems(items => items.filter(i => i.productId !== productId));

  const total = draftItems.reduce((acc, it) => acc + (it.quantity * (parseFloat(it.price) || 0)), 0);

  const submit = async (e) => {
    e.preventDefault();
    setSuccess(null); setError(null);
    if (!userId) { setError('Debe indicar ID de cliente'); return; }
    if (draftItems.length === 0) { setError('Debe agregar al menos un producto'); return; }
    setSending(true);
    try {
      const payload = {
        userId: parseInt(userId, 10),
        items: draftItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod,
        notes: notes || ''
      };
      const resp = await manualPurchase(payload);
      setSuccess(`Venta registrada (#${resp.id})`);
      setDraftItems([]);
      setNotes('');
      setPaymentMethod('CASH');
    } catch (e2) {
      setError('Error registrando venta');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">point_of_sale</span>
            <h1 className="text-3xl font-bold text-gray-800">Registro de Venta Presencial</h1>
          </div>
          <p className="text-gray-600">Registra ventas para clientes en mostrador</p>
        </div>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{error}</div>}
        {success && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center space-y-4">
              <span className="material-icons text-5xl text-green-500">check_circle</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Venta registrada</h2>
                <p className="text-gray-600">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="px-6 py-2 bg-teal text-white rounded-lg shadow-teal-sm hover:shadow-teal-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <span className="material-icons text-teal">inventory_2</span> Productos Disponibles
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Buscar productos"
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-56 pl-10 focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
                <SearchableDropdown
                  options={[
                    { id: '', name: 'Todas las categorías' },
                    ...categories.filter((c) => c.active !== false),
                  ]}
                  value={categoryFilter}
                  onChange={(val) => handleCategoryChange(val || '')}
                  placeholder="Categoría"
                  getOptionLabel={(option) => option?.name || ''}
                  valueKey="id"
                  className="w-60"
                />
              </div>
            </div>
          {loading && <p className="text-sm text-gray-500">Cargando...</p>}
          {!loading && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => addLine(p)}
                  className="text-left border rounded-lg p-3 hover:border-teal focus:outline-none"
                >
                  <p className="font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">${parseFloat(p.price).toFixed(2)}</p>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-sm text-gray-500 col-span-full">Sin productos</p>}
            </div>
          )}
        </div>
        
        <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (Owner)</label>
              <SearchableDropdown
                options={[
                  { id: '', name: '-- Seleccionar Owner --' },
                  ...owners.map((o) => ({
                    id: String(o.id),
                    name: `${o.name || o.email} (#${o.id})`,
                  })),
                ]}
                value={userId ? String(userId) : ''}
                onChange={(val) => setUserId(val || '')}
                placeholder="Selecciona un owner"
                valueKey="id"
                getOptionLabel={(opt) => opt?.name || ''}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
              <SearchableDropdown
                options={[
                  { id: 'CASH', name: 'Efectivo' },
                  { id: 'CARD', name: 'Tarjeta' },
                  { id: 'TRANSFER', name: 'Transferencia' },
                  { id: 'OTHER', name: 'Otro' },
                ]}
                value={paymentMethod}
                onChange={(val) => setPaymentMethod(val || 'CASH')}
                placeholder="Selecciona un método"
                valueKey="id"
                getOptionLabel={(opt) => opt?.name || ''}
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 flex items-center gap-2"><span className="material-icons text-sm text-teal">shopping_cart</span> Selección</h3>
              {draftItems.length > 0 && (
                <button type="button" onClick={() => setDraftItems([])} className="text-xs text-red-600 hover:underline">Vaciar</button>
              )}
            </div>
            <div className="space-y-2">
              {draftItems.map(line => (
                <div key={line.productId} className="flex gap-2 items-center border rounded-lg px-3 py-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{line.name}</p>
                    <p className="text-xs text-gray-500">${parseFloat(line.price).toFixed(2)} c/u</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => updateQuantity(line.productId, parseInt(e.target.value, 10) || 1)}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  />
                  <p className="text-sm font-medium w-24 text-right">${(line.quantity * parseFloat(line.price)).toFixed(2)}</p>
                  <button type="button" onClick={() => removeLine(line.productId)} className="text-red-600 hover:text-red-700">
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
              ))}
              {draftItems.length === 0 && <p className="text-sm text-gray-500">No hay productos seleccionados.</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" maxLength={500} rows={3} placeholder="Notas adicionales (opcional)" />
          </div>
          
          <div className="flex justify-between items-center border-t pt-4">
            <p className="text-sm text-gray-600">Total: <span className="font-semibold">${total.toFixed(2)}</span></p>
            <button disabled={sending} type="submit" className="flex items-center gap-2 bg-teal hover:bg-teal-dark disabled:opacity-60 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              <span className="material-icons">receipt</span>
              {sending ? 'Registrando...' : 'Registrar Venta'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SalesRegisterEmployee;
