import axios from 'axios';

// 1. BASE URL Configuration
const API_URL = 'http://192.168.220.86:8000/api/v1';

// 2. Create Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor (To add Token automatically)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


// --- API FUNCTIONS ---

// 🔐 AUTHENTICATION
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/accounts/login/', { email, password });
    // Save tokens locally
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login Failed";
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/accounts/users/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration Failed";
  }
};


export const getUserProfile = async () => {
  try {
    // ജാങ്കോയിൽ യൂസർ ഡാറ്റ കിട്ടാനുള്ള എൻഡ്‌പോയിന്റ്
    // (ശ്രദ്ധിക്കുക: Backend-ൽ 'me' action സെറ്റ് ചെയ്തിട്ടുണ്ടെന്ന് കരുതുന്നു)
    const response = await api.get('/accounts/users/me/'); 
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch profile";
  }
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};


// ✂️ SERVICES
export const getCategories = async () => {
  const response = await api.get('/services/categories/');
  return response.data;
};

export const getServices = async () => {
  const response = await api.get('/services/services/');
  return response.data;
};


// 📅 BOOKINGS
export const createBooking = async (bookingData) => {
  // Booking Data Format: { employee: id, items: [{service: id, price: 100}] }
  const response = await api.post('/bookings/bookings/', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  // This will fetch logged-in user's bookings
  const response = await api.get('/bookings/bookings/'); 
  return response.data;
};


// ⏱️ LIVE QUEUE (Bonus)
export const getQueueStatus = async () => {
  const response = await api.get('/bookings/queue/');
  return response.data;
};

// 👇 ഇത് പുതിയതായി ചേർക്കുക (Get Employees)
export const getEmployees = async () => {
  try {
    const response = await api.get('/accounts/employees/'); 
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};


export const cancelBooking = async (id) => {
  const response = await api.post(`/bookings/bookings/${id}/cancel_booking/`);
  return response.data;
}

export default api;