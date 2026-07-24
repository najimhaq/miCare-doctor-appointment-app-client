'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import axiosInstance from '@/lib/api/axiosInstance';
import DoctorCard from '@/components/dashboard/DoctorCard';

export default function DoctorsClient({
  initialDoctors,
  initialPagination,
  error: initialError,
}) {
  const [doctors, setDoctors] = useState(
    Array.isArray(initialDoctors) ? initialDoctors : []
  );
  const [pagination, setPagination] = useState(initialPagination);
  const [error, setError] = useState(initialError || null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [page, setPage] = useState(1);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('/api/doctors/specialties')
      .then((res) => setSpecialties(res.data?.data || []))
      .catch((err) => console.error('Failed to load specialties:', err));
  }, []);

  const fetchDoctors = async (targetPage = 1, overrideSpecialty) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/doctors', {
        params: {
          page: targetPage,
          limit: 9,
          search: searchTerm || undefined,
          specialty:
            overrideSpecialty !== undefined
              ? overrideSpecialty
              : filterSpecialty || undefined,
        },
      });
      setDoctors(response.data?.data || []);
      setPagination(response.data?.pagination || null);
      setPage(targetPage);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchDoctors(1);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500' />
      </div>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center text-center'>
        <p className='text-white/60 mb-4'>{error}</p>
        <button
          onClick={() => fetchDoctors(page)}
          className='flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition'
        >
          <FiRefreshCw /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-900/50 p-4 md:p-8 md:py-20 w-full'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 flex items-center justify-between'
        >
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>Our Doctors</h1>
            <p className='text-white/60'>
              Find the best healthcare professionals
            </p>
          </div>
          <button
            onClick={() => fetchDoctors(page)}
            className='p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-400 transition'
          >
            <FiRefreshCw />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-8'
        >
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40' />
              <input
                type='text'
                placeholder='Search doctors by name or specialty...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className='w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition'
              />
            </div>
            <div className='relative'>
              <FiFilter className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40' />
              <select
                value={filterSpecialty}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterSpecialty(value);
                  fetchDoctors(1, value);
                }}
                className='pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
              >
                <option value=''>All Specialties</option>
                {specialties.map((s) => (
                  <option key={s} value={s} className='bg-slate-800'>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className='px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition'
            >
              Search
            </button>
          </div>
        </motion.div>

        {doctors.length > 0 ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className='flex items-center justify-center gap-4 mt-10'>
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => fetchDoctors(page - 1)}
                  className='p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30'
                >
                  <FiChevronLeft />
                </button>
                <span className='text-white/70'>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => fetchDoctors(page + 1)}
                  className='p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30'
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>👨‍⚕️</div>
            <p className='text-white/60'>No doctors found</p>
          </div>
        )}
      </div>
    </div>
  );
}
