// frontend/context/AuthContext.js
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/lib/auth-client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);

      // Better Auth client এর মাধ্যমে session fetch
      const { data, error } = await authClient.getSession();

      if (error) {
        console.error('Session error:', error);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      if (data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Session fetch failed:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || 'Login failed');
        return { success: false, error };
      }

      await refreshSession();
      toast.success('Logged in successfully');
      return { success: true, data };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || 'Signup failed');
        return { success: false, error };
      }

      await refreshSession();
      toast.success('Account created successfully');
      return { success: true, data };
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      return { success: false, error };
    }
  };

  const socialLogin = async (provider) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      console.error('Social login error:', error);
      toast.error('Social login failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        logout,
        login,
        signup,
        socialLogin,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
