// frontend/lib/getServerSession.js
import { headers } from 'next/headers';
import { authClient } from '@/app/lib/auth-client';

export async function getServerSession() {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const apiUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_BACKEND_URL is not defined');
      return null;
    }

    // Better Auth এর session endpoint
    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Session fetch failed:', response.status);
      return null;
    }

    const data = await response.json();

    // Transform data to match expected format
    if (data?.user) {
      return {
        user: data.user,
        accessToken: data.session?.accessToken || null,
      };
    }

    return null;
  } catch (error) {
    console.error('Server session fetch error:', error);
    return null;
  }
}
