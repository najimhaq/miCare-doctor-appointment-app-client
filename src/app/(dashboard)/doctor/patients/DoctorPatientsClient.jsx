// app/doctor/patients/DoctorPatientsClient.jsx
'use client';

import { useState } from 'react';
import { FaUser, FaSearch, FaCalendarCheck } from 'react-icons/fa';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';

export default function DoctorPatientsClient({
  initialData,
  error: initialError,
}) {
  const [patients, setPatients] = useState(initialData || []);
  const [error, setError] = useState(initialError);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.get(API.doctor.patients, {
        params: { search },
      });
      setPatients(res.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-white mb-2'>My Patients</h1>
        <p className='text-white/60'>
          Patients who have booked appointments with you
        </p>
      </div>

      <form onSubmit={handleSearch} className='mb-6 flex gap-2'>
        <div className='relative flex-1'>
          <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-3.5 h-3.5' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search patients by name...'
            className='w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50'
          />
        </div>
        <button
          type='submit'
          className='px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition text-sm'
        >
          Search
        </button>
      </form>

      {error && <p className='text-red-400/70 text-sm mb-4'>{error}</p>}

      {patients.length === 0 ? (
        <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-10 text-center'>
          <div className='text-4xl mb-3'>👥</div>
          <p className='text-white/60'>No patients found yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {patients.map((p) => (
            <div
              key={p.id}
              className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5'
            >
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0'>
                  <FaUser className='text-cyan-400 w-4 h-4' />
                </div>
                <div className='min-w-0'>
                  <p className='text-white font-medium truncate'>
                    {p.name || 'Unknown'}
                  </p>
                  <p className='text-white/50 text-xs truncate'>{p.email}</p>
                </div>
              </div>

              <div className='space-y-1.5 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-white/50'>Phone</span>
                  <span className='text-white'>{p.phone || '—'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-white/50'>Gender</span>
                  <span className='text-white'>{p.gender || '—'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-white/50'>Total Visits</span>
                  <span className='text-white'>{p.totalVisits}</span>
                </div>
                <div className='flex justify-between items-center pt-2 border-t border-white/5 mt-2'>
                  <span className='text-white/50 flex items-center gap-1 text-xs'>
                    <FaCalendarCheck className='w-3 h-3' /> Last Visit
                  </span>
                  <span className='text-white text-xs'>
                    {p.lastVisit
                      ? new Date(p.lastVisit).toLocaleDateString('en-GB')
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
