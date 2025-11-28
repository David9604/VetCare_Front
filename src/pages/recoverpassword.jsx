import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/icon_dog.svg';
import { authApi } from '../api/services';

const steps = {
  EMAIL: 'email',
  OTP: 'otp',
  RESET: 'reset',
  DONE: 'done',
};

const stepConfig = [
  { id: steps.EMAIL, label: 'Correo' },
  { id: steps.OTP, label: 'Código OTP' },
  { id: steps.RESET, label: 'Nueva contraseña' },
  { id: steps.DONE, label: 'Completado' },
];

const RecoverPassword = () => {
  const [step, setStep] = useState(steps.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      match: confirmPassword.length > 0 && newPassword === confirmPassword,
    }),
    [newPassword, confirmPassword]
  );

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    (typeof error?.response?.data === 'string' ? error.response.data : null) ||
    'Ocurrió un error. Intenta nuevamente.';

  const getPasswordError = (value = '') => {
    if (!value) return '';
    if (value.length < 8) return 'Debe tener mínimo 8 caracteres.';
    if (!/[A-Z]/.test(value)) return 'Debe incluir al menos una mayúscula.';
    if (!/\d/.test(value)) return 'Debe incluir al menos un número.';
    return '';
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    const trimmedEmail = email.trim();
    setFieldErrors((prev) => ({ ...prev, email: '' }));

    if (!trimmedEmail) {
      setFieldErrors((prev) => ({ ...prev, email: 'El correo es obligatorio.' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Ingresa un correo válido.' }));
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(trimmedEmail);
      setStep(steps.OTP);
      setFeedback({ type: 'success', message: 'Enviamos el código OTP a tu correo.' });
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    const trimmedOtp = otp.trim();
    setFieldErrors((prev) => ({ ...prev, otp: '' }));

    if (!/^\d{6}$/.test(trimmedOtp)) {
      setFieldErrors((prev) => ({ ...prev, otp: 'Ingresa el código de 6 dígitos que recibiste.' }));
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOtp({ email: email.trim(), otp: trimmedOtp });
      setStep(steps.RESET);
      setFeedback({ type: 'success', message: 'Código verificado. Crea tu nueva contraseña.' });
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setFieldErrors((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));

    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setFieldErrors((prev) => ({ ...prev, newPassword: passwordError }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden.',
      }));
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });
      setStep(steps.DONE);
      setFeedback({ type: 'success', message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return;
    setFeedback({ type: '', message: '' });
    setFieldErrors((prev) => ({ ...prev, otp: '' }));
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setFeedback({ type: 'success', message: 'Reenviamos el OTP. Revisa tu bandeja.' });
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case steps.EMAIL:
        return (
          <>
            <div className="text-center mb-8">
              <h5 className="text-xl font-semibold text-gray-800 mb-3">¿Olvidaste tu contraseña?</h5>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ingresa el correo asociado a tu cuenta para enviarte un código de verificación (OTP).
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }
                  }}
                  required
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                />
                {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿Recordaste tu contraseña?{' '}
                <Link to="/login" className="text-teal font-semibold hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </>
        );
      case steps.OTP:
        return (
          <>
            <div className="text-center mb-8">
              <h5 className="text-xl font-semibold text-gray-800 mb-2">Verifica tu código</h5>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ingresá el código de 6 dígitos que enviamos a <span className="text-teal font-semibold">{email}</span>.
              </p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Código OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (fieldErrors.otp) {
                      setFieldErrors((prev) => ({ ...prev, otp: '' }));
                    }
                  }}
                  required
                  className="tracking-widest text-center rounded-md border border-gray-300 px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                  placeholder="• • • • • •"
                />
                {fieldErrors.otp && <p className="text-xs text-red-600 mt-1">{fieldErrors.otp}</p>}
              </div>
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verificando...' : 'Continuar'}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={resendOtp}
                  className="w-full rounded-lg border border-gray-200 h-12 text-gray-700 font-semibold text-sm hover:border-teal hover:text-teal transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          </>
        );
      case steps.RESET:
        return (
          <>
            <div className="text-center mb-8">
              <h5 className="text-xl font-semibold text-gray-800 mb-2">Crea tu nueva contraseña</h5>
              <p className="text-gray-600 text-sm leading-relaxed">La usaremos para iniciar sesión en VetCare.</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewPassword(value);
                      setFieldErrors((prev) => ({
                        ...prev,
                        newPassword: getPasswordError(value),
                        confirmPassword:
                          confirmPassword && value !== confirmPassword ? 'Las contraseñas no coinciden.' : '',
                      }));
                    }}
                    required
                    minLength={8}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal"
                    aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <span className="material-icons text-xl">
                      {showNewPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {fieldErrors.newPassword && <p className="text-xs text-red-600 mt-1">{fieldErrors.newPassword}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setConfirmPassword(value);
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword:
                          value && newPassword !== value ? 'Las contraseñas no coinciden.' : '',
                      }));
                    }}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal"
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <span className="material-icons text-xl">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>}
              </div>
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li className={`${passwordChecks.length ? 'text-teal' : ''}`}>• Mínimo 8 caracteres</li>
                <li className={`${passwordChecks.uppercase ? 'text-teal' : ''}`}>• Una letra mayúscula</li>
                <li className={`${passwordChecks.number ? 'text-teal' : ''}`}>• Un número</li>
                <li className={`${passwordChecks.match ? 'text-teal' : ''}`}>• Coincidir con la confirmación</li>
              </ul>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Actualizando...' : 'Guardar contraseña'}
              </button>
            </form>
          </>
        );
      case steps.DONE:
      default:
        return (
          <>
            <div className="text-center mb-8">
              <span className="material-icons text-teal text-6xl mb-4">check_circle</span>
              <h5 className="text-xl font-semibold text-gray-800 mb-3">¡Todo listo!</h5>
              <p className="text-gray-600 text-sm leading-relaxed">
                Actualizaste la contraseña de <span className="text-teal font-semibold">{email}</span>. Ya puedes iniciar sesión.
              </p>
            </div>
            <Link
              to="/login"
              className="w-full block text-center rounded-lg bg-teal h-12 text-white font-semibold text-sm shadow-teal-sm hover:shadow-teal-lg transition-shadow"
            >
              Ir al inicio de sesión
            </Link>
          </>
        );
    }
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

        <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-500 mb-8">
          {stepConfig.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full border ${
                    item.id === step || stepConfig.findIndex((cfg) => cfg.id === step) > index
                      ? 'bg-teal text-white border-teal'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-[11px] uppercase tracking-wide">{item.label}</span>
              </div>
              {index < stepConfig.length - 1 && <div className="h-px flex-1 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        {feedback.message && (
          <div
            className={`mb-6 rounded-md border px-4 py-3 text-sm ${
              feedback.type === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
};

export default RecoverPassword;