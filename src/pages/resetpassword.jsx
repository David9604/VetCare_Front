import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/icon_dog.svg';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(token ? null : { type: 'error', message: 'Token inválido o expirado.' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (formData.password.length < 8) newErrors.password = 'Al menos 8 caracteres';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Falta una mayúscula';
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Falta un número';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'No coinciden';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      setFeedback({ type: 'error', message: 'Corrige los errores e intenta nuevamente.' });
      return;
    }
    console.log('Nueva contraseña:', formData.password, 'Token:', token);
    setIsSuccess(true);
    setFeedback({ type: 'success', message: '¡Contraseña actualizada! Redirigiendo...' });
    setTimeout(() => navigate('/login'), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center mb-4">
            <img src={logo} alt="VetCare Logo" className="w-12 h-12" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800">VetCare</h4>
        </div>
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <h5 className="text-xl font-semibold text-gray-800 mb-3">Restablecer Contraseña</h5>
              <p className="text-gray-600 text-sm leading-relaxed">Ingresa tu nueva contraseña y asegúrate de que cumpla los requisitos.</p>
            </div>
            {feedback && (
              <div className={`mb-6 text-sm rounded-md px-4 py-3 ${feedback.type === 'success' ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-600'}`}>{feedback.message}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
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
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={`w-full rounded-md border px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Repite la contraseña"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal" aria-label="Mostrar u ocultar confirmación">
                    <span className="material-icons text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-xs text-red-600">{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className="w-full rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow">Cambiar Contraseña</button>
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">Token: {token || 'No proporcionado'}</p>
              </div>
            </form>
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">¿Recordaste tu contraseña?{' '}<Link to="/login" className="text-teal font-semibold hover:underline">Iniciar Sesión</Link></p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="material-icons text-teal text-6xl mb-4">check_circle</span>
              <h5 className="text-xl font-semibold text-gray-800 mb-3">¡Contraseña Actualizada!</h5>
              <p className="text-gray-600 text-sm leading-relaxed">Serás redirigido al inicio de sesión en unos segundos.</p>
            </div>
            <Link to="/login" className="w-full block text-center rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow">Ir al Inicio de Sesión</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;