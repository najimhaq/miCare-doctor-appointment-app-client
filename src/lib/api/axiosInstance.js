import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

if (!API_URL) {
  console.error('❌ NEXT_PUBLIC_API_BACKEND_URL is not defined');
}

const axiosInstance = axios.create({
  baseURL: API_URL || 'http://localhost:8000',
  withCredentials: true, // ✅ Better Auth cookie automatically sent
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor with loop protection
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
      return Promise.reject({
        message: 'Network error – please check your connection',
        status: 0,
      });
    }

    const { status } = error.response;

    // ✅ 401 - Unauthorized (with loop protection)
    if (status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthPage =
          window.location.pathname.includes('/signin') ||
          window.location.pathname.includes('/signup') ||
          window.location.pathname === '/';

        if (!isAuthPage) {
          // Prevent redirect loop
          const redirectKey = 'auth_redirecting';
          if (!sessionStorage.getItem(redirectKey)) {
            sessionStorage.setItem(redirectKey, 'true');
            window.location.href = '/signin';
          }
        }
      }
    }

    // ✅ 403 - Forbidden
    if (status === 403) {
      console.error('⛔ Forbidden:', error.response.data?.message);
    }

    // ✅ 500+ - Server error
    if (status >= 500) {
      console.error(
        '💥 Server error:',
        error.response.data?.message || 'Internal server error'
      );
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
