import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (token add করার জন্য)
api.interceptors.request.use(
  (config) => {
    // Better Auth থেকে token নেওয়া হবে পরে
    const token = localStorage.getItem('better-auth.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (error handling এর জন্য)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
