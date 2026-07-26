// frontend/app/doctors/[id]/DoctorDetailsClient.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaStethoscope,
  FaHospital,
  FaClock,
  FaCalendarCheck,
  FaPhone,
  FaVideo,
  FaAward,
  FaUsers,
} from 'react-icons/fa';
import {
  FiHeart,
  FiShare2,
  FiChevronLeft,
  FiMapPin,
  FiMail,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function DoctorDetailsClient({ doctor, session, error }) {
  // console.log('DoctorDetailsClient', doctor);
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>😔</div>
          <h2 className='text-2xl font-bold text-white'>
            Failed to load doctor
          </h2>
          <p className='text-white/60 mt-2'>{error}</p>
          <Link href='/doctors'>
            <Button className='mt-4'>Back to Doctors</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  const rating = doctor.rating ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const schedules = doctor.schedules || [];
  const availableDayNumbers = schedules
    .filter((s) => s.isAvailable)
    .map((s) => s.dayOfWeek);
  const hasActiveSchedule = availableDayNumbers.length > 0;
  const canBook = doctor.isApproved && hasActiveSchedule;

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);

    if (!date) return;

    setLoadingSlots(true);
    try {
      const res = await axiosInstance.get(
        `${API.doctor.doctorById(doctor.id)}/available-slots`,
        {
          params: { date },
        }
      );
      setAvailableSlots(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load slots:', err);
      toast.error('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: `Dr. ${doctor.user?.name}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success('Link copied!'));
    }
  };

  const handleBookAppointment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book appointment');
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    setIsBooking(true);
    try {
      const response = await axiosInstance.post(API.bookAppointment, {
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedTime,
      });

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        setShowBookingModal(false);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableSlots([]);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to book appointment'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const openBookingModal = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book appointment');
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <div className='min-h-screen bg-slate-900 py-8 px-4 md:px-8'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='max-w-7xl mx-auto'
      >
        <motion.div variants={itemVariants} className='mb-6'>
          <Link
            href='/doctors'
            className='inline-flex items-center gap-2 text-white/60 hover:text-white transition md:mt-25'
          >
            <FiChevronLeft className='w-5 h-5' />
            Back to Doctors
          </Link>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <motion.div
              variants={itemVariants}
              className='bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8'
            >
              <div className='flex flex-col md:flex-row gap-6'>
                <div className='shrink-0'>
                  <div className='w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-cyan-500/30 shadow-xl shadow-cyan-500/10'>
                    {doctor.image || doctor.user?.image ? (
                      <Image
                        src={doctor.image || doctor.user.image}
                        alt={doctor.user?.name || 'Doctor'}
                        width={160}
                        height={160}
                        unoptimized
                        loading='eager'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-linear-to-r from-cyan-500 to-emerald-500 flex items-center justify-center'>
                        <span className='text-5xl font-bold text-white'>
                          {doctor.user?.name?.charAt(0)?.toUpperCase() || 'D'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex-1'>
                  <div className='flex flex-wrap items-start justify-between gap-2'>
                    <div>
                      <h1 className='text-2xl md:text-3xl font-bold text-white'>
                        Dr. {doctor.user?.name}
                      </h1>
                      <p className='text-cyan-400 font-medium flex items-center gap-2 mt-1'>
                        <FaStethoscope className='w-4 h-4' />
                        {doctor.specialization || 'General Physician'}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className='p-2 rounded-full bg-white/5 hover:bg-white/10 transition'
                      >
                        <FiHeart
                          className={`w-5 h-5 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white/60'}`}
                        />
                      </button>
                      <button
                        onClick={handleShare}
                        className='p-2 rounded-full bg-white/5 hover:bg-white/10 transition'
                      >
                        <FiShare2 className='w-5 h-5 text-white/60' />
                      </button>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 mt-3'>
                    <div className='flex items-center gap-0.5'>
                      {[...Array(fullStars)].map((_, i) => (
                        <FaStar key={i} className='w-4 h-4 text-yellow-400' />
                      ))}
                      {hasHalfStar && (
                        <FaStarHalfAlt className='w-4 h-4 text-yellow-400' />
                      )}
                      {[...Array(emptyStars)].map((_, i) => (
                        <FaRegStar key={i} className='w-4 h-4 text-white/30' />
                      ))}
                    </div>
                    <span className='text-white font-medium'>
                      {rating.toFixed(1)}
                    </span>
                    <span className='text-white/40 text-sm'>
                      ({doctor.totalReviews ?? 0} reviews)
                    </span>
                  </div>

                  <div className='grid grid-cols-2 gap-3 mt-4'>
                    <div className='flex items-center gap-2 text-sm text-white/60'>
                      <FaHospital className='w-4 h-4 text-cyan-400' />
                      <span>{doctor.hospital || 'N/A'}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-white/60'>
                      <FaClock className='w-4 h-4 text-cyan-400' />
                      <span>
                        {doctor.experienceYears || 0} Years Experience
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-white/60'>
                      <FaAward className='w-4 h-4 text-cyan-400' />
                      <span>{doctor.qualifications || 'N/A'}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-white/60'>
                      <FaUsers className='w-4 h-4 text-cyan-400' />
                      <span>{doctor.patientsCount || 0} Patients</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6'
            >
              <h2 className='text-lg font-semibold text-white mb-3'>
                About Doctor
              </h2>
              <p className='text-white/70 leading-relaxed'>
                {doctor.about ||
                  `Dr. ${doctor.user?.name} is a ${doctor.specialization || 'medical professional'} with ${doctor.experienceYears || 0} years of experience, currently practicing at ${doctor.hospital || 'their clinic'}.`}
                {doctor.qualifications &&
                  ` They hold qualifications in ${doctor.qualifications}.`}
              </p>
              <div className='mt-4 flex flex-wrap gap-2'>
                <span className='px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/20'>
                  {doctor.specialization}
                </span>
                <span className='px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20'>
                  {doctor.experienceYears}+ Years
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6'
            >
              <h2 className='text-lg font-semibold text-white mb-3 flex items-center gap-2'>
                <FiMapPin className='w-5 h-5 text-cyan-400' />
                Location
              </h2>
              <p className='text-white/70'>
                {doctor.location || 'Address not available'}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6'
            >
              <h2 className='text-lg font-semibold text-white mb-3'>Reviews</h2>
              <div className='text-center py-8 text-white/40'>
                <p>No reviews yet. Be the first to review!</p>
              </div>
            </motion.div>
          </div>

          <div className='space-y-6'>
            <motion.div
              variants={itemVariants}
              className='bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sticky top-24'
            >
              <h3 className='text-lg font-semibold text-white mb-2'>
                Consultation Fee
              </h3>
              <p className='text-3xl font-bold text-white'>
                ৳{doctor.consultationFee ?? 500}
                <span className='text-sm font-normal text-white/40 ml-2'>
                  / visit
                </span>
              </p>

              <div className='mt-4 space-y-3'>
                <div className='flex items-center gap-2 text-sm'>
                  <span className='relative flex h-3 w-3'>
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${canBook ? 'bg-green-400' : 'bg-red-400'} opacity-75`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${canBook ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                  </span>
                  <span className={canBook ? 'text-green-400' : 'text-red-400'}>
                    {canBook
                      ? 'Accepting Appointments'
                      : 'Currently Unavailable'}
                  </span>
                </div>

                <div className='text-sm text-white/60'>
                  <p className='font-medium text-white/80 mb-1'>
                    Available Days:
                  </p>
                  <div className='flex flex-wrap gap-1'>
                    {DAY_NAMES.map((day, index) => (
                      <span
                        key={day}
                        className={`px-2 py-0.5 rounded text-xs ${
                          availableDayNumbers.includes(index)
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/5 text-white/30'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={openBookingModal}
                className='w-full mt-6'
                disabled={!canBook}
              >
                <FaCalendarCheck className='w-4 h-4' />
                Book Appointment
              </Button>

              <div className='mt-4 flex gap-2'>
                <button className='flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white text-sm transition flex items-center justify-center gap-2'>
                  <FaPhone className='w-3 h-3' /> Call
                </button>
                <button className='flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white text-sm transition flex items-center justify-center gap-2'>
                  <FiMail className='w-3 h-3' /> Message
                </button>
                <button className='flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white text-sm transition flex items-center justify-center gap-2'>
                  <FaVideo className='w-3 h-3' /> Video
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {showBookingModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='bg-slate-900 rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl'
          >
            <h3 className='text-xl font-bold text-white mb-4'>
              Book Appointment
            </h3>
            <p className='text-white/60 text-sm mb-4'>
              Dr. {doctor.user?.name} - {doctor.specialization}
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
                  onClick={handleBookAppointment}
                  isLoading={isBooking}
                  disabled={!selectedDate || !selectedTime || isBooking}
                  className='flex-1'
                >
                  Confirm Booking
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedDate('');
                    setSelectedTime('');
                    setAvailableSlots([]);
                  }}
                  className='flex-1'
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
