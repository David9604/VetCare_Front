import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/services';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          // Verificar si la cookie sigue válida
          const userResponse = await authApi.getCurrentUser();
          setUser(userResponse.data);
        } catch (error) {
          // Cookie expirada o inválida, limpiar datos
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    console.log('Login attempt:', { email, password });
    
    // Probar diferentes formatos de datos
    const credentials = { email, password };
    console.log('Sending credentials:', credentials);
    console.log('Request URL will be:', '/auth/login');
    
    try {
      const response = await authApi.login(credentials);
      console.log('Login successful!');
      console.log('Login response:', response.data);
      console.log('Response headers:', response.headers);
      
      // Con cookies, el login solo confirma las credenciales
      // La cookie se guarda automáticamente por el navegador
      
      // Obtener datos del usuario con GET /api/users/me
      const userResponse = await authApi.getCurrentUser();
      console.log('User profile response:', userResponse.data);
      
      // Solo guardamos los datos del usuario, no tokens
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      console.error('Login failed with error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Llamar al endpoint de logout para limpiar la cookie del servidor
      await authApi.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    }
    // Limpiar datos locales
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
