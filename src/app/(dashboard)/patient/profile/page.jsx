// frontend/app/dashboard/patient/profile/page.jsx
import PatientProfileClient from '@/components/dashboard/PatientProfileClient';
import { getServerSession } from '@/lib/getServerSession';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const PatientProfilePage = async () => {
  const session = await getServerSession();


  // Check if user is authenticated
  if (!session?.user) {
    redirect('/signin');
  }

  // Get patient data from backend using fetch
  let patientData = null;
  let error = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/patient/profile`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always fetch fresh data
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        redirect('/signin');
      }
      throw new Error('Failed to fetch patient data');
    }

    patientData = await response.json();
    console.log('Patient data fetched:', patientData);
  } catch (err) {
    console.error('Error fetching patient data:', err);
    error = err.message;
  }

  // If no patient data found, create a new profile with session data
  if (!patientData && !error) {
    try {
      const createResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/patient/profile`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: session.user.name,
            email: session.user.email,
          }),
        }
      );

      if (createResponse.ok) {
        patientData = await createResponse.json();
      }
    } catch (err) {
      console.error('Error creating patient profile:', err);
    }
  }

  // Prepare user data for client
  const userData = {
    name: session.user.name || '',
    email: session.user.email || '',
    image: session.user.image || null,
    role: session.user.role || 'PATIENT',
    ...patientData,
  };

  return <PatientProfileClient user={userData} session={session} />;
};

export default PatientProfilePage;
