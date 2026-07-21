// frontend/app/doctors/DoctorsClient.jsx
'use client';

import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DoctorCard from '@/components/dashboard/DoctorCard';
import axiosInstance from '@/lib/api/axiosInstance';

export default function DoctorsClient({ initialDoctors, error }) {
  const [doctors, setDoctors] = useState(initialDoctors || []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');

  // If initial data has error or is empty, fetch on client
  useEffect(() => {
    if (error || !initialDoctors || initialDoctors.length === 0) {
      fetchDoctors();
    }
  }, [error]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      !filterSpecialty || doctor.specialization === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter
  const specialties = [
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-900/50 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold text-white mb-2'>Our Doctors</h1>
          <p className='text-white/60'>
            Find the best healthcare professionals
          </p>
        </motion.div>

        {/* Search and Filter */}
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
                className='w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition'
              />
            </div>
            <div className='relative'>
              <FiFilter className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40' />
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className='pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
              >
                <option value=''>All Specialties</option>
                {specialties.map((specialty) => (
                  <option
                    key={specialty}
                    value={specialty}
                    className='bg-slate-800'
                  >
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredDoctors.map((doctor, index) => (
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
        ) : (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>👨‍⚕️</div>
            <p className='text-white/60'>No doctors found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='mt-4 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition'
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
