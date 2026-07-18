'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import { FaGoogle, FaGithub } from 'react-icons/fa';
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiCamera,
  FiMail,
  FiLock,
} from 'react-icons/fi';
import { signUpSchema } from '@/app/schemas/signUpSchema';
import { useAuth } from '@/hooks/useAuth';
import { authClient } from '@/app/lib/auth-client';
import { uploadImage } from '@/lib/uploadImage';

export function SignUpForm() {
  const router = useRouter();
  const { refreshSession } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
    defaultValues: {
      role: 'PATIENT', // Default role
    },
  });

  const selectedRole = watch('role');

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
    console.log('onSubmit', data);
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
        callbackURL: '/dashboard',
      });

      if (error) {
        toast.error(error.message || 'Sign up failed');
        return;
      }

      toast.success('Account created successfully!');
      await refreshSession();
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
      if (error) toast.error(error.message || 'Google sign-in failed');
    } catch (err) {
      toast.error('Failed to connect with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Reusable Input Class for consistency
  const inputClass =
    'w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all';
  const iconClass =
    'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800 mt-32 md:mt-30'
    >
      <div className='text-center mb-8'>
        <h1 className='text-2xl font-bold text-white tracking-tight'>
          Create Account
        </h1>
        <p className='text-gray-400 mt-1 text-sm'>
          Join MiCare to manage your health
        </p>
      </div>

      {/* Avatar Upload */}
      <div className='flex justify-center mb-6'>
        <label className='relative cursor-pointer group'>
          <div className='w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden bg-gray-950 group-hover:border-teal-500 transition-all duration-300'>
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt='Preview'
                width={80}
                height={80}
                className='object-cover w-full h-full'
                unoptimized
              />
            ) : (
              <FiUser className='w-8 h-8 text-gray-500 group-hover:text-teal-400 transition-colors' />
            )}
          </div>
          <div className='absolute bottom-0 right-0 bg-teal-500 rounded-full p-1.5 border-2 border-gray-900 group-hover:bg-teal-400 transition-colors'>
            <FiCamera className='w-3.5 h-3.5 text-white' />
          </div>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />
        </label>
      </div>
      {isUploading && (
        <p className='text-center text-sm text-teal-400 mb-4 flex items-center justify-center gap-2'>
          <ClipLoader size={14} color='#14b8a6' /> Uploading image...
        </p>
      )}

      {/* OAuth Buttons */}
      <div className='space-y-3 mb-6'>
        <button
          type='button'
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
          className='w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-950 border border-gray-800 rounded-lg text-gray-300 font-medium hover:bg-gray-800 hover:text-white transition-all disabled:opacity-50'
        >
          {isGoogleLoading ? (
            <ClipLoader size={18} color='#ffffff' />
          ) : (
            <FaGoogle className='w-5 h-5' />
          )}
          Continue with Google
        </button>
        <button
          type='button'
          className='w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-950 border border-gray-800 rounded-lg text-gray-300 font-medium hover:bg-gray-800 hover:text-white transition-all'
        >
          <FaGithub className='w-5 h-5' />
          Continue with GitHub
        </button>
      </div>

      {/* Divider */}
      <div className='relative mb-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-800' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-gray-900 text-gray-500'>
            or sign up with email
          </span>
        </div>
      </div>

      {/* Role Selection (Updated for Doctor/Patient) */}
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <label
          className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all duration-200 ${
            selectedRole === 'PATIENT'
              ? 'border-teal-500 bg-teal-500/10'
              : 'border-gray-800 hover:border-gray-700 bg-gray-950'
          }`}
        >
          <input
            type='radio'
            value='PATIENT'
            className='sr-only'
            {...register('role')}
          />
          <span
            className={`font-medium block ${selectedRole === 'PATIENT' ? 'text-teal-400' : 'text-gray-300'}`}
          >
            I am a Patient
          </span>
          <p className='text-xs text-gray-500 mt-1'>Book appointments</p>
        </label>

        <label
          className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all duration-200 ${
            selectedRole === 'DOCTOR'
              ? 'border-teal-500 bg-teal-500/10'
              : 'border-gray-800 hover:border-gray-700 bg-gray-950'
          }`}
        >
          <input
            type='radio'
            value='DOCTOR'
            className='sr-only'
            {...register('role')}
          />
          <span
            className={`font-medium block ${selectedRole === 'DOCTOR' ? 'text-teal-400' : 'text-gray-300'}`}
          >
            I am a Doctor
          </span>
          <p className='text-xs text-gray-500 mt-1'>Offer consultations</p>
        </label>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Name */}
        <div className='relative'>
          <FiUser className={iconClass} />
          <input
            type='text'
            placeholder='John Doe'
            className={inputClass}
            {...register('name')}
          />
          {errors.name && (
            <p className='mt-1 text-xs text-red-400'>{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className='relative'>
          <FiMail className={iconClass} />
          <input
            type='email'
            placeholder='you@example.com'
            className={inputClass}
            {...register('email')}
          />
          {errors.email && (
            <p className='mt-1 text-xs text-red-400'>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className='relative'>
          <FiLock className={iconClass} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            className={`${inputClass} pr-10`}
            {...register('password')}
          />
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors'
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className='w-5 h-5' />
            ) : (
              <FiEye className='w-5 h-5' />
            )}
          </button>
          {errors.password && (
            <p className='mt-1 text-xs text-red-400'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className='relative'>
          <FiLock className={iconClass} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='••••••••'
            className={`${inputClass} pr-10`}
            {...register('confirmPassword')}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors'
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <FiEyeOff className='w-5 h-5' />
            ) : (
              <FiEye className='w-5 h-5' />
            )}
          </button>
          {errors.confirmPassword && (
            <p className='mt-1 text-xs text-red-400'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isLoading || isUploading}
          className='w-full flex items-center justify-center gap-2 py-3 px-4 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6'
        >
          {isLoading || isUploading ? (
            <ClipLoader size={20} color='#ffffff' />
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className='text-center mt-6 text-sm text-gray-400'>
        Already have an account?{' '}
        <a
          href='/signin'
          className='font-semibold text-teal-400 hover:text-teal-300 transition-colors'
        >
          Sign in
        </a>
      </p>
    </motion.div>
  );
}
