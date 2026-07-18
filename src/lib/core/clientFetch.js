// frontend/src/lib/core/clientFetch.js
'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const clientFetch = async (path, options = {}) => {
  const jwtRes = await fetch(`${API_BASE}/token/jwt`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!jwtRes.ok) {
    throw new Error('Not authenticated');
  }

  const { token } = await jwtRes.json();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result?.message || `Request failed with status ${res.status}`
    );
  }

  return result;
};
