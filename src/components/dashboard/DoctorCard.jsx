// frontend/components/DoctorCard.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUserMd,
  FaStethoscope,
  FaHospital,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaPhone,
  FaVideo,
} from 'react-icons/fa';
import { FiHeart, FiShare2, FiUser, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate rating (you can replace with actual rating from backend)
  const rating = doctor?.rating || 4.5;
  const totalReviews = doctor?.totalReviews || 128;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Format experience
  const experience = doctor?.experience || 0;
  const experienceText =
    experience === 0
      ? 'Fresher'
      : experience === 1
        ? '1 Year'
        : `${experience} Years`;

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'D';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Dr. ${doctor?.user?.name}`,
        text: `Check out Dr. ${doctor?.user?.name} - ${doctor?.specialization}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookAppointment) {
      onBookAppointment(doctor);
    } else {
      // Default action - redirect to booking page
      window.location.href = `/dashboard/patient/appointments/book?doctorId=${doctor.id}`;
    }
  };

  return (
    <motion.div
      className='group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Favorite & Share Buttons */}
      <div className='absolute top-3 right-3 z-10 flex flex-col gap-2'>
        <motion.button
          onClick={handleFavorite}
          className='p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-red-400 transition-all duration-200'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiHeart
            className={`w-4 h-4 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`}
          />
        </motion.button>
        <motion.button
          onClick={handleShare}
          className='p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-cyan-400 transition-all duration-200'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiShare2 className='w-4 h-4' />
        </motion.button>
      </div>

      {/* Doctor Image */}
      <div className='relative h-48 md:h-56 overflow-hidden bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20'>
        {doctor?.user?.image ? (
          <Image
            src={doctor.user.image}
            alt={doctor.user.name}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center'>
              <span className='text-4xl md:text-5xl font-bold text-white'>
                {getInitials(doctor?.user?.name)}
              </span>
            </div>
          </div>
        )}

        {/* Availability Badge */}
        <div className='absolute bottom-3 left-3'>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              doctor?.isAvailable !== false
                ? 'bg-green-500/80 text-white'
                : 'bg-red-500/80 text-white'
            }`}
          >
            {doctor?.isAvailable !== false ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Doctor Info */}
      <div className='p-4 md:p-5'>
        {/* Name & Specialization */}
        <div className='mb-3'>
          <Link href={`/doctors/${doctor?.id}`}>
            <h3 className='text-lg font-semibold text-white hover:text-cyan-400 transition-colors line-clamp-1'>
              Dr. {doctor?.user?.name || 'Unknown'}
            </h3>
          </Link>
          <div className='flex items-center gap-2 mt-1'>
            <FaStethoscope className='w-3 h-3 text-cyan-400' />
            <p className='text-sm text-white/70 line-clamp-1'>
              {doctor?.specialization || 'General Physician'}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className='flex items-center gap-2 mb-3'>
          <div className='flex items-center gap-0.5'>
            {[...Array(fullStars)].map((_, i) => (
              <FaStar
                key={`full-${i}`}
                className='w-3.5 h-3.5 text-yellow-400'
              />
            ))}
            {hasHalfStar && (
              <FaStarHalfAlt className='w-3.5 h-3.5 text-yellow-400' />
            )}
            {[...Array(emptyStars)].map((_, i) => (
              <FaRegStar
                key={`empty-${i}`}
                className='w-3.5 h-3.5 text-white/30'
              />
            ))}
          </div>
          <span className='text-sm font-medium text-white'>{rating}</span>
          <span className='text-xs text-white/40'>
            ({totalReviews} reviews)
          </span>
        </div>

        {/* Details Grid */}
        <div className='grid grid-cols-2 gap-2 mb-4'>
          <div className='flex items-center gap-2 text-sm text-white/60'>
            <FaHospital className='w-3.5 h-3.5 text-cyan-400' />
            <span className='line-clamp-1'>{doctor?.hospital || 'N/A'}</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-white/60'>
            <FaClock className='w-3.5 h-3.5 text-cyan-400' />
            <span>{experienceText}</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-white/60'>
            <FaMapMarkerAlt className='w-3.5 h-3.5 text-cyan-400' />
            <span className='line-clamp-1'>
              {doctor?.chamberAddress || 'N/A'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-sm text-white/60'>
            <FiUser className='w-3.5 h-3.5 text-cyan-400' />
            <span>{doctor?.patientsCount || 0} patients</span>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className='flex items-center justify-between mb-4'>
          <div>
            <p className='text-xs text-white/40'>Consultation Fee</p>
            <p className='text-lg font-bold text-white'>
              ৳{doctor?.consultationFee || 500}
            </p>
          </div>
          {doctor?.isAvailable !== false && (
            <div className='flex items-center gap-1 text-xs text-green-400'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
              </span>
              Available Today
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-2'>
          <motion.button
            onClick={handleBookAppointment}
            className='flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaCalendarCheck className='w-4 h-4' />
            Book Appointment
          </motion.button>

          <Link href={`/doctors/${doctor?.id}`}>
            <motion.button
              className='px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUserMd className='w-4 h-4' />
              <span className='hidden sm:inline'>Profile</span>
            </motion.button>
          </Link>
        </div>

        {/* Quick Action Icons */}
        <div className='flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/5'>
          <button className='text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 text-xs'>
            <FaPhone className='w-3 h-3' />
            Call
          </button>
          <button className='text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 text-xs'>
            <FiMail className='w-3 h-3' />
            Message
          </button>
          <button className='text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 text-xs'>
            <FaVideo className='w-3 h-3' />
            Video Call
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
