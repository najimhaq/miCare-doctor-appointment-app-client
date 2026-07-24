// frontend/lib/api/axiosInstance.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

if (!API_URL) {
  console.error('❌ NEXT_PUBLIC_API_BACKEND_URL is not defined');
}

const axiosInstance = axios.create({
  baseURL: API_URL || 'http://localhost:8000',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
      return Promise.reject({
        message: 'Network error – please check your connection',
        status: 0,
      });
    }

    const { status } = error.response;

    // ✅ 401 - Unauthorized (with cooldown-based loop protection)
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

    if (status === 403) {
      console.error('⛔ Forbidden:', error.response.data?.message);
    }

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
