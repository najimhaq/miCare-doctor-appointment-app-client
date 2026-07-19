'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import {
  FaUserMd,
  FaMoneyBillWave,
  FaClock,
  FaStethoscope,
} from 'react-icons/fa';
import { doctorProfileSchema } from '@/app/schemas/doctorProfileSchema';



export default function DoctorProfileForm({ userId }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(doctorProfileSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/doctors/profile`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, userId }),
        }
      );

      if (!res.ok) throw new Error('Failed to create profile');

      toast.success('Doctor profile created successfully! 🎉');
      reset(); // Clear form after success
    } catch (error) {
      toast.error(error.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
        <FaUserMd className='text-blue-600' /> Create Doctor Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Specialization */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            <FaStethoscope className='inline mr-2 text-gray-500' />{' '}
            Specialization
          </label>
          <input
            {...register('specialization')}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            placeholder='e.g., Cardiologist, Neurologist'
          />
          {errors.specialization && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.specialization.message}
            </p>
          )}
        </div>

        {/* Experience & Fee in a row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              <FaClock className='inline mr-2 text-gray-500' /> Experience
              (Years)
            </label>
            <input
              type='number'
              {...register('experience')}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='e.g., 5'
            />
            {errors.experience && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              <FaMoneyBillWave className='inline mr-2 text-gray-500' />{' '}
              Consultation Fee ($)
            </label>
            <input
              type='number'
              {...register('consultationFee')}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='e.g., 50'
            />
            {errors.consultationFee && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.consultationFee.message}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Bio / About
          </label>
          <textarea
            {...register('bio')}
            rows='4'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            placeholder='Write a short bio about yourself...'
          />
          {errors.bio && (
            <p className='text-red-500 text-xs mt-1'>{errors.bio.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-400'
        >
          {isLoading ? (
            <>
              <ClipLoader size={20} color='#ffffff' />
              Processing...
            </>
          ) : (
            'Create Profile'
          )}
        </button>
      </form>
    </div>
  );
}
