import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { fetchAllPurchases, completePurchase, cancelPurchase } from '../../api/products';
import SearchableDropdown from '../../components/SearchableDropdown';

const SalesHistoryEmployee = () => {
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }),
    []
  );

  const load = async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const nextStatus = override.filters?.status ?? statusFilter;
      const nextStart = override.filters?.startDate ?? startDate;
      const nextEnd = override.filters?.endDate ?? endDate;
      const params = {
        page: override.page ?? pageInfo.page,
        size: pageInfo.size,
        status: nextStatus || undefined,
        startDate: nextStart || undefined,
        endDate: nextEnd || undefined,
      };
      const data = await fetchAllPurchases(params);
      setItems(data.content || []);
      setPageInfo({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (e) {
      setError('Error cargando ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePage = (delta) => {
    const next = pageInfo.page + delta;
    if (next < 0 || next >= pageInfo.totalPages) return;
    load({ page: next });
  };

  const handleComplete = async (id) => {
    if (!window.confirm('¿Marcar venta como completada?')) return;
    try {
      await completePurchase(id);
      load();
    } catch {
      alert('Error completando');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar venta?')) return;
    try {
      await cancelPurchase(id);
      load();
    } catch {
      alert('Error cancelando');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">receipt_long</span>
            <h1 className="text-3xl font-bold text-gray-800">Historial de Ventas</h1>
          </div>
          <p className="text-gray-600">Consulta ventas registradas en el sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <SearchableDropdown
                options={[
                  { id: '', name: 'Todos' },
                  { id: 'PENDING', name: 'Pending' },
                  { id: 'COMPLETED', name: 'Completed' },
                  { id: 'CANCELLED', name: 'Cancelled' },
                ]}
                value={statusFilter}
                onChange={(val) => {
                  const next = val ?? '';
                  setStatusFilter(next);
                  load({
                    page: 0,
                    filters: { status: next, startDate, endDate },
                  });
                }}
                placeholder="Estado de venta"
                valueKey="id"
                getOptionLabel={(opt) => opt?.name || ''}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const next = e.target.value;
                  setStartDate(next);
                  load({
                    page: 0,
                    filters: { status: statusFilter, startDate: next, endDate },
                  });
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  const next = e.target.value;
                  setEndDate(next);
                  load({
                    page: 0,
                    filters: { status: statusFilter, startDate, endDate: next },
                  });
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
          </div>
        </div>
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="px-4 py-3">
                      <span className="material-icons inline align-middle text-base mr-2">tag</span>
                      ID
                    </th>
                    <th className="px-4 py-3">
                      <span className="material-icons inline align-middle text-base mr-2">event</span>
                      Fecha
                    </th>
                    <th className="px-4 py-3">
                      <span className="material-icons inline align-middle text-base mr-2">person</span>
                      Cliente
                    </th>
                    <th className="px-4 py-3">
                      <span className="material-icons inline align-middle text-base mr-2">attach_money</span>
                      Total
                    </th>
                    <th className="px-4 py-3">
                      <span className="material-icons inline align-middle text-base mr-2">check_circle</span>
                      Estado
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="material-icons inline align-middle text-base mr-2">tune</span>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No hay ventas que coincidan con los filtros.
                      </td>
                    </tr>
                  )}
                  {items.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">#{p.id}</td>
                      <td className="px-4 py-3">{new Date(p.purchaseDate).toLocaleString()}</td>
                      <td className="px-4 py-3">{p.userEmail || `ID: ${p.userId}`}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{currencyFormatter.format(p.totalAmount || 0)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            p.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : p.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.status === 'PENDING' ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleComplete(p.id)}
                              className="px-3 py-1.5 text-xs font-medium text-green-700 border border-green-300 rounded-md bg-green-50 hover:bg-green-100 transition-colors"
                            >
                              Completar
                            </button>
                            <button
                              onClick={() => handleCancel(p.id)}
                              className="px-3 py-1.5 text-xs font-medium text-red-700 border border-red-300 rounded-md bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div>
                Página {pageInfo.page + 1} de {pageInfo.totalPages} &bull; {pageInfo.totalElements} ventas
              </div>
              <div className="flex gap-2">
                <button onClick={() => changePage(-1)} disabled={pageInfo.page === 0} className="px-3 py-1 border rounded disabled:opacity-40">
                  Anterior
                </button>
                <button
                  onClick={() => changePage(1)}
                  disabled={pageInfo.page + 1 >= pageInfo.totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SalesHistoryEmployee;
