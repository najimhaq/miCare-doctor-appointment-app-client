// frontend/app/lib/auth-client.js
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:8000',
  // Better Auth automatically handles cookies
  // No need to manually set headers
});

// Export individual methods for easier use
export const { signIn, signUp, signOut, getSession, useSession, socialLogin } =
  authClient;
