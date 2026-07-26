'use client';

import authClient from '@/app/lib/auth-client';
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Memoized refresh function
  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.getSession();

      if (error || !data?.user) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // ✅ ডাটাবেজ থেকে fresh role fetch করুন
      const meRes = await axiosInstance.get(API.auth.me).catch(() => null);
      const freshRole = meRes?.data?.data?.role;

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image || null,
        role: freshRole || data.user.role || 'PATIENT', // ✅ fresh role prioritize
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Session fetch error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // ✅ Login with error handling
  const login = useCallback(
    async (email, password) => {
      try {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) throw error;
        await refreshSession();
        toast.success('Welcome back!');
        return { success: true, data };
      } catch (error) {
        toast.error(error.message || 'Login failed');
        return { success: false, error };
      }
    },
    [refreshSession]
  );

  // ✅ Signup with auto login
  const signup = useCallback(
    async (email, password, name) => {
      try {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) throw error;
        await refreshSession();
        toast.success('Account created successfully!');
        return { success: true, data };
      } catch (error) {
        toast.error(error.message || 'Signup failed');
        return { success: false, error };
      }
    },
    [refreshSession]
  );

  // ✅ Logout
  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  }, [router]);

  // ✅ Social Login
  const socialLogin = useCallback(async (provider) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      console.error('Social login error:', error);
      toast.error('Social login failed');
    }
  }, []);

  // ✅ Memoized context value
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      socialLogin,
      refreshSession,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      socialLogin,
      refreshSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
