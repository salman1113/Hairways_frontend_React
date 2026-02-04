import axios from 'axios';

// 1. BASE URL
// 1. BASE URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Attach Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 3. Response Interceptor (Handle 401 & Errors)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTH ---
export const loginUser = async (email, password) => {
  const response = await api.post('/accounts/login/', { email, password });
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

export const googleLogin = async (idToken) => {
  try {
    const response = await api.post('/accounts/google-login/', {
      id_token: idToken
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const registerUser = async (userData) => {
  const response = await api.post('/accounts/users/', userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/accounts/users/me/');
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

// --- ADMIN & SERVICES ---
export const getAdminStats = async () => {
  const response = await api.get('/bookings/bookings/stats/');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/services/categories/');
  return response.data;
};

// ... existing getCategories ...

export const createCategory = async (data) => {
  const response = await api.post('/services/categories/', data);
  return response.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/services/categories/${id}/`);
  return response.data;
};


export const getServices = async () => {
  const response = await api.get('/services/services/');
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post('/services/services/', serviceData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteService = async (id) => {
  await api.delete(`/services/services/${id}/`);
};

// --- EMPLOYEES & ATTENDANCE ---
export const getEmployees = async () => {
  const response = await api.get('/accounts/employees/');
  return response.data;
};

export const deleteEmployee = async (id) => {
  await api.delete(`/accounts/employees/${id}/`);
};

export const updateEmployee = async (id, data) => {
  const response = await api.patch(`/accounts/employees/${id}/`, data);
  return response.data;
};

export const punchAttendance = async () => {
  const response = await api.post('/accounts/attendance/punch/');
  return response.data;
};

export const getEmployeeAttendance = async (employeeId) => {
  const response = await api.get(`/accounts/attendance/?employee=${employeeId}`);
  return response.data;
};

// --- BOOKINGS & JOB TIMER ---
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings/bookings/', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/bookings/');
  return response.data;
};

// 🔥 FIX: Updated getQueue to accept Date Filter (Solves 500 Error)
export const getQueue = async (date) => {
  const url = date ? `/bookings/bookings/?date=${date}` : '/bookings/bookings/';
  const response = await api.get(url);
  return response.data;
};

export const updateBookingStatus = async (id, statusData) => {
  const response = await api.patch(`/bookings/bookings/${id}/`, statusData);
  return response.data;
};

export const startJob = async (id) => {
  const response = await api.post(`/bookings/bookings/${id}/start_job/`);
  return response.data;
};

export const finishJob = async (id) => {
  const response = await api.post(`/bookings/bookings/${id}/finish_job/`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.post(`/bookings/bookings/${id}/cancel_booking/`);
  return response.data;
};

export const rescheduleBooking = async (id) => {
  const response = await api.post(`/bookings/bookings/${id}/reschedule/`);
  return response.data;
};

// --- INVENTORY ---
export const getProducts = async () => {
  const response = await api.get('/services/products/');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/services/products/', productData);
  return response.data;
};

// Add inside src/services/api.js
export const updateService = async (id, serviceData) => {
  const response = await api.patch(`/services/services/${id}/`, serviceData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export default api;