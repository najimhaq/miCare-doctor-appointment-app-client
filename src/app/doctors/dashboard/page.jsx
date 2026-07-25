// app/doctor/dashboard/page.jsx
import { getServerSession } from '@/lib/getServerSession';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';

import { cookies } from 'next/headers';
import DoctorDashboardClient from '@/components/dashboard/DoctorDashboardClient';

const DoctorDashboardPage = async () => {
  const session = await getServerSession();
  const user = session?.user || null;

  let initialData = null;
  let error = null;

  try {
    const cookieStore = await cookies();
    const response = await axiosInstance.get(API.doctor.dashboardStats, {
      headers: { Cookie: cookieStore.toString() },
    });
    initialData = response.data?.data || null;
  } catch (err) {
    error = err.message || 'Failed to fetch dashboard data';
  }

  return (
    <div className='min-h-screen bg-slate-900 py-8 px-4 md:px-8'>
      <DoctorDashboardClient
        initialData={initialData}
        error={error}
        user={user}
      />
    </div>
  );
};

export default DoctorDashboardPage;
