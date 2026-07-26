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
      headers: { cookie: cookieHeader, 'Content-Type': 'application/json' },
      cache: 'no-store',
      credentials: 'include',
    });

    if (!res.ok) {
      if (res.status === 401) return null;
      console.error(`Session fetch failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data?.user) return null;

    // ✅ DB থেকে fresh role ফেচ করুন
    let freshRole = data.user.role;
    try {
      const meRes = await fetch(`${apiUrl}/api/auth/me`, {
        headers: { cookie: cookieHeader, 'Content-Type': 'application/json' },
        cache: 'no-store',
        credentials: 'include',
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData?.data?.role) {
          freshRole = meData.data.role; // ✅ override stale role
        }
      }
    } catch (meErr) {
      console.error(
        '⚠️ /me fetch failed, falling back to session role:',
        meErr.message
      );
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image || null,
        role: freshRole || 'PATIENT',
      },
      session: data.session || null,
    };
  } catch (error) {
    console.error('❌ Server session error:', error.message);
    return null;
  }
}
