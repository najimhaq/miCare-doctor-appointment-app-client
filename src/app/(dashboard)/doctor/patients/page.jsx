// app/doctor/patients/page.jsx
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';
import { cookies } from 'next/headers';
import DoctorPatientsClient from './DoctorPatientsClient';


const DoctorsPatientPage = async () => {
  let initialData = null;
  let error = null;

  try {
    const cookieStore = await cookies();
    const response = await axiosInstance.get(API.doctor.patients, {
      headers: { Cookie: cookieStore.toString() },
    });
    initialData = response.data?.data || [];
  } catch (err) {
    error = err.response?.data?.message || 'Failed to fetch patients';
  }

  return (
    <div className='min-h-screen bg-slate-900 py-8 px-4 md:px-8'>
      <DoctorPatientsClient initialData={initialData} error={error} />
    </div>
  );
};

export default DoctorsPatientPage;
