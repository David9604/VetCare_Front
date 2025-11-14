import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userApi, petApi, appointmentApi } from '../../api/services';

const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    owners: 0,
    pets: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
  });

  const navigation = [
    { path: '/employee/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/employee/pets', icon: 'pets', label: 'Mascotas' },
    { path: '/employee/appointments', icon: 'event', label: 'Citas' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, petsRes, apptRes] = await Promise.all([
          userApi.getAll(),
          petApi.getAll(),
          appointmentApi.getAll(),
        ]);
        const users = usersRes.data || [];
        const owners = users.filter(u => u.role === 'DUENO');
        const pets = petsRes.data || [];
        const appts = apptRes.data || [];
        const todayStr = new Date().toISOString().split('T')[0];
        const todayAppointments = appts.filter(a => (a.datetime || a.date)?.startsWith(todayStr)).length;
        const pendingAppointments = appts.filter(a => a.status === 'PENDIENTE').length;
        setStats({
          owners: owners.length,
          pets: pets.length,
          pendingAppointments,
          todayAppointments,
        });
      } catch (e) {
        // noop visual fallback handled by UI
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Empleado</h1>
        <p className="text-gray-600 mb-8">Resumen general del sistema</p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-icons text-teal">groups</span>
                <h3 className="text-sm font-medium text-gray-600">Dueños</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.owners}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-icons text-teal">pets</span>
                <h3 className="text-sm font-medium text-gray-600">Mascotas</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.pets}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-icons text-yellow-600">hourglass_empty</span>
                <h3 className="text-sm font-medium text-gray-600">Citas Pendientes</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingAppointments}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-icons text-blue-600">today</span>
                <h3 className="text-sm font-medium text-gray-600">Citas Hoy</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.todayAppointments}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
