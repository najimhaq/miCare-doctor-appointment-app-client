// frontend/src/lib/core/server.js
import { headers } from 'next/headers';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

// Better Auth কে সরাসরি import না করে,
// backend JWT endpoint call করব
const getJwt = async () => {
  try {
    // Next.js server component থেকে backend /auth/jwt hit করা
    const res = await fetch(`${baseUrl}/token/jwt`, {
      // frontend client থেকে আসা cookies/headers কে forward করতে চাইলে:
      headers: await headers(),
      // অথবা শুধু credentials দরকার হলে:
      // credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.token || null;
  } catch (err) {
    console.error('getJwt error:', err);
    return null;
  }
};

// GET Request (Server Component)
export const serverFetch = async (path, options = {}) => {
  if (!path || path.includes('/undefined')) {
    throw new Error(`Invalid request path: ${path}`);
  }

  const token = await getJwt();

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    let result = null;
    try {
      result = await res.json();
    } catch {}

    if (!res.ok) {
      throw new Error(
        result?.message || `Request failed with status ${res.status}`
      );
    }
    return result;
  } catch (err) {
    console.error('Fetch error:', err.message);
    throw err;
  }
};
// POST/PUT/DELETE Request এর জন্য (Server Actions এর জন্য)
export const serverMutation = async ({ path, method = 'POST', payload }) => {
  // ফিডব্যাক ফিক্স: সার্ভার মিউটেশনেও টোকেন পাঠানো জরুরি
  const token = await getJwt();

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    let result = null;
    try {
      result = await res.json();
    } catch {}

    if (!res.ok) {
      switch (res.status) {
        case 401:
          throw new Error(result?.message || 'Unauthorized');
        case 403:
          throw new Error(result?.message || 'Forbidden');
        case 404:
          throw new Error(result?.message || 'Not found');
        case 409:
          throw new Error(result?.message || 'Conflict');
        default:
          throw new Error(
            result?.message || `Request failed with status ${res.status}`
          );
      }
    }
    return result;
  } catch (err) {
    throw new Error(
      err.message || 'Network error. Failed to connect to server'
    );
  }
};
