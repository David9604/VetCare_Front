import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/ResetPassword.css';
import logo from '../assets/icon_dog.svg';
import M from 'materialize-css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Obtener el token del URL (ej: /restablecer-password?token=abc123)
  const token = searchParams.get('token');

  useEffect(() => {
    // Validar que el token existe
    if (!token) {
      M.toast({
        html: 'Token inválido o expirado',
        classes: 'red rounded',
        displayLength: 4000
      });
      // Opcional: redirigir a recuperar password
      // navigate('/recuperar-password');
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validatePassword = () => {
    const newErrors = {};

    // Validar longitud mínima
    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar que contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra mayúscula';
    }

    // Validar que contenga al menos un número
    if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un número';
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar contraseñas
    const validationErrors = validatePassword();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      M.toast({
        html: 'Por favor corrige los errores en el formulario',
        classes: 'red rounded',
        displayLength: 3000
      });
      return;
    }

    // Aquí irá la lógica para enviar al backend
    console.log('Nueva contraseña:', formData.password);
    console.log('Token:', token);

    // Simular éxito
    setIsSuccess(true);
    
    M.toast({
      html: '¡Contraseña actualizada exitosamente!',
      classes: 'teal rounded',
      displayLength: 4000
    });

    // Redirigir al login después de 3 segundos
    setTimeout(() => navigate('/login'), 3000);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card card">
        <div className="card-content">
          {/* Logo y título */}
          <div className="reset-header center-align">
            <div className="logo-container">
              <img src={logo} alt="VetCare Logo" className="reset-logo" />
            </div>
            <h4 className="grey-text text-darken-3">VetCare</h4>
          </div>

          {!isSuccess ? (
            <>
              {/* Título */}
              <div className="reset-welcome center-align">
                <h5 className="grey-text text-darken-3">Restablecer Contraseña</h5>
                <p className="grey-text">
                  Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit}>
                {/* Campo de nueva contraseña */}
                <div className="input-field password-field">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={errors.password ? 'invalid' : ''}
                  />
                  <label htmlFor="password">Nueva Contraseña</label>
                  <i 
                    className="material-icons password-toggle" 
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </i>
                  {errors.password && (
                    <span className="helper-text red-text">{errors.password}</span>
                  )}
                </div>

                {/* Campo de confirmar contraseña */}
                <div className="input-field password-field">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={errors.confirmPassword ? 'invalid' : ''}
                  />
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <i 
                    className="material-icons password-toggle" 
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </i>
                  {errors.confirmPassword && (
                    <span className="helper-text red-text">{errors.confirmPassword}</span>
                  )}
                </div>

                {/* Requisitos de contraseña */}
                <div className="password-requirements">
                  <p className="grey-text text-darken-1">
                    <small>
                      <strong>Requisitos de la contraseña:</strong>
                    </small>
                  </p>
                  <ul className="grey-text">
                    <li className={formData.password.length >= 8 ? 'teal-text' : ''}>
                      <small>• Mínimo 8 caracteres</small>
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'teal-text' : ''}>
                      <small>• Al menos una letra mayúscula</small>
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? 'teal-text' : ''}>
                      <small>• Al menos un número</small>
                    </li>
                  </ul>
                </div>

                {/* Botón de restablecer */}
                <button 
                  type="submit" 
                  className="btn waves-effect waves-light teal btn-large btn-block"
                >
                  Cambiar Contraseña
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Mensaje de éxito */}
              <div className="reset-success center-align">
                <i className="material-icons large teal-text">check_circle</i>
                <h5 className="grey-text text-darken-3">¡Contraseña Actualizada!</h5>
                <p className="grey-text">
                  Tu contraseña ha sido restablecida exitosamente. 
                  Serás redirigido al inicio de sesión en unos segundos.
                </p>
              </div>

              {/* Botón para ir al login */}
              <Link 
                to="/login" 
                className="btn waves-effect waves-light teal btn-large btn-block"
              >
                Ir al Inicio de Sesión
              </Link>
            </>
          )}

          {/* Enlace a login */}
          {!isSuccess && (
            <div className="reset-footer center-align">
              <p className="grey-text">
                ¿Recordaste tu contraseña?{' '}
                <Link to="/login" className="teal-text">
                  <strong>Iniciar Sesión</strong>
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;