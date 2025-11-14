import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/icon_dog.svg';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', confirmEmail: '', password: '', confirmPassword: '', phone: '', confirmPhone: '', address: ''
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.trim().length < 3) newErrors.name = 'Mínimo 3 caracteres';
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Correo inválido';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Los correos no coinciden';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Teléfono debe tener 10 dígitos';
    if (formData.phone !== formData.confirmPhone) newErrors.confirmPhone = 'Los teléfonos no coinciden';
    if (formData.address.trim().length < 10) newErrors.address = 'Mínimo 10 caracteres';
    if (formData.password.length < 8) newErrors.password = 'Al menos 8 caracteres';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Falta una mayúscula';
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Falta un número';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'No coinciden';
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setFeedback({ type: 'error', message: 'Corrige los errores e intenta nuevamente.' });
      return;
    }
    
    const userData = { ...formData, role: 1, active: true };
    console.log('Registro:', userData);
    
    try {
      // Importar authApi
      const { authApi } = await import('../api/services');
      const response = await authApi.register(userData);
      console.log('Registro exitoso:', response.data);
      setFeedback({ type: 'success', message: '¡Registro exitoso! Redirigiendo...' });
      setTimeout(() => navigate('/login'), 1800);
    } catch (error) {
      console.error('Error en registro:', error);
      console.error('Error response:', error.response?.data);
      setFeedback({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al registrar usuario. Intenta nuevamente.' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center mb-4">
            <img src={logo} alt="VetCare Logo" className="w-12 h-12" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800">VetCare</h4>
        </div>
        <div className="text-center mb-8">
          <h5 className="text-xl font-semibold text-gray-800 mb-2">Crea tu cuenta</h5>
          <p className="text-gray-600 text-sm">Completa el formulario para registrarte</p>
        </div>
        {feedback && (
          <div className={`mb-6 text-sm rounded-md px-4 py-3 ${feedback.type === 'success' ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-600'}`}>{feedback.message}</div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required
              className={`rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Tu nombre"
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required
              className={`rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmEmail" className="text-sm font-medium text-gray-700">Confirmar Correo Electrónico</label>
            <input
              id="confirmEmail" name="confirmEmail" type="email" value={formData.confirmEmail} onChange={handleInputChange} required
              className={`rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.confirmEmail ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Repite tu correo"
            />
            {errors.confirmEmail && <span className="text-xs text-red-600">{errors.confirmEmail}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Teléfono</label>
            <input
              id="phone" name="phone" type="tel" maxLength={10} value={formData.phone} onChange={handleInputChange} required
              className={`rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="3101234567"
            />
            {errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPhone" className="text-sm font-medium text-gray-700">Confirmar Teléfono</label>
            <input
              id="confirmPhone" name="confirmPhone" type="tel" maxLength={10} value={formData.confirmPhone} onChange={handleInputChange} required
              className={`rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.confirmPhone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Repite tu teléfono"
            />
            {errors.confirmPhone && <span className="text-xs text-red-600">{errors.confirmPhone}</span>}
          </div>
            <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección</label>
            <input
              id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} required
              className={`rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Dirección completa"
            />
            {errors.address && <span className="text-xs text-red-600">{errors.address}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} required
                className={`w-full rounded-md border px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal" aria-label="Mostrar u ocultar contraseña">
                <span className="material-icons text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
            <ul className="mt-2 space-y-1 text-xs text-gray-500">
              <li className={`${formData.password.length >= 8 ? 'text-teal' : ''}`}>• Mínimo 8 caracteres</li>
              <li className={`${/[A-Z]/.test(formData.password) ? 'text-teal' : ''}`}>• Una letra mayúscula</li>
              <li className={`${/[0-9]/.test(formData.password) ? 'text-teal' : ''}`}>• Un número</li>
            </ul>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <div className="relative">
              <input
                id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} required
                className={`w-full rounded-md border px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Repite la contraseña"
              />
              <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal" aria-label="Mostrar u ocultar confirmación">
                <span className="material-icons text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {errors.confirmPassword && <span className="text-xs text-red-600">{errors.confirmPassword}</span>}
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow">Registrarse</button>
          </div>
        </form>
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">¿Ya tienes una cuenta?{' '}<Link to="/login" className="text-teal font-semibold hover:underline">Iniciar Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;