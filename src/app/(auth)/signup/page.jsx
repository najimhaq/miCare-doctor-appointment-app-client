// app/(auth)/signup/page.js

import { SignUpForm } from '@/components/features/auth/SignUpForm';
import { getRoleDashboardPath } from '@/lib/getRoleDashboardPath';
import { getServerSession } from '@/lib/getServerSession';

export const metadata = {
  title: 'Sign Up - StayNest',
};

export default async function SignUpPage() {
   const session = await getServerSession();

  if (session?.user) {
    redirect(getRoleDashboardPath(session.user.role));
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-black py-12'>
      <div className='w-full max-w-md'>
        <SignUpForm />
      </div>
    </div>
  );
}
