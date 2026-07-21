// frontend/app/doctors/page.jsx
import { getServerSession } from '@/lib/getServerSession';
import { Suspense } from 'react';
import DoctorsClient from './DoctorsClient';
import Loading from './loading';

// This runs on the server
const DoctorsMainPage = async () => {
  const session = await getServerSession();
  console.log(DoctorsMainPage, session);

  // Fetch doctors on server
  let initialDoctors = [];
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/doctors`, {
      headers: {
        Authorization: session?.accessToken
          ? `Bearer ${session.accessToken}`
          : '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      initialDoctors = await response.json();
      console.log('initialDoctors', initialDoctors);
    } else {
      error = `Failed to fetch: ${response.status}`;
    }
  } catch (err) {
    console.error('Error:', err);
    error = err.message;
  }

  // Pass data to client component
  return (
    <Suspense fallback={<Loading />}>
      <DoctorsClient
        initialDoctors={initialDoctors}
        error={error}
        session={session}
      />
    </Suspense>
  );
};

export default DoctorsMainPage;
