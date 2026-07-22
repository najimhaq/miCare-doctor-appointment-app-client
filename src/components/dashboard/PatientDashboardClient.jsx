// components/dashboard/PatientDashboardClient.js
'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ClipLoader, RiseLoader } from 'react-spinners';
import { useApi } from '@/hooks/useApi';

export default function PatientDashboardClient({ user }) {
  const { data, loading, error } = useApi('/api/appointments/my'); // ✅ hook সরাসরি এখানে
  if (loading) return <RiseLoader color='#008080' />;
  if (error) return <p>Error: {error}</p>;
  const appointments = data?.appointments || [];

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter((a) => a.status === 'CONFIRMED').length,
    pending: appointments.filter((a) => a.status === 'PENDING').length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
  };

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold text-white'>
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className='text-gray-400 mt-1'>
          Here's an overview of your health journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          icon={Calendar}
          label='Total Appointments'
          value={stats.total}
          color='teal'
        />
        <StatCard
          icon={Clock}
          label='Upcoming'
          value={stats.upcoming}
          color='blue'
        />
        <StatCard
          icon={XCircle}
          label='Pending'
          value={stats.pending}
          color='yellow'
        />
        <StatCard
          icon={CheckCircle}
          label='Completed'
          value={stats.completed}
          color='green'
        />
      </div>

      {/* Recent Appointments */}
      <div className='bg-gray-900/50 border border-gray-800 rounded-2xl p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>
          Recent Appointments
        </h2>

        {isLoading ? (
          <div className='flex justify-center py-10'>
            <ClipLoader size={28} color='#14b8a6' />
          </div>
        ) : appointments.length === 0 ? (
          <div className='text-center py-10 text-gray-500'>
            <Calendar className='w-10 h-10 mx-auto mb-3 opacity-40' />
            <p>No appointments yet. Book your first consultation!</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {appointments.slice(0, 5).map((appt) => (
              <div
                key={appt.id}
                className='flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg'
              >
                <div>
                  <p className='text-white font-medium'>
                    {appt.doctor?.user?.name}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {new Date(appt.date).toLocaleDateString()} · {appt.timeSlot}
                  </p>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    teal: 'text-teal-400 bg-teal-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    green: 'text-green-400 bg-green-500/10',
  };
  return (
    <div className='bg-gray-900/50 border border-gray-800 rounded-2xl p-5'>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}
      >
        <Icon className='w-5 h-5' />
      </div>
      <p className='text-2xl font-bold text-white'>{value}</p>
      <p className='text-sm text-gray-500'>{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-yellow-500/10 text-yellow-400',
    CONFIRMED: 'bg-blue-500/10 text-blue-400',
    COMPLETED: 'bg-green-500/10 text-green-400',
    CANCELLED: 'bg-red-500/10 text-red-400',
  };
  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}
