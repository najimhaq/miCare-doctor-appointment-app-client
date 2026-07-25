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
import { FiHeart, FiShare2, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  const rating = doctor?.rating ?? 0;
  const totalReviews = doctor?.totalReviews ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const experienceYears = doctor?.experienceYears ?? 0;
  const experienceText =
    experienceYears === 0
      ? 'New'
      : experienceYears === 1
        ? '1 Year'
        : `${experienceYears} Years`;

  const doctorName = doctor?.user?.name || 'Unknown';
  const doctorImage = doctor?.image || doctor?.user?.image;
  const showImage = Boolean(doctorImage) && !imgError;
  const isApproved = doctor?.isApproved !== false;

  const getInitials = (name) => {
    if (!name) return 'D';
    const cleanName = name.replace(/^Dr\.?\s*/i, '');
    return cleanName
      .split(' ')
      .filter(Boolean)
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
        title: `Dr. ${doctorName}`,
        text: `Check out Dr. ${doctorName} - ${doctor?.specialization}`,
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
      window.location.href = `/dashboard/patient/appointments/book?doctorId=${doctor.id}`;
    }
  };

  return (
    <motion.div
      className='group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10'
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
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

      <div className='relative h-48 md:h-56 overflow-hidden bg-linear-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20'>
        {showImage ? (
          <Image
            src={doctorImage}
            alt={doctorName}
            fill
            unoptimized
            onError={() => setImgError(true)}
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-r from-cyan-500 to-emerald-500 flex items-center justify-center'>
              <span className='text-4xl md:text-5xl font-bold text-white'>
                {getInitials(doctorName)}
              </span>
            </div>
          </div>
        )}

        <div className='absolute bottom-3 left-3'>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              isApproved
                ? 'bg-green-500/80 text-white'
                : 'bg-yellow-500/80 text-white'
            }`}
          >
            {isApproved ? 'Verified' : 'Pending Approval'}
          </span>
        </div>
      </div>

      <div className='p-4 md:p-5'>
        <div className='mb-3'>
          <Link href={`/doctors/${doctor?.id}`}>
            <h3 className='text-lg font-semibold text-white hover:text-cyan-400 transition-colors line-clamp-1'>
              Dr. {doctorName}
            </h3>
          </Link>
          <div className='flex items-center gap-2 mt-1'>
            <FaStethoscope className='w-3 h-3 text-cyan-400' />
            <p className='text-sm text-white/70 line-clamp-1'>
              {doctor?.specialization || 'General Physician'}
            </p>
          </div>
        </div>

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
          <span className='text-sm font-medium text-white'>
            {rating.toFixed(1)}
          </span>
          <span className='text-xs text-white/40'>
            ({totalReviews} reviews)
          </span>
        </div>

        <div className='grid grid-cols-2 gap-2 mb-4'>
          <div className='flex items-center gap-2 text-sm text-white/60'>
            <FaHospital className='w-3.5 h-3.5 text-cyan-400' />
            <span className='line-clamp-1'>{doctor?.hospital || 'N/A'}</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-white/60'>
            <FaClock className='w-3.5 h-3.5 text-cyan-400' />
            <span>{experienceText}</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-white/60 col-span-2'>
            <FaMapMarkerAlt className='w-3.5 h-3.5 text-cyan-400' />
            <span className='line-clamp-1'>{doctor?.location || 'N/A'}</span>
          </div>
        </div>

        <div className='flex items-center justify-between mb-4'>
          <div>
            <p className='text-xs text-white/40'>Consultation Fee</p>
            <p className='text-lg font-bold text-white'>
              ৳{doctor?.consultationFee ?? 500}
            </p>
          </div>
          {isApproved && (
            <div className='flex items-center gap-1 text-xs text-green-400'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
              </span>
              Available Today
            </div>
          )}
        </div>

        <div className='flex flex-col sm:flex-row gap-2'>
          <motion.button
            onClick={handleBookAppointment}
            className='flex-1 px-4 py-2.5 bg-linear-to-r from-cyan-500 to-emerald-500 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaCalendarCheck className='w-4 h-4' />
            Book Appointment
          </motion.button>

          <Link href={`/all-doctors/${doctor?.id}`}>
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
