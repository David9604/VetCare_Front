import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
// import { diagnosisApi } from '../../api/services'; // No disponible en backend actual
import { useAuth } from '../../context/AuthContext';

const VeterinarianDiagnosis = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [diagnoses, setDiagnoses] = useState([]);
  const [filters, setFilters] = useState({ date: '' });

  const navigation = [
    { path: '/veterinarian/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/veterinarian/appointments', icon: 'event', label: 'Citas' },
    { path: '/veterinarian/diagnoses', icon: 'medical_services', label: 'Diagnósticos' },
  ];

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      // Los diagnósticos no están implementados en el backend actual
      setDiagnoses([]);
    } catch (e) {
      setDiagnoses([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = diagnoses;
    if (filters.date) list = list.filter(d => (d.appointment?.datetime || d.createdAt || '').startsWith(filters.date));
    return list;
  }, [diagnoses, filters]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Diagnósticos</h1>
            <p className="text-gray-600 mt-2">Historial de diagnósticos realizados</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <span className="material-icons text-gray-300 text-6xl mb-4">medical_services</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay diagnósticos</h3>
            <p className="text-gray-600">No se encontraron diagnósticos con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(d => (
              <div key={d.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal">Diagnóstico</span>
                      <span className="text-sm text-gray-500">{new Date(d.appointment?.datetime || d.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{d.appointment?.pet?.name || 'Mascota'} — {d.appointment?.service?.name || 'Consulta'}</h3>
                    <p className="text-sm text-gray-600">Dueño: {d.appointment?.pet?.owner?.name || '—'}</p>
                    {d.observations && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Observaciones</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">{d.observations}</p>
                      </div>
                    )}
                    {d.treatment && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Tratamiento</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">{d.treatment}</p>
                      </div>
                    )}
                    {d.medications && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Medicamentos</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">{d.medications}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VeterinarianDiagnosis;
