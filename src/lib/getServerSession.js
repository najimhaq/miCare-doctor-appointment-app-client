import { headers } from 'next/headers';

export async function getServerSession() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_API_BACKEND_URL is not defined');
    return null;
  }

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const res = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      credentials: 'include',
    });

    if (!res.ok) {
      if (res.status === 401) {
        return null; // Session expired
      }
      console.error(`Session fetch failed: ${res.status}`);
      return null;
    }

    const data = await res.json();

    // ✅ Validate response structure
    if (!data?.user) {
      return null;
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image || null,
        role: data.user.role || 'PATIENT',
      },
      session: data.session || null,
    };
  } catch (error) {
    console.error('❌ Server session error:', error.message);
    return null;
  }
}
