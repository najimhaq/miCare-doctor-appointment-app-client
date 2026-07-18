// app/(auth)/signup/page.js

import SignInForm from "@/components/auth/SignInForm";
import { getRoleDashboardPath } from "@/lib/getRoleDashboardPath";
import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";


export const metadata = {
  title: 'Signin - MiCare',
};

export default async function SignInPage() {
  const session = await getServerSession();
  console.log('SignInPage', session);

  if (session?.user) {
    redirect(getRoleDashboardPath(session.user.role));
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-black py-12'>
      <div className='w-full max-w-md'>
        <SignInForm />
      </div>
    </div>
  );
}
