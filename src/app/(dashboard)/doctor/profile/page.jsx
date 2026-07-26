// app/doctor/profile/page.jsx
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';
import { cookies } from 'next/headers';
import DoctorProfileClient from './DoctorProfileClient';
import { getServerSession } from '@/lib/getServerSession';

const DoctorProfilePage = async () => {
     const session = await getServerSession();
      console.log('Doctor profile page', session);

      const user = session?.user || null;
      console.log('Doctor profile page', user);

  let initialData = null; // ✅ বাইরে ডিক্লেয়ার করুন
  let error = null;

  try {
    const cookieStore = await cookies();
    const response = await axiosInstance.get(API.doctor.profile, {
      headers: { Cookie: cookieStore.toString() },
    });
    initialData = response.data?.data || null; // ✅ শুধু assign করুন, ডিক্লেয়ার না
    console.log('DoctorProfilePage', initialData);
  } catch (err) {
    error = err.message || 'Failed to fetch profile';
  }

  return (
    <div className='min-h-screen bg-slate-900 py-8 px-4 md:px-8'>
      <DoctorProfileClient initialData={initialData} error={error} />
    </div>
  );
};

export default DoctorProfilePage;
