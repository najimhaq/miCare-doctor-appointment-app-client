// frontend/components/dashboard/PatientProfileClient.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiClock,
  FiHeart,
  FiActivity,
  FiFileText,
  FiCamera,
  FiCheckCircle,
  FiAlertCircle,
  FiDroplet,
} from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import api from '@/lib/api/axiosApi';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export default function PatientProfileClient({ user, session }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState(user || {});
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    bloodGroup: user?.bloodGroup || '',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
    medicalHistory: user?.medicalHistory || '',
  });

  const [editData, setEditData] = useState(formData);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    cancelledAppointments: 0,
  });

  const bloodGroups = [
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
  ];

  // Fetch latest data on mount
  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const response = await api.get('/api/patient/profile');
      if (response.data) {
        const data = response.data;
        setPatient(data);
        setFormData({
          name: data.user?.name || '',
          email: data.user?.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          bloodGroup: data.bloodGroup || '',
          address: data.address || '',
          emergencyContact: data.emergencyContact || '',
          medicalHistory: data.medicalHistory || '',
        });
        setEditData({
          name: data.user?.name || '',
          email: data.user?.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          bloodGroup: data.bloodGroup || '',
          address: data.address || '',
          emergencyContact: data.emergencyContact || '',
          medicalHistory: data.medicalHistory || '',
        });

        // Update stats
        const appointments = data.appointments || [];
        setStats({
          totalAppointments: appointments.length,
          completedAppointments: appointments.filter(
            (a) => a.status === 'COMPLETED'
          ).length,
          upcomingAppointments: appointments.filter(
            (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
          ).length,
          cancelledAppointments: appointments.filter(
            (a) => a.status === 'CANCELLED'
          ).length,
        });
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast.error('Failed to load patient data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/api/patient/profile', editData);

      if (response.data.success) {
        setFormData(editData);
        setPatient(response.data.patient);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        // Refresh data
        await fetchPatientData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(formData);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/api/patient/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPatient((prev) => ({
          ...prev,
          user: { ...prev.user, image: response.data.imageUrl },
        }));
        toast.success('Avatar updated successfully!');
        await fetchPatientData();
      }
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  const getBloodGroupDisplay = (bg) => {
    if (!bg) return 'Not specified';
    return bg.replace('_', ' ');
  };

  const getAppointmentStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-400 bg-yellow-400/10',
      CONFIRMED: 'text-blue-400 bg-blue-400/10',
      COMPLETED: 'text-green-400 bg-green-400/10',
      CANCELLED: 'text-red-400 bg-red-400/10',
      RESCHEDULED: 'text-orange-400 bg-orange-400/10',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'medical', label: 'Medical History', icon: FiHeart },
    { id: 'settings', label: 'Settings', icon: FiEdit2 },
  ];

  return (
    <div className='min-h-screen bg-slate-900/50 p-4 md:p-8'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='max-w-7xl mx-auto space-y-6'
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className='relative'>
          {/* Cover Image */}
          <div className='relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20'>
            <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-teal-500/30 to-emerald-500/30' />
            <div className='absolute inset-0 backdrop-blur-3xl' />
          </div>

          {/* Profile Info */}
          <div className='relative -mt-16 md:-mt-20 px-4 md:px-8 flex flex-col md:flex-row items-start md:items-end gap-4'>
            {/* Avatar */}
            <div className='relative group'>
              <div className='w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-xl'>
                {patient?.user?.image ? (
                  <Image
                    src={patient.user.image}
                    alt={patient.user.name}
                    width={128}
                    height={128}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center'>
                    <span className='text-4xl font-bold text-white'>
                      {patient?.name?.charAt(0)?.toUpperCase() ||
                        patient?.user?.name?.charAt(0)?.toUpperCase() ||
                        'P'}
                    </span>
                  </div>
                )}
              </div>
              <button
                className='absolute bottom-1 right-1 p-1.5 bg-slate-800 rounded-full border border-white/10 hover:bg-slate-700 transition'
                onClick={() =>
                  document.getElementById('avatar-upload')?.click()
                }
              >
                <FiCamera className='w-4 h-4 text-white' />
              </button>
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleAvatarUpload}
              />
            </div>

            {/* User Info */}
            <div className='flex-1'>
              <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
                <h1 className='text-2xl md:text-3xl font-bold text-white'>
                  {patient?.user?.name || patient?.name || 'Patient'}
                </h1>
                <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium'>
                  <FiCheckCircle className='w-3 h-3' />
                  {patient?.user?.role || 'Patient'}
                </span>
              </div>
              <p className='text-white/60 text-sm flex items-center gap-2 mt-1'>
                <FiMail className='w-4 h-4' />
                {patient?.user?.email || patient?.email}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2'>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className='px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition flex items-center gap-2'
              >
                {isEditing ? (
                  <FiX className='w-4 h-4' />
                ) : (
                  <FiEdit2 className='w-4 h-4' />
                )}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className='grid grid-cols-2 md:grid-cols-4 gap-4'
        >
          {[
            {
              icon: FiCalendar,
              label: 'Total Appointments',
              value: stats.totalAppointments,
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: FiCheckCircle,
              label: 'Completed',
              value: stats.completedAppointments,
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: FiClock,
              label: 'Upcoming',
              value: stats.upcomingAppointments,
              color: 'from-yellow-500 to-orange-500',
            },
            {
              icon: FiAlertCircle,
              label: 'Cancelled',
              value: stats.cancelledAppointments,
              color: 'from-red-500 to-pink-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={statVariants}
              whileHover={{ y: -2 }}
              className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4'
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}
                >
                  <stat.icon className='w-5 h-5 text-white' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-white'>{stat.value}</p>
                  <p className='text-xs text-white/60'>{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <div className='border-b border-white/10'>
            <div className='flex gap-4 overflow-x-auto'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-white'
                      : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
                  }`}
                >
                  <tab.icon className='w-4 h-4' />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div variants={itemVariants}>
          {activeTab === 'overview' && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Personal Information */}
              <div className='lg:col-span-2 space-y-6'>
                <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
                  <h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
                    <FiUser className='w-5 h-5 text-cyan-400' />
                    Personal Information
                  </h2>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className='space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-white/60 mb-1'>
                            Full Name
                          </label>
                          <input
                            type='text'
                            name='name'
                            value={editData.name}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-white/60 mb-1'>
                            Email
                          </label>
                          <input
                            type='email'
                            name='email'
                            value={editData.email}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                            disabled
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-white/60 mb-1'>
                            Phone
                          </label>
                          <input
                            type='tel'
                            name='phone'
                            value={editData.phone}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-white/60 mb-1'>
                            Date of Birth
                          </label>
                          <input
                            type='date'
                            name='dateOfBirth'
                            value={
                              editData.dateOfBirth
                                ? new Date(editData.dateOfBirth)
                                    .toISOString()
                                    .split('T')[0]
                                : ''
                            }
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-white/60 mb-1'>
                            Blood Group
                          </label>
                          <select
                            name='bloodGroup'
                            value={editData.bloodGroup}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                          >
                            <option value=''>Select Blood Group</option>
                            {bloodGroups.map((bg) => (
                              <option key={bg} value={bg}>
                                {bg.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='md:col-span-2'>
                          <label className='block text-sm font-medium text-white/60 mb-1'>
                            Address
                          </label>
                          <input
                            type='text'
                            name='address'
                            value={editData.address}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                          />
                        </div>
                        <div className='md:col-span-2'>
                          <label className='block text-sm font-medium text-white/60 mb-1'>
                            Emergency Contact
                          </label>
                          <input
                            type='text'
                            name='emergencyContact'
                            value={editData.emergencyContact}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                          />
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button
                          type='submit'
                          disabled={isLoading}
                          className='px-6 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white font-medium transition hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 flex items-center gap-2'
                        >
                          {isLoading ? (
                            'Saving...'
                          ) : (
                            <>
                              <FiSave className='w-4 h-4' /> Save Changes
                            </>
                          )}
                        </button>
                        <button
                          type='button'
                          onClick={handleCancel}
                          className='px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition'
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-white/60'>Full Name</p>
                        <p className='text-white font-medium'>
                          {formData.name || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-white/60'>Email</p>
                        <p className='text-white font-medium'>
                          {formData.email}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-white/60'>Phone</p>
                        <p className='text-white font-medium'>
                          {formData.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-white/60'>Date of Birth</p>
                        <p className='text-white font-medium'>
                          {formData.dateOfBirth
                            ? new Date(
                                formData.dateOfBirth
                              ).toLocaleDateString()
                            : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-white/60'>Blood Group</p>
                        <p className='text-white font-medium'>
                          {getBloodGroupDisplay(formData.bloodGroup)}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-white/60'>
                          Emergency Contact
                        </p>
                        <p className='text-white font-medium'>
                          {formData.emergencyContact || 'Not provided'}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <p className='text-sm text-white/60'>Address</p>
                        <p className='text-white font-medium'>
                          {formData.address || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className='space-y-6'>
                {/* Medical Summary */}
                <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
                  <h3 className='text-sm font-semibold text-white mb-4 flex items-center gap-2'>
                    <FiHeart className='w-4 h-4 text-cyan-400' />
                    Medical Summary
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-white/60'>Blood Group</span>
                      <span className='text-sm text-white font-medium'>
                        {getBloodGroupDisplay(formData.bloodGroup)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-white/60'>
                        Total Visits
                      </span>
                      <span className='text-sm text-white font-medium'>
                        {stats.totalAppointments}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-white/60'>Last Visit</span>
                      <span className='text-sm text-white font-medium'>
                        {patient?.appointments?.[0]?.date
                          ? new Date(
                              patient.appointments[0].date
                            ).toLocaleDateString()
                          : 'No visits'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
                  <h3 className='text-sm font-semibold text-white mb-4'>
                    Quick Actions
                  </h3>
                  <div className='space-y-2'>
                    <Link
                      href='/dashboard/patient/appointments/book'
                      className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white text-sm font-medium transition hover:shadow-lg hover:shadow-cyan-500/25'
                    >
                      <FaUserMd className='w-4 h-4' />
                      Book New Appointment
                    </Link>
                    <Link
                      href='/dashboard/patient/appointments'
                      className='flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition'
                    >
                      <FiCalendar className='w-4 h-4' />
                      View All Appointments
                    </Link>
                    <Link
                      href='/dashboard/patient/medical-history'
                      className='flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition'
                    >
                      <FiFileText className='w-4 h-4' />
                      Medical Records
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
              <h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
                <FiCalendar className='w-5 h-5 text-cyan-400' />
                Appointment History
              </h2>
              {patient?.appointments?.length > 0 ? (
                <div className='space-y-3'>
                  {patient.appointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className='flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-cyan-500/20 rounded-lg'>
                          <FaUserMd className='w-4 h-4 text-cyan-400' />
                        </div>
                        <div>
                          <p className='text-sm font-medium text-white'>
                            Dr. {appointment.doctor?.user?.name || 'Unknown'}
                          </p>
                          <p className='text-xs text-white/60'>
                            {appointment.doctor?.specialization || 'General'}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-wrap items-center gap-3 mt-2 md:mt-0'>
                        <p className='text-sm text-white/60'>
                          {new Date(appointment.date).toLocaleDateString()} at{' '}
                          {appointment.time}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <FiCalendar className='w-12 h-12 text-white/20 mx-auto mb-3' />
                  <p className='text-white/60'>No appointments found</p>
                  <Link
                    href='/dashboard/patient/appointments/book'
                    className='inline-block mt-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white text-sm font-medium transition hover:shadow-lg hover:shadow-cyan-500/25'
                  >
                    Book Your First Appointment
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'medical' && (
            <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
              <h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
                <FiHeart className='w-5 h-5 text-cyan-400' />
                Medical History
              </h2>
              {isEditing ? (
                <div>
                  <label className='block text-sm font-medium text-white/60 mb-2'>
                    Update Medical History
                  </label>
                  <textarea
                    name='medicalHistory'
                    value={editData.medicalHistory || ''}
                    onChange={handleInputChange}
                    rows={6}
                    className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition'
                    placeholder='Enter your medical history, allergies, medications, etc.'
                  />
                  <div className='flex gap-2 mt-4'>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className='px-6 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white font-medium transition hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 flex items-center gap-2'
                    >
                      {isLoading ? (
                        'Saving...'
                      ) : (
                        <>
                          <FiSave className='w-4 h-4' /> Save History
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {formData.medicalHistory ? (
                    <div className='bg-white/5 rounded-lg p-4'>
                      <p className='text-white whitespace-pre-wrap'>
                        {formData.medicalHistory}
                      </p>
                    </div>
                  ) : (
                    <div className='text-center py-8'>
                      <FiFileText className='w-12 h-12 text-white/20 mx-auto mb-3' />
                      <p className='text-white/60'>
                        No medical history recorded
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className='inline-block mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition'
                      >
                        Add Medical History
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className='space-y-6'>
              <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6'>
                <h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
                  <FiEdit2 className='w-5 h-5 text-cyan-400' />
                  Profile Settings
                </h2>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 bg-white/5 rounded-lg'>
                    <div>
                      <p className='text-white font-medium'>
                        Email Notifications
                      </p>
                      <p className='text-sm text-white/60'>
                        Receive email updates about appointments
                      </p>
                    </div>
                    <button className='px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition'>
                      Enabled
                    </button>
                  </div>
                  <div className='flex items-center justify-between p-4 bg-white/5 rounded-lg'>
                    <div>
                      <p className='text-white font-medium'>
                        SMS Notifications
                      </p>
                      <p className='text-sm text-white/60'>
                        Receive SMS reminders
                      </p>
                    </div>
                    <button className='px-4 py-2 bg-white/5 text-white/60 rounded-lg text-sm font-medium hover:bg-white/10 transition'>
                      Disabled
                    </button>
                  </div>
                  <div className='flex items-center justify-between p-4 bg-white/5 rounded-lg'>
                    <div>
                      <p className='text-white font-medium'>Account Security</p>
                      <p className='text-sm text-white/60'>
                        Change password or security settings
                      </p>
                    </div>
                    <Link
                      href='/dashboard/patient/settings/security'
                      className='px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition'
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
