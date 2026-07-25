// app/(dashboard)/layout.js
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/getServerSession';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DoctorDashboardLayout({ children }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/signin');
  }

  return (
    <div className='flex min-h-screen bg-gray-950'>
      <DashboardSidebar user={session.user} />
      <main className='flex-1 p-6 lg:p-10 overflow-y-auto'>{children}</main>
    </div>
  );
}
