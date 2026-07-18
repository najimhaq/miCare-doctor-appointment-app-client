// frontend - lib/core/session.js (ঠিক করা ভার্সন)

import { getServerSession } from "../getServerSession";


export async function getUserSession() {
  return await getServerSession();
}

export async function getUser() {
  const session = await getServerSession();
  return session?.user || null;
}

export async function getUserId() {
  const session = await getServerSession();
  return session?.user?.id || null;
}
