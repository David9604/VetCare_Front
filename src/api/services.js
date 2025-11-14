import axiosInstance from './axios';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/users/register', userData),
  getProfile: () => axiosInstance.get('/auth/login'), // GET /api/auth/login obtiene usuario actual
  getCurrentUser: () => axiosInstance.get('/users/me'),
  logout: () => axiosInstance.post('/auth/logout'),
  updateProfile: (id, data) => axiosInstance.put(`/users/${id}`, data),
};

export const petApi = {
  getAll: () => axiosInstance.get('/pets'),
  getById: (id) => axiosInstance.get(`/pets/${id}`),
  create: (petData) => axiosInstance.post('/pets', petData),
  update: (id, petData) => axiosInstance.put(`/pets/${id}`, petData),
  remove: (id) => axiosInstance.delete(`/pets/${id}`),
};

export const appointmentApi = {
  getAll: () => axiosInstance.get('/appointments'),
  getAllAdmin: (params) => axiosInstance.get('/appointments/admin', { params }),
  getById: (id) => axiosInstance.get(`/appointments/${id}`),
  create: (appointmentData) => {
    // Transformar datetime a startDateTime y veterinarianId a assignedToId
    const payload = {
      petId: appointmentData.petId,
      serviceId: appointmentData.serviceId,
      assignedToId: appointmentData.veterinarianId || appointmentData.assignedToId,
      startDateTime: appointmentData.datetime || appointmentData.startDateTime,
      note: appointmentData.note || '',
    };
    return axiosInstance.post('/appointments', payload);
  },
  update: (id, appointmentData) => axiosInstance.put(`/appointments/${id}`, appointmentData),
  cancel: (id) => axiosInstance.put(`/appointments/${id}/cancel`),
  updateStatus: (id, status) => axiosInstance.put(`/appointments/${id}/status`, { status }),
  confirm: (id) => axiosInstance.put(`/appointments/${id}/status`, { status: 'ACCEPTED' }),
  complete: (id) => axiosInstance.put(`/appointments/${id}/status`, { status: 'COMPLETED' }),
};

export const serviceApi = {
  getAll: () => axiosInstance.get('/services'),
  getById: (id) => axiosInstance.get(`/services/${id}`),
  create: (serviceData) => axiosInstance.post('/admin/services', serviceData),
  update: (id, serviceData) => axiosInstance.put(`/admin/services/${id}`, serviceData),
  deactivate: (id) => axiosInstance.put(`/admin/services/${id}/deactivate`),
  remove: (id) => axiosInstance.delete(`/admin/services/${id}`),
  // Alias para compatibilidad
  delete: (id) => axiosInstance.delete(`/admin/services/${id}`),
};

// Los diagnósticos no están implementados en el backend actual
// export const diagnosisApi = {
//   getById: (id) => axiosInstance.get(`/diagnosis/${id}`),
//   create: (diagnosisData) => axiosInstance.post('/diagnosis', diagnosisData),
// };

export const userApi = {
  // Los endpoints de admin/users no están en el CSV, pero mantengo estructura básica
  getAll: () => axiosInstance.get('/users'), // Fallback, podría necesitar ajuste
  getById: (id) => axiosInstance.get(`/users/${id}`),
  update: (id, userData) => axiosInstance.put(`/users/${id}`, userData),
  // Endpoints de admin (por implementar en backend)
  updateRole: (id, role) => axiosInstance.put(`/admin/users/${id}/role`, { role }),
  activate: (id) => axiosInstance.put(`/admin/users/${id}/activate`),
  deactivate: (id) => axiosInstance.put(`/admin/users/${id}/deactivate`),
  resetPassword: (id) => axiosInstance.put(`/admin/users/${id}/reset-password`),
};
