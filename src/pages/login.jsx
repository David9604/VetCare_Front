import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/icon_dog.svg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await login(formData.email, formData.password);
      // Navigate based on user role (handled in AuthContext)
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        switch (user.role) {
          case 'DUENO':
            navigate('/owner/dashboard');
            break;
          case 'EMPLEADO':
            navigate('/employee/dashboard');
            break;
          case 'VETERINARIO':
            navigate('/veterinarian/dashboard');
            break;
          case 'ADMINISTRADOR':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);
      setFeedback({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center mb-4">
            <img src={logo} alt="VetCare Logo" className="w-12 h-12" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800">VetCare</h4>
        </div>
        <div className="text-center mb-8">
          <h5 className="text-xl font-semibold text-gray-800 mb-2">Bienvenido de nuevo</h5>
          <p className="text-gray-600 text-sm">Accede a tu cuenta para gestionar la clínica.</p>
        </div>
        {feedback && (
          <div className={`mb-4 text-sm rounded-md px-4 py-3 ${feedback.type === 'success' ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-600'}`}>{feedback.message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
              placeholder="tu@correo.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal focus:outline-none"
                aria-label="Mostrar u ocultar contraseña"
              >
                <span className="material-icons text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          <div className="text-right -mt-2">
            <Link to="/recuperar-password" className="text-sm font-medium text-teal hover:underline">¿Olvidaste tu contraseña?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">¿No tienes una cuenta?{' '}<Link to="/registro" className="text-teal font-semibold hover:underline">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;