// app/(dashboard)/patient/dashboard/page.js
import { redirect } from 'next/navigation';

import PatientDashboardClient from '@/components/dashboard/PatientDashboardClient';
import { getServerSession } from '@/lib/getServerSession';

export const metadata = { title: 'Patient Dashboard - MiCare' };

export default async function PatientDashboardPage() {
  const session = await getServerSession();
  console.log('PatientDashboardPage', session);

  if (!session?.user) redirect('/signin');
  if (session.user.role !== 'PATIENT') redirect('/');

  return <PatientDashboardClient user={session.user} />;
}
