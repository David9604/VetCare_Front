import axios from 'axios';

// En desarrollo, usar proxy de Vite (/api)
// En producción, usar variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Incluir cookies automáticamente
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
