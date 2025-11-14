import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/icon_dog.svg';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email para recuperación:', email);
    setIsSubmitted(true);
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
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h5 className="text-xl font-semibold text-gray-800 mb-3">¿Olvidaste tu contraseña?</h5>
              <p className="text-gray-600 text-sm leading-relaxed">Ingresa tu correo y te enviaremos instrucciones para restablecerla.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                  placeholder="tu@correo.com"
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow">Enviar Instrucciones</button>
            </form>
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">¿Recordaste tu contraseña?{' '}<Link to="/login" className="text-teal font-semibold hover:underline">Iniciar Sesión</Link></p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="material-icons text-teal text-6xl mb-4">check_circle</span>
              <h5 className="text-xl font-semibold text-gray-800 mb-3">¡Correo enviado!</h5>
              <p className="text-gray-600 text-sm leading-relaxed">Hemos enviado las instrucciones a:</p>
              <p className="text-teal font-semibold break-all mt-2">{email}</p>
              <p className="text-gray-500 text-xs mt-4">Si no lo ves, revisa tu carpeta de spam o intenta nuevamente.</p>
            </div>
            <Link to="/login" className="w-full block text-center rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow">Volver al Inicio de Sesión</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default RecoverPassword;