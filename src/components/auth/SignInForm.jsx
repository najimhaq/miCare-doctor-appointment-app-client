// components/features/auth/SignInForm.js
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'; // 👈 new
import { signInSchema } from '@/utils/validations/auth';
import { Button } from '@/components/reusable/Button';
import { Input } from '@/components/reusable/Input';
import { authClient } from '@/lib/auth-client';
import { getRoleDashboardPath } from '@/lib/getRoleDashboardPath';

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 👇 new state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { error, data: signInData } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      });

      console.log('JWT Token:', signInData?.token);
      console.log('Full signInData:', signInData);

      if (error) {
        toast.error(error.message || 'Invalid credentials');
        return;
      }

      toast.success('Signed in successfully!');
      const dashboardPath = getRoleDashboardPath(signInData?.user?.role);
      router.replace(dashboardPath);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });
    } catch (error) {
      toast.error('Google sign-in failed');
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });
    } catch (error) {
      toast.error('GitHub sign-in failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-white p-8 rounded-2xl shadow-xl border border-slate-100'
    >
      <div className='text-center mb-8'>
        <h1 className='text-2xl font-bold text-slate-900'>Welcome Back</h1>
        <p className='text-slate-500 mt-1'>Sign in to your StayNest account</p>
      </div>

      {/* OAuth Buttons */}
      <div className='space-y-3 mb-6'>
        <Button
          variant='outline'
          className='w-full gap-2'
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className='w-5 h-5' />
          Continue with Google
        </Button>
        <Button
          variant='outline'
          className='w-full gap-2'
          onClick={handleGithubSignIn}
        >
          <FaGithub className='w-5 h-5' />
          Continue with GitHub
        </Button>
      </div>

      <div className='relative mb-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-slate-200' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-white text-slate-500'>
            or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input
          label='Email Address'
          type='email'
          placeholder='you@example.com'
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password with toggle */}
        <div className='relative'>
          <Input
            label='Password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            error={errors.password?.message}
            {...register('password')}
          />

          <button
            type='button'
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-9.5 text-slate-400 hover:text-slate-600'
          >
            {showPassword ? (
              <HiOutlineEyeOff className='h-5 w-5' />
            ) : (
              <HiOutlineEye className='h-5 w-5' />
            )}
          </button>
        </div>

        <Button
          type='submit'
          variant='gradient'
          className='w-full'
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <p className='text-center mt-6 text-sm text-slate-600'>
        Don't have an account?{' '}
        <a
          href='/signup'
          className='text-blue-600 hover:text-blue-700 font-medium'
        >
          Sign up
        </a>
      </p>
    </motion.div>
  );
}
