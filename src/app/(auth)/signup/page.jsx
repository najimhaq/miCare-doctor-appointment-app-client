// app/(auth)/signup/page.js

import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata = {
  title: 'Sign Up - MiCare',
};

export default async function SignUpPage() {
  // const session = await getServerSession();

  // if (session?.user) {
  //   redirect(getRoleDashboardPath(session.user.role));
  // }
  return (
    <div className='min-h-screen flex items-center justify-center bg-black py-12'>
      <div className='w-full max-w-md'>
        <SignUpForm />
      </div>
    </div>
  );
}
