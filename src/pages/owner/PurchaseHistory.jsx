import React, { useEffect, useState } from 'react';
import { fetchMyPurchases } from '../../api/products';
import DashboardLayout from '../../components/DashboardLayout';

const PurchaseHistory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const size = 10;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageData = await fetchMyPurchases({ page, size, sort: 'purchaseDate,desc' });
      setData(pageData);
    } catch (e) {
      setError('Error cargando historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">receipt_long</span>
            <h1 className="text-3xl font-bold text-gray-800">Historial de Compras</h1>
          </div>
          <p className="text-gray-600">Revisa todas tus compras realizadas</p>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        )}
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
        
        {data && data.content && data.content.length > 0 ? (
          <div className="space-y-4">
            {data.content.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-800">Compra #{p.id}</span>
                    <p className="text-sm text-gray-500 mt-1">{new Date(p.purchaseDate).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{p.status}</span>
                </div>
                <p className="text-xl font-bold text-teal mb-3">Total: ${p.totalAmount}</p>
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Productos:</p>
                  <ul className="space-y-1">
                    {p.items.map(it => (
                      <li key={it.id} className="text-sm text-gray-600 flex justify-between">
                        <span>{it.productName} x {it.quantity}</span>
                        <span className="font-medium">${it.subtotal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {p.notes && <p className="text-xs text-gray-500 mt-3 italic border-t pt-2">Notas: {p.notes}</p>}
              </div>
            ))}
            <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
              <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))} className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <span className="material-icons text-sm">chevron_left</span>
                Anterior
              </button>
              <span className="text-sm text-gray-600">Página {page + 1} de {data.totalPages}</span>
              <button disabled={data.last} onClick={() => setPage(p => p + 1)} className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                Siguiente
                <span className="material-icons text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <span className="material-icons text-gray-300 text-6xl mb-4">receipt</span>
              <p className="text-gray-600">No hay compras registradas.</p>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default PurchaseHistory;
