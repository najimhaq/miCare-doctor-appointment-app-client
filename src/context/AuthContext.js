// context/AuthContext.js
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


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await authClient.getSession();
      if (error || !data?.user) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Session fetch failed:', err.message);
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
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, logout, refreshSession }}
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
