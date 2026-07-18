// hooks/useAuth.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/lib/auth-client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ✅ session check করার logic আলাদা function-এ রাখা হলো
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
      console.error(
        'Backend unreachable — is the server running?',
        err.message
      );
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
    } catch (err) {
      console.error('Logout failed:', err.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
      router.refresh();
    }
  };

  // ✅ refreshSession এখন return object-এ আছে
  return { user, isAuthenticated, isLoading, logout, refreshSession };
}
