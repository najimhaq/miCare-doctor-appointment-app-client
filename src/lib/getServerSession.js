// lib/getServerSession.js
import { headers } from 'next/headers';

export async function getServerSession() {
  // lib/getServerSession.js এর একদম উপরে temporary যুক্ত করুন
  console.log('=== ENV DEBUG ===');
  console.log(
    'API_BACKEND_URL:',
    JSON.stringify(process.env.NEXT_PUBLIC_API_BACKEND_URL)
  );
  console.log(
    'APP_FRONTEND_URL:',
    JSON.stringify(process.env.NEXT_PUBLIC_APP_FRONTEND_URL)
  );
  console.log('=================');
  try {
    const cookieHeader = (await headers()).get('cookie') || '';

    const apiUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL; // ✅ .env এর exact নাম

    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_BACKEND_URL is not defined!');
      return null;
    }

    const res = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
        origin:
          process.env.NEXT_PUBLIC_APP_FRONTEND_URL || 'http://localhost:3000',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Server session fetch failed:', error);
    return null;
  }
}
