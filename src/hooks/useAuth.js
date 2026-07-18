//navbar a lagbe - kimi
// hooks/useAuth.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/lib/auth-client';


export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
    router.refresh();
  };

  return { user, isAuthenticated, isLoading, logout };
}
