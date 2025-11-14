import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import RecoverPassword from './pages/recoverpassword';
import ResetPassword from './pages/resetpassword';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerPets from './pages/owner/Pets';
import OwnerAppointments from './pages/owner/Appointments';
import OwnerHistory from './pages/owner/History';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeePets from './pages/employee/Pets';
import EmployeeAppointments from './pages/employee/Appointments';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminServices from './pages/admin/Services';
import AdminAppointments from './pages/admin/Appointments';
import VeterinarianDashboard from './pages/veterinarian/Dashboard';
import VeterinarianAppointments from './pages/veterinarian/Appointments';
import VeterinarianDiagnosis from './pages/veterinarian/Diagnosis';
import Navbar from './components/navbar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/registro" element={<><Navbar /><Register /></>} />
          <Route path="/recuperar-password" element={<><Navbar /><RecoverPassword /></>} />
          <Route path="/restablecer-password" element={<><Navbar /><ResetPassword /></>} />

          {/* Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DUENO']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/pets"
            element={
              <ProtectedRoute allowedRoles={['DUENO']}>
                <OwnerPets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/appointments"
            element={
              <ProtectedRoute allowedRoles={['DUENO']}>
                <OwnerAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/history"
            element={
              <ProtectedRoute allowedRoles={['DUENO']}>
                <OwnerHistory />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['EMPLEADO']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/pets"
            element={
              <ProtectedRoute allowedRoles={['EMPLEADO']}>
                <EmployeePets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/appointments"
            element={
              <ProtectedRoute allowedRoles={['EMPLEADO']}>
                <EmployeeAppointments />
              </ProtectedRoute>
            }
          />

          {/* Veterinarian Routes */}
          <Route
            path="/veterinarian/dashboard"
            element={
              <ProtectedRoute allowedRoles={['VETERINARIO']}>
                <VeterinarianDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/veterinarian/appointments"
            element={
              <ProtectedRoute allowedRoles={['VETERINARIO']}>
                <VeterinarianAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/veterinarian/diagnoses"
            element={
              <ProtectedRoute allowedRoles={['VETERINARIO']}>
                <VeterinarianDiagnosis />
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen"><div className="text-center"><h1 className="text-3xl font-bold text-gray-800 mb-4">Acceso Denegado</h1><p className="text-gray-600">No tienes permisos para acceder a esta página</p></div></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;