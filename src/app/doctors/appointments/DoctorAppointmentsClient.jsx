'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-green-500/20 text-green-400 border-green-500/30',
  COMPLETED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  CANCELLED_BY_PATIENT: 'bg-red-500/20 text-red-400 border-red-500/30',
  CANCELLED_BY_DOCTOR: 'bg-red-500/20 text-red-400 border-red-500/30',
  NO_SHOW: 'bg-white/10 text-white/40 border-white/10',
};

const STATUS_FILTERS = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED_BY_PATIENT',
  'CANCELLED_BY_DOCTOR',
  'NO_SHOW',
];

export default function DoctorAppointmentsClient({
  initialAppointments,
  initialPagination,
  error: initialError,
}) {
  const [appointments, setAppointments] = useState(
    Array.isArray(initialAppointments) ? initialAppointments : []
  );
  const [pagination, setPagination] = useState(initialPagination);
  const [error, setError] = useState(initialError || null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async (
    targetPage = 1,
    status = statusFilter,
    date = dateFilter
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(API.doctor.appointmentHistory, {
        params: {
          page: targetPage,
          limit: 10,
          status: status === 'ALL' ? undefined : status,
          date: date || undefined,
        },
      });
      setAppointments(res.data?.data || []);
      setPagination(res.data?.pagination || null);
      setPage(targetPage);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments');
      toast.error('Failed to load appointments');
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
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold text-white mb-2'>
        Appointment History
      </h1>
      <p className='text-white/60 mb-8'>
        View and manage your patient appointments
      </p>

      <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-6 flex flex-col md:flex-row gap-4'>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            fetchAppointments(1, e.target.value, dateFilter);
          }}
          className='px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400'
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s} className='bg-slate-800'>
              {s.replaceAll('_', ' ')}
            </option>
          ))}
        </select>

        <input
          type='date'
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            fetchAppointments(1, statusFilter, e.target.value);
          }}
          className='px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400'
        />

        {dateFilter && (
          <button
            onClick={() => {
              setDateFilter('');
              fetchAppointments(1, statusFilter, '');
            }}
            className='px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 text-sm transition'
          >
            Clear Date
          </button>
        )}
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-16'>
          <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500' />
        </div>
      ) : error && appointments.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-white/60 mb-4'>{error}</p>
          <button
            onClick={() => fetchAppointments(page)}
            className='px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition'
          >
            Retry
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className='text-center py-16'>
          <div className='text-6xl mb-4'>📋</div>
          <p className='text-white/60'>
            No appointments found for this filter.
          </p>
        </div>
      ) : (
        <>
          <div className='space-y-4'>
            {appointments.map((appt, index) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5'
              >
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2 flex-wrap'>
                      <FaUser className='text-cyan-400' />
                      <span className='text-white font-medium'>
                        {appt.patient?.user?.name || 'Unknown Patient'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs border ${
                          STATUS_STYLES[appt.status] ||
                          'bg-white/10 text-white/50 border-white/10'
                        }`}
                      >
                        {appt.status.replaceAll('_', ' ')}
                      </span>
                    </div>

                    <div className='flex items-center gap-4 text-sm text-white/60 flex-wrap mb-2'>
                      <span className='flex items-center gap-1'>
                        <FaCalendarAlt className='text-cyan-400/70' />
                        {new Date(appt.appointmentDate).toLocaleDateString(
                          'en-GB'
                        )}
                      </span>
                      <span className='flex items-center gap-1'>
                        <FaClock className='text-cyan-400/70' />
                        {appt.startTime} - {appt.endTime}
                      </span>
                    </div>

                    <div className='flex items-center gap-4 text-xs text-white/40 flex-wrap'>
                      {appt.patient?.user?.email && (
                        <span className='flex items-center gap-1'>
                          <FaEnvelope className='w-3 h-3' />
                          {appt.patient.user.email}
                        </span>
                      )}
                      {appt.patient?.emergencyContactPhone && (
                        <span className='flex items-center gap-1'>
                          <FaPhone className='w-3 h-3' />
                          {appt.patient.emergencyContactPhone}
                        </span>
                      )}auth
                    </div>

                    {appt.reason && (
                      <p className='text-sm text-white/50 mt-2'>
                        Reason: {appt.reason}
                      </p>
                    )}
                  </div>

                  {['PENDING', 'CONFIRMED'].includes(appt.status) && (
                    <div className='flex gap-2 flex-wrap'>
                      {appt.status === 'PENDING' && (
                        <button
                          onClick={() =>
                            handleStatusChange(appt.id, 'CONFIRMED')
                          }
                          disabled={updatingId === appt.id}
                          className='px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50'
                        >
                          <FaCheckCircle className='w-3.5 h-3.5' /> Confirm
                        </button>
                      )}
                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() =>
                            handleStatusChange(appt.id, 'COMPLETED')
                          }
                          disabled={updatingId === appt.id}
                          className='px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50'
                        >
                          <FaCheckCircle className='w-3.5 h-3.5' /> Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(appt.id, 'NO_SHOW')}
                        disabled={updatingId === appt.id}
                        className='px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50'
                      >
                        No Show
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(appt.id, 'CANCELLED_BY_DOCTOR')
                        }
                        disabled={updatingId === appt.id}
                        className='px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50'
                      >
                        <FaTimesCircle className='w-3.5 h-3.5' /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-center gap-4 mt-8'>
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => fetchAppointments(page - 1)}
                className='p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30'
              >
                <FaChevronLeft />
              </button>
              <span className='text-white/70'>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => fetchAppointments(page + 1)}
                className='p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30'
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
