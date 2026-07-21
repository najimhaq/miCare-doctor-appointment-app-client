// lib/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:8000',
  withCredentials: true, // Better Auth session cookie/token পাঠানোর জন্য
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token attach করা
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // বা authClient session থেকে
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired, redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
