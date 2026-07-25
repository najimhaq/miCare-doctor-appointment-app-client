// frontend/components/BookingModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';
import { Button } from '@/components/ui/button';

export default function BookingModal({
  doctor,
  appointmentId,
  initialDate = '',
  initialTime = '',
  onClose,
  onSuccess,
}) {
  const isEditMode = Boolean(appointmentId);
  const [isBooking, setIsBooking] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (initialDate) fetchSlots(initialDate);
  }, []);

  const fetchSlots = async (date) => {
    setLoadingSlots(true);
    try {
      const res = await axiosInstance.get(
        `${API.doctor.doctorById(doctor.id)}/available-slots`,
        { params: { date } }
      );
      let slots = res.data?.data || [];
      if (isEditMode && initialTime && !slots.includes(initialTime)) {
        slots = [initialTime, ...slots];
      }
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Failed to load slots:', err);
      toast.error('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);
    if (!date) return;
    fetchSlots(date);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    setIsBooking(true);
    try {
      if (isEditMode) {
        const response = await axiosInstance.patch(
          API.appointmentById(appointmentId),
          { date: selectedDate, time: selectedTime }
        );
        if (response.data.success) {
          toast.success('Appointment rescheduled successfully!');
          onSuccess ? onSuccess() : onClose();
        }
      } else {
        const response = await axiosInstance.post(API.bookAppointment, {
          doctorId: doctor.id,
          date: selectedDate,
          time: selectedTime,
        });
        if (response.data.success) {
          toast.success('Appointment booked successfully!');
          onSuccess ? onSuccess() : onClose();
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? 'reschedule' : 'book'} appointment`
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='bg-slate-900 rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl'
      >
        <h3 className='text-xl font-bold text-white mb-4'>
          {isEditMode ? 'Reschedule Appointment' : 'Book Appointment'}
        </h3>
        <p className='text-white/60 text-sm mb-4'>
          Dr. {doctor?.user?.name} - {doctor?.specialization}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-white/70 mb-1'>
              Select Date
            </label>
            <input
              type='date'
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className='w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400'
            />
          </div>

          {selectedDate && (
            <div>
              <label className='block text-sm font-medium text-white/70 mb-1'>
                Select Time
              </label>
              {loadingSlots ? (
                <p className='text-white/40 text-sm text-center py-2'>
                  Loading slots...
                </p>
              ) : (
                <div className='grid grid-cols-3 gap-2'>
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          selectedTime === slot
                            ? 'bg-linear-to-r from-cyan-500 to-emerald-500 text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className='text-white/40 text-sm col-span-3 text-center py-2'>
                      No slots available for this date
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className='flex gap-3 pt-4 border-t border-white/10'>
            <Button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || isBooking}
              className='flex-1'
            >
              {isBooking
                ? isEditMode
                  ? 'Rescheduling...'
                  : 'Booking...'
                : isEditMode
                  ? 'Confirm Reschedule'
                  : 'Confirm Booking'}
            </Button>
            <Button variant='secondary' onClick={onClose} className='flex-1'>
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
