// app/(auth)/signin/page.js

import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign In - MiCare',
};

export default async function SignInPage() {
  // const session = await getServerSession();

  // if (session?.user) {
  //   redirect(getRoleDashboardPath(session.user.role));
  // }
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md'>
        {/* <SignInForm /> */}
        <h1 className='text-4xl font-bold text-white'>Sign In</h1>
      </div>
    </div>
  );
}
