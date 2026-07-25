// app/doctors/page.jsx
import { getServerSession } from '@/lib/getServerSession';
import DoctorsClient from './DoctorsClient';
import axiosInstance from '@/lib/api/axiosInstance';

// app/doctors/page.jsx
const DoctorsMainPage = async () => {
  const session = await getServerSession();
  const user = session?.user || null;

  let initialData = { doctors: [], pagination: null };
  let error = null;

  try {
    const response = await axiosInstance.get('/api/all-doctors?page=1&limit=9');
    initialData = {
      doctors: response.data?.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (err) {
    error = err.message || 'Failed to fetch doctors';
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <DoctorsClient
        initialDoctors={initialData.doctors}
        initialPagination={initialData.pagination}
        error={error}
        session={user}
      />
    </div>
  );
};

export default DoctorsMainPage;
