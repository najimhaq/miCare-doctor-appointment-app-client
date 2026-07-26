// app/dashboard/doctor/appointments/page.jsx
import { getServerSession } from '@/lib/getServerSession';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';
import { cookies } from 'next/headers';
import DoctorAppointmentsClient from './DoctorAppointmentsClient';

const DoctorAppointmentsPage = async () => {
  const session = await getServerSession();
  const user = session?.user || null;
  console.log('DoctorAppointmentsPage', user);

  let initialData = { appointments: [], pagination: null };
  let error = null;

  try {
    const cookieStore = await cookies();
    const response = await axiosInstance.get(API.doctor.appointmentHistory, {
      params: { page: 1, limit: 10 },
      headers: { Cookie: cookieStore.toString() },
    });
    initialData = {
      appointments: response.data?.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (err) {
    error = err.message || 'Failed to fetch appointments';
  }

  return (
    <div className='min-h-screen bg-slate-900 py-8 px-4 md:px-8'>
      <DoctorAppointmentsClient
        initialAppointments={initialData.appointments}
        initialPagination={initialData.pagination}
        error={error}
        session={user}
      />
    </div>
  );
};

export default DoctorAppointmentsPage;
