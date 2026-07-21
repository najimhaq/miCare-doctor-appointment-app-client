// frontend/lib/api/serverApi.js
import { cookies } from 'next/headers';

export async function serverFetch(endpoint, options = {}) {
  const cookieStore = cookies();
  const token = cookieStore.get('better-auth.session-token')?.value;

  const defaultOptions = {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    ...options,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${endpoint}`,
    defaultOptions
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}
