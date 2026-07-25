
import { getRoleDashboardPath } from '@/lib/getRoleDashboardPath';
import { getServerSession } from '@/lib/getServerSession';
import { redirect } from 'next/navigation';

export default async function PatientDashboardMainPage() {
  const session = await getServerSession();
//   console.log('DashboardMainPage', session);

  if (session?.user) {
    redirect(getRoleDashboardPath(session.user.role));
  }
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <p className='text-lg font-semibold text-gray-300'>Redirecting...</p>
    </div>
  );
}
