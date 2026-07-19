// components/AppointmentBooking.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FaCalendar, FaClock, FaStethoscope } from 'react-icons/fa';

const appointmentSchema = yup.object().shape({
  date: yup.string().required('Please select a date'),
  time: yup.string().required('Please select a time'),
  symptoms: yup.string().required('Please describe your symptoms'),
  notes: yup.string(),
});

export default function AppointmentBooking({ doctorId, doctorName }) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(appointmentSchema),
  });

  const date = watch('date');

  // Fetch available slots when date changes
  useEffect(() => {
    if (date && doctorId) {
      fetchAvailableSlots(date);
    }
  }, [date, doctorId]);

  const fetchAvailableSlots = async (selectedDate) => {
    try {
      const response = await fetch(
        `/api/appointments/slots?doctorId=${doctorId}&date=${selectedDate}`
      );
      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      toast.error('Failed to load available slots');
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          date: data.date,
          time: data.time,
          symptoms: data.symptoms,
          notes: data.notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      toast.success(`Appointment booked with Dr. ${doctorName}!`);
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
        <FaStethoscope className='text-blue-500' />
        Book Appointment with Dr. {doctorName}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Date */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <FaCalendar className='inline mr-2' />
            Select Date
          </label>
          <input
            type='date'
            {...register('date')}
            min={new Date().toISOString().split('T')[0]}
            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          {errors.date && (
            <p className='text-red-500 text-sm mt-1'>{errors.date.message}</p>
          )}
        </div>

        {/* Time */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <FaClock className='inline mr-2' />
            Select Time
          </label>
          <select
            {...register('time')}
            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value=''>Select time slot</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className='text-red-500 text-sm mt-1'>{errors.time.message}</p>
          )}
        </div>

        {/* Symptoms */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Symptoms
          </label>
          <textarea
            {...register('symptoms')}
            rows='3'
            placeholder='Describe your symptoms...'
            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          {errors.symptoms && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.symptoms.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows='2'
            placeholder='Any additional information...'
            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
