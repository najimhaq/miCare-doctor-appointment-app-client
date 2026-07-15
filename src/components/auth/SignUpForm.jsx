// components/features/auth/SignUpForm.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { signUpSchema } from '@/app/schemas/authSchema';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { FiEye, FiEyeOff, FiUser, FiCamera } from 'react-icons/fi';
import { Button } from '@/components/reusable/Button';
import { Input } from '@/components/reusable/Input';
import { authClient } from '@/lib/auth-client';
import { uploadImage } from '@/lib/uploadImage';
import { useAuth } from '@/context/AuthContext';

export function SignUpForm() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const selectedRole = watch('role', 'TENANT');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let imageUrl = undefined;

      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadImage(imageFile);
        setIsUploading(false);
      }

      const { error } = await authClient.signUp.email({
        email: data.email.trim(),
        password: data.password.trim(),
        name: data.name.trim(),
        role: data.role,
        image: imageUrl,
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || 'Sign up failed');
        return;
      }

      toast.success('Account created successfully!');
      await refreshSession(); // Refresh the session after sign-up
      router.push('/signin');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
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
        <h1 className='text-2xl font-bold text-slate-900'>Create Account</h1>
        <p className='text-slate-500 mt-1'>Join StayNest today</p>
      </div>

      {/* Avatar Upload */}
      <div className='flex justify-center mb-6'>
        <label className='relative cursor-pointer group'>
          <div className='w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group-hover:border-purple-500 transition'>
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt='Preview'
                width={20}
                height={20}
                className='object-cover w-full h-full'
                referrerPolicy='no-referrer'
                unoptimized
              />
            ) : (
              <FiUser className='w-8 h-8 text-slate-400' />
            )}
          </div>
          <div className='absolute bottom-0 right-0 bg-purple-500 rounded-full p-1.5 border-2 border-white'>
            <FiCamera className='w-3 h-3 text-white' />
          </div>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />
        </label>
      </div>

      {/* OAuth Buttons */}
      <div className='space-y-3 mb-6'>
        <Button variant='outline' className='w-full gap-2'>
          <FaGoogle className='w-5 h-5' />
          Continue with Google
        </Button>
        <Button variant='outline' className='w-full gap-2'>
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
            or sign up with email
          </span>
        </div>
      </div>

      {/* Role Selection */}
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <label
          className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
            selectedRole === 'TENANT'
              ? 'border-purple-500 bg-purple-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <input
            type='radio'
            value='TENANT'
            className='sr-only'
            {...register('role')}
          />
          <span className='font-medium text-slate-900'>I want to Rent</span>
          <p className='text-xs text-slate-500 mt-1'>Find properties</p>
        </label>
        <label
          className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
            selectedRole === 'OWNER'
              ? 'border-purple-500 bg-purple-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <input
            type='radio'
            value='OWNER'
            className='sr-only'
            {...register('role')}
          />
          <span className='font-medium text-slate-900'>I want to List</span>
          <p className='text-xs text-slate-500 mt-1'>Rent my property</p>
        </label>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input
          label='Full Name'
          placeholder='John Doe'
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label='Email Address'
          type='email'
          placeholder='you@example.com'
          error={errors.email?.message}
          {...register('email')}
        />

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
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-9.5 text-slate-400 hover:text-slate-600'
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className='w-5 h-5' />
            ) : (
              <FiEye className='w-5 h-5' />
            )}
          </button>
        </div>

        <div className='relative'>
          <Input
            label='Confirm Password'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='••••••••'
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className='absolute right-3 top-9.5 text-slate-400 hover:text-slate-600'
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <FiEyeOff className='w-5 h-5' />
            ) : (
              <FiEye className='w-5 h-5' />
            )}
          </button>
        </div>

        <Button
          type='submit'
          variant='primary'
          className='w-full'
          isLoading={isLoading || isUploading}
        >
          {isUploading ? 'Uploading image...' : 'Create Account'}
        </Button>
      </form>

      <p className='text-center mt-6 text-sm text-slate-600'>
        Already have an account?{' '}
        <a
          href='/signin'
          className='text-purple-600 hover:text-purple-700 font-medium'
        >
          Sign in
        </a>
      </p>
    </motion.div>
  );
}
