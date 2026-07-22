import { createAuthClient } from 'better-auth/client';

const API_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

if (!API_URL) {
  console.error('❌ NEXT_PUBLIC_API_BACKEND_URL is not defined');
}

export const authClient = createAuthClient({
  baseURL: API_URL || 'http://localhost:8000',
});

// ✅ Named exports for better DX
export const { signIn, signUp, signOut, getSession, useSession, socialLogin } =
  authClient;

export default authClient;
