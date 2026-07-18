// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Better Auth session cookie automatically পাঠাবে [web:24]
  timeout: 15000, // 15 সেকেন্ড পর request timeout — hang হওয়া থেকে বাঁচাবে
});

// ✅ Request interceptor — logging/debugging এর জন্য (production-এ চাইলে বাদ দিতে পারেন)
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor — centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (backend down, no internet)
    if (!error.response) {
      console.error('Network error — backend unreachable:', error.message);
      return Promise.reject({
        ...error,
        message: 'Cannot connect to server. Please check your connection.',
      });
    }

    const { status } = error.response;

    // 401 — Session expired বা login করা নেই
    if (status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthPage =
          window.location.pathname.includes('/signin') ||
          window.location.pathname.includes('/signup');

        // ইনফিনিট redirect loop এড়ানোর জন্য check
        if (!isAuthPage) {
          window.location.href = '/signin';
        }
      }
    }

    // 403 — Role mismatch / permission নেই
    if (status === 403) {
      console.error('Forbidden: You do not have permission for this action.');
    }

    // 500 — Server error
    if (status >= 500) {
      console.error(
        'Server error:',
        error.response.data?.message || 'Something went wrong'
      );
    }

    return Promise.reject(error);
  }
);

export default api;
