// frontend/app/doctors/[id]/page.jsx

import { notFound } from 'next/navigation';
import DoctorDetailsClient from './DoctorDetailsClient';
import { getServerSession } from '@/lib/getServerSession';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/all-doctors/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { title: 'Doctor Not Found' };
    const json = await res.json();
    const doctor = json.data; // ✅

    return {
      title: `Dr. ${doctor?.user?.name} - ${doctor?.specialization}`,
      description: `Book appointment with Dr. ${doctor?.user?.name}, ${doctor?.specialization} at ${doctor?.hospital}`,
    };
  } catch {
    return { title: 'Doctor Details' };
  }
}

export default async function DoctorDetailsPage({ params }) {
  const { id } = await params;
  const session = await getServerSession();

  let doctor = null;
  let error = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/all-doctors/${id}`,
      {
        headers: {
          Authorization: session?.accessToken
            ? `Bearer ${session.accessToken}`
            : '',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const json = await res.json();
    doctor = json.data;
  } catch (err) {
    console.error('Error fetching doctor:', err);
    error = err.message;
  }

  if (!doctor && !error) {
    return notFound();
  }

  return (
    <DoctorDetailsClient doctor={doctor} session={session} error={error} />
  );
}
