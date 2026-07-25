// frontend/app/patient/my-appointments/page.jsx
import { getServerSession } from '@/lib/getServerSession';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';

import { cookies } from 'next/headers';
import MyAppointmentsClient from '@/components/dashboard/MyAppointmentsClient';

const MyAppointmentsPage = async () => {
  const session = await getServerSession();
  const user = session?.user || null;

  let initialAppointments = [];
  let error = null;

  try {
    const cookieStore = await cookies();
    const response = await axiosInstance.get(API.myAppointments, {
      headers: { Cookie: cookieStore.toString() },
    });
    initialAppointments = response.data?.data || [];
  } catch (err) {
    error = err.message || 'Failed to fetch appointments';
  }

  return (
    <div className='min-h-screen bg-slate-900 py-8 px-4 md:px-8'>
      <MyAppointmentsClient
        initialAppointments={initialAppointments}
        error={error}
        session={user}
      />
    </div>
  );
};

export default MyAppointmentsPage;
