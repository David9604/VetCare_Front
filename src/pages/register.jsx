import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import logo from '../assets/icon_dog.svg';
import M from 'materialize-css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre (mínimo 3 caracteres)
    if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    // Validar teléfono (10 dígitos)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    // Validar dirección
    if (formData.address.trim().length < 10) {
      newErrors.address = 'La dirección debe tener al menos 10 caracteres';
    }

    // Validar contraseña
    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra mayúscula';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un número';
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      M.toast({
        html: 'Por favor corrige los errores en el formulario',
        classes: 'red rounded',
        displayLength: 3000
      });
      return;
    }

    // Preparar datos para enviar al backend
    const userData = {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      phone: formData.phone,
      address: formData.address.trim(),
      role: 1, // DUEÑO por defecto
      active: true
    };

    console.log('Datos a enviar:', userData);

    // Aquí irá la llamada al backend
    // try {
    //   const response = await axios.post('/api/users/register', userData);
    //   M.toast({
    //     html: '¡Registro exitoso! Redirigiendo...',
    //     classes: 'teal rounded',
    //     displayLength: 3000
    //   });
    //   setTimeout(() => navigate('/login'), 2000);
    // } catch (error) {
    //   M.toast({
    //     html: error.response?.data?.message || 'Error al registrar usuario',
    //     classes: 'red rounded',
    //     displayLength: 4000
    //   });
    // }

    // Simulación de éxito
    M.toast({
      html: '¡Registro exitoso! Redirigiendo al inicio de sesión...',
      classes: 'teal rounded',
      displayLength: 3000
    });
    setTimeout(() => navigate('/login'), 2000);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card card">
        <div className="card-content">
          {/* Logo y título */}
          <div className="register-header center-align">
            <div className="logo-container">
              <img src={logo} alt="VetCare Logo" className="register-logo" />
            </div>
            <h4 className="grey-text text-darken-3">VetCare</h4>
          </div>

          {/* Título de registro */}
          <div className="register-welcome center-align">
            <h5 className="grey-text text-darken-3">Crea tu cuenta</h5>
            <p className="grey-text">Completa el formulario para registrarte en VetCare</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Campo de nombre */}
            <div className="input-field">
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={errors.name ? 'invalid' : ''}
              />
              <label htmlFor="name">Nombre Completo</label>
              {errors.name && (
                <span className="helper-text red-text">{errors.name}</span>
              )}
            </div>

            {/* Campo de email */}
            <div className="input-field">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                className={errors.email ? 'invalid' : ''}
              />
              <label htmlFor="email">Correo Electrónico</label>
              {errors.email && (
                <span className="helper-text red-text">{errors.email}</span>
              )}
            </div>

            {/* Campo de teléfono */}
            <div className="input-field">
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                maxLength="10"
                className={errors.phone ? 'invalid' : ''}
              />
              <label htmlFor="phone">Teléfono (10 dígitos)</label>
              {errors.phone && (
                <span className="helper-text red-text">{errors.phone}</span>
              )}
            </div>

            {/* Campo de dirección */}
            <div className="input-field">
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={errors.address ? 'invalid' : ''}
              />
              <label htmlFor="address">Dirección</label>
              {errors.address && (
                <span className="helper-text red-text">{errors.address}</span>
              )}
            </div>

            {/* Campo de contraseña */}
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
              <label htmlFor="password">Contraseña</label>
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
                <small><strong>Requisitos de la contraseña:</strong></small>
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

            {/* Botón de registro */}
            <button 
              type="submit" 
              className="btn waves-effect waves-light teal btn-large btn-block"
            >
              Registrarse
            </button>
          </form>

          {/* Enlace a login */}
          <div className="register-footer center-align">
            <p className="grey-text">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="teal-text">
                <strong>Iniciar Sesión</strong>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;