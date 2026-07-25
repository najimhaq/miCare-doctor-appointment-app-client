'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaUndo,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';
import BookingModal from './BookingModal';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-green-500/20 text-green-400 border-green-500/30',
  COMPLETED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  CANCELLED_BY_PATIENT: 'bg-red-500/20 text-red-400 border-red-500/30',
  CANCELLED_BY_DOCTOR: 'bg-red-500/20 text-red-400 border-red-500/30',
  NO_SHOW: 'bg-white/10 text-white/40 border-white/10',
};

const CANCELLED_STATUSES = ['CANCELLED_BY_PATIENT', 'CANCELLED_BY_DOCTOR'];

const NON_EDITABLE_STATUSES = [
  'CANCELLED_BY_PATIENT',
  'CANCELLED_BY_DOCTOR',
  'COMPLETED',
  'NO_SHOW',
];

export default function MyAppointmentsClient({
  initialAppointments,
  error: initialError,
}) {
  const [appointments, setAppointments] = useState(
    Array.isArray(initialAppointments) ? initialAppointments : []
  );
  const [error, setError] = useState(initialError || null);
  const [loading, setLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelled, setShowCancelled] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API.myAppointments);
      setAppointments(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    setCancellingId(id);
    try {
      await axiosInstance.delete(API.appointmentById(id));
      toast.success('Appointment cancelled');
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: 'CANCELLED_BY_PATIENT' } : a
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to cancel appointment'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await axiosInstance.patch(API.appointmentRestore(id));
      toast.success('Appointment restored');
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'PENDING' } : a))
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to restore appointment'
      );
    } finally {
      setRestoringId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingAppointment(null);
    fetchAppointments();
  };

  const cancelledCount = appointments.filter((a) =>
    CANCELLED_STATUSES.includes(a.status)
  ).length;

  const visibleAppointments = showCancelled
    ? appointments
    : appointments.filter((a) => !CANCELLED_STATUSES.includes(a.status));

  if (loading && appointments.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500' />
      </div>
    );
  }

  if (error && appointments.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center'>
        <p className='text-white/60 mb-4'>{error}</p>
        <button
          onClick={fetchAppointments}
          className='px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex flex-wrap items-start justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            My Appointments
          </h1>
          <p className='text-white/60'>
            Manage your upcoming and past appointments
          </p>
        </div>

        {cancelledCount > 0 && (
          <button
            onClick={() => setShowCancelled((prev) => !prev)}
            className='flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white text-sm transition'
          >
            {showCancelled ? (
              <>
                <FaEyeSlash className='w-3.5 h-3.5' />
                Hide Cancelled ({cancelledCount})
              </>
            ) : (
              <>
                <FaEye className='w-3.5 h-3.5' />
                Show Cancelled ({cancelledCount})
              </>
            )}
          </button>
        )}
      </div>

      {visibleAppointments.length === 0 ? (
        <div className='text-center py-16'>
          <div className='text-6xl mb-4'>📅</div>
          <p className='text-white/60'>
            {appointments.length === 0
              ? 'You have no appointments yet.'
              : 'No appointments to show.'}
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {visibleAppointments.map((appt, index) => {
            const canModify = !NON_EDITABLE_STATUSES.includes(appt.status);
            return (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2 flex-wrap'>
                    <FaUserMd className='text-cyan-400' />
                    <span className='text-white font-medium'>
                      Dr. {appt.doctor?.user?.name || 'Unknown'}
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
                  <div className='flex items-center gap-4 text-sm text-white/60 flex-wrap'>
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
                </div>

                {/* Edit and Cancel and restore buttons */}
                {appt.status === 'CANCELLED_BY_PATIENT' ? (
                  <button
                    onClick={() => handleRestore(appt.id)}
                    disabled={restoringId === appt.id}
                    className='px-3 py-2 bg-white/5 hover:bg-green-500/20 text-white/70 hover:text-green-400 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50'
                  >
                    <FaUndo className='w-3.5 h-3.5' />
                    {restoringId === appt.id ? 'Restoring...' : 'Restore'}
                  </button>
                ) : (
                  canModify && (
                    <div className='flex gap-2'>
                      <button
                        onClick={() => setEditingAppointment(appt)}
                        className='px-3 py-2 bg-white/5 hover:bg-cyan-500/20 text-white/70 hover:text-cyan-400 rounded-lg text-sm flex items-center gap-2 transition'
                      >
                        <FaEdit className='w-3.5 h-3.5' /> Edit
                      </button>
                      <button
                        onClick={() => handleCancel(appt.id)}
                        disabled={cancellingId === appt.id}
                        className='px-3 py-2 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50'
                      >
                        <FaTrash className='w-3.5 h-3.5' />
                        {cancellingId === appt.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    </div>
                  )
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {editingAppointment && (
        <BookingModal
          doctor={editingAppointment.doctor}
          appointmentId={editingAppointment.id}
          initialDate={editingAppointment.appointmentDate?.slice(0, 10)}
          initialTime={editingAppointment.startTime}
          onClose={() => setEditingAppointment(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
