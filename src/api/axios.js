import axios from 'axios';

// Base URL:
// - Desarrollo: proxy Vite -> '/api' (ver vite.config.js)
// - Producción: variable de entorno VITE_API_URL (definida en .env.production)
// Fallback explícito al backend desplegado si la variable está ausente.
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://api.vetcareservices.online/api');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enviar cookies para sesiones basadas en JSESSIONID / Spring Security
});

// Con cookies, no necesitamos agregar tokens manualmente
// Las cookies se envían automáticamente con withCredentials: true

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cookie expirada o inválida, limpiar datos locales
      localStorage.removeItem('user');
      // Solo redirigir si no estamos ya en login o registro
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
