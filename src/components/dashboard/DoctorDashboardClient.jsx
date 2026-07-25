// app/doctor/dashboard/DoctorDashboardClient.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaCalendarDay,
  FaUsers,
  FaHourglassHalf,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaArrowRight,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function DoctorDashboardClient({
  initialData,
  error: initialError,
  user,
}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API.doctor.dashboardStats);
      setData(res.data?.data || null);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axiosInstance.patch(API.appointmentStatus(id), {
        status: newStatus,
      });
      toast.success(`Marked as ${newStatus.replaceAll('_', ' ')}`);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (error && !data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center'>
        <p className='text-white/60 mb-4'>{error}</p>
        <button
          onClick={fetchStats}
          className='px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition'
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const todayAppointments = data?.todayAppointments || [];
  const upcomingAppointments = data?.upcomingAppointments || [];

  const statCards = [
    {
      label: "Today's Appointments",
      value: stats.todayCount ?? 0,
      icon: FaCalendarDay,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      label: 'Total Patients',
      value: stats.totalPatients ?? 0,
      icon: FaUsers,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingCount ?? 0,
      icon: FaHourglassHalf,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Completed This Week',
      value: stats.completedThisWeek ?? 0,
      icon: FaCheckCircle,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>
          Welcome back, Dr. {user?.name?.split(' ')[0] || ''}
        </h1>
        <p className='text-white/60'>
          Here's what's happening with your appointments today
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5'
            >
              <div className='flex items-center justify-between mb-3'>
                <div
                  className={`w-10 h-10 rounded-lg bg-linear-to-r ${card.color} flex items-center justify-center`}
                >
                  <Icon className='w-4 h-4 text-white' />
                </div>
              </div>
              <p className='text-2xl font-bold text-white'>{card.value}</p>
              <p className='text-sm text-white/50'>{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-white'>
              Today's Schedule
            </h2>
            <Link
              href='/doctor/appointments'
              className='text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1'
            >
              View all <FaArrowRight className='w-3 h-3' />
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <div className='text-center py-10'>
              <div className='text-4xl mb-2'>🗓️</div>
              <p className='text-white/50 text-sm'>
                No appointments scheduled today
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {todayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className='flex items-center justify-between gap-3 bg-white/5 rounded-lg p-3 border border-white/5'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0'>
                      <FaUser className='text-cyan-400 w-3.5 h-3.5' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-white text-sm font-medium truncate'>
                        {appt.patient?.user?.name || 'Unknown'}
                      </p>
                      <p className='text-white/50 text-xs flex items-center gap-1'>
                        <FaClock className='w-2.5 h-2.5' /> {appt.startTime}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2 flex-shrink-0'>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${
                        STATUS_STYLES[appt.status] ||
                        'bg-white/10 text-white/50 border-white/10'
                      }`}
                    >
                      {appt.status}
                    </span>
                    {appt.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusChange(appt.id, 'CONFIRMED')}
                        disabled={updatingId === appt.id}
                        className='text-xs px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded transition disabled:opacity-50'
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-white'>
              Upcoming Appointments
            </h2>
            <Link
              href='/doctor/appointments'
              className='text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1'
            >
              View all <FaArrowRight className='w-3 h-3' />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className='text-center py-10'>
              <div className='text-4xl mb-2'>📅</div>
              <p className='text-white/50 text-sm'>No upcoming appointments</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className='flex items-center justify-between gap-3 bg-white/5 rounded-lg p-3 border border-white/5'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0'>
                      <FaUser className='text-emerald-400 w-3.5 h-3.5' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-white text-sm font-medium truncate'>
                        {appt.patient?.user?.name || 'Unknown'}
                      </p>
                      <p className='text-white/50 text-xs'>
                        {new Date(appt.appointmentDate).toLocaleDateString(
                          'en-GB'
                        )}{' '}
                        · {appt.startTime}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs border flex-shrink-0 ${
                      STATUS_STYLES[appt.status] ||
                      'bg-white/10 text-white/50 border-white/10'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
