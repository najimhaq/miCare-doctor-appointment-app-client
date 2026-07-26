// frontend/lib/api/axiosInstance.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
const isDev = process.env.NODE_ENV === 'development';

if (!API_URL && isDev) {
  console.warn('⚠️ NEXT_PUBLIC_API_BACKEND_URL is not defined, using fallback');
}

const axiosInstance = axios.create({
  baseURL: API_URL || 'http://localhost:8000',
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (isDev) console.warn('🌐 Network error:', error.message);
      return Promise.reject({
        message: 'Network error – please check your connection',
        status: 0,
      });
    }

    const { status } = error.response;

    if (status === 401 && typeof window !== 'undefined') {
      const isAuthPage =
        ['/signin', '/signup'].some((p) =>
          window.location.pathname.includes(p)
        ) || window.location.pathname === '/';

      if (!isAuthPage) {
        const lastRedirect = Number(
          sessionStorage.getItem('auth_redirect_ts') || 0
        );
        const now = Date.now();
        if (now - lastRedirect > 3000) {
          sessionStorage.setItem('auth_redirect_ts', now.toString());
          window.location.href = '/signin';
        }
      }
    }

    if (isDev && status === 403) {
      console.warn('⛔ Forbidden:', error.response.data?.message);
    }

    if (isDev && status >= 500) {
      console.warn(
        '💥 Server error:',
        error.response.data?.message || 'Internal server error'
      );
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
