'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { signinSchema } from '@/app/schemas/signUpSchema';
import { authClient } from '@/app/lib/auth-client'; 
import { useAuth } from '@/hooks/useAuth';

export default function SignInForm() {
  const router = useRouter();
  const { refreshSession } = useAuth(); // ✅ যুক্ত করুন
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // ✅ আসল Better Auth call
      const { data: sessionData, error } = await authClient.signIn.email({
        email: data.email.trim(),
        password: data.password.trim(),
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password');
        return;
      }

      toast.success('Welcome back! Redirecting...');
      await refreshSession();

      const role = sessionData?.user?.role;
      if (role === 'PATIENT') {
        router.push('/patient/dashboard');
      } else if (role === 'DOCTOR') {
        router.push('/doctor/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Sign in failed:', err.message);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-white tracking-tight'>
            Welcome Back
          </h2>
          <p className='mt-2 text-sm text-gray-400'>
            Sign in to manage your appointments and health records.
          </p>
        </div>

        <div className='bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                <input
                  type='email'
                  {...register('email')}
                  className='w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all'
                  placeholder='you@example.com'
                />
              </div>
              {errors.email && (
                <p className='mt-1 text-sm text-red-400'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className='w-full pl-10 pr-12 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-400'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='flex items-center justify-end'>
              <Link
                href='/forgot-password'
                className='text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <ClipLoader size={20} color='#ffffff' />
              ) : (
                <>
                  Sign In
                  <ArrowRight className='w-4 h-4' />
                </>
              )}
            </button>
          </form>

          <div className='mt-6 relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-800'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-gray-900 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-3'>
            <button
              type='button'
              onClick={handleGoogleSignIn} // ✅ যুক্ত করুন
              className='w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-950 border border-gray-800 rounded-lg text-gray-300 font-medium hover:bg-gray-800 transition-all'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <p className='mt-8 text-center text-sm text-gray-400'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='font-semibold text-teal-400 hover:text-teal-300 transition-colors'
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
