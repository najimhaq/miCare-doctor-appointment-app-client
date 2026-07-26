'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/api/axiosInstance';
import API from '@/lib/api/endpoints';
import { FaEdit, FaSave, FaTimes, FaUserMd, FaSpinner } from 'react-icons/fa';

const emptyForm = {
  name: '',
  phone: '',
  specialization: '',
  qualifications: '',
  licenseNumber: '',
  experienceYears: 0,
  consultationFee: 0,
  about: '',
  hospital: '',
  location: '',
};

const buildFormFromData = (data) => {
  if (!data) return emptyForm;
  return {
    name: data.user?.name || '',
    phone: data.user?.phone || '',
    specialization: data.specialization || '',
    qualifications: data.qualifications || '',
    licenseNumber: data.licenseNumber || '',
    experienceYears: data.experienceYears ?? 0,
    consultationFee: data.consultationFee ?? 0,
    about: data.about || '',
    hospital: data.hospital || '',
    location: data.location || '',
  };
};

export default function DoctorProfileClient({
  initialData,
  error: initialError,
}) {
  const [profile, setProfile] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(buildFormFromData(initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(initialError);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setForm(buildFormFromData(profile));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(buildFormFromData(profile));
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        experienceYears: Number(form.experienceYears) || 0,
        consultationFee: Number(form.consultationFee) || 0,
      };

      const res = await axiosInstance.put(API.doctor.profile, payload);
      const updated = res.data?.data;

      setProfile(updated);
      setForm(buildFormFromData(updated));
      setIsEditing(false);
      setError(null);
      toast.success('Profile saved successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save profile';
      toast.error(msg);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center'>
            <FaUserMd className='text-cyan-400 w-5 h-5' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'>Doctor Profile</h1>
            <p className='text-white/50 text-sm'>
              {profile
                ? 'Manage your professional information'
                : 'No profile information added yet'}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={handleEditClick}
            className='flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition text-sm'
          >
            <FaEdit className='w-3.5 h-3.5' />{' '}
            {profile ? 'Edit Profile' : 'Add Profile'}
          </button>
        )}
      </div>

      {!isEditing ? (
        <ProfileView profile={profile} onEdit={handleEditClick} />
      ) : (
        <form
          onSubmit={handleSave}
          className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 space-y-6'
        >
          <Section title='Basic Information'>
            <Field
              label='Full Name'
              name='name'
              value={form.name}
              onChange={handleChange}
            />
            <Field
              label='Phone'
              name='phone'
              value={form.phone}
              onChange={handleChange}
            />
          </Section>

          <Section title='Professional Details'>
            <Field
              label='Specialization *'
              name='specialization'
              value={form.specialization}
              onChange={handleChange}
              placeholder='e.g. Cardiologist'
            />
            <Field
              label='Qualifications'
              name='qualifications'
              value={form.qualifications}
              onChange={handleChange}
              placeholder='e.g. MBBS, MD'
            />
            <Field
              label='License Number *'
              name='licenseNumber'
              value={form.licenseNumber}
              onChange={handleChange}
            />
            <Field
              label='Experience (years)'
              name='experienceYears'
              type='number'
              value={form.experienceYears}
              onChange={handleChange}
            />
            <Field
              label='Consultation Fee'
              name='consultationFee'
              type='number'
              value={form.consultationFee}
              onChange={handleChange}
            />
          </Section>

          <Section title='Practice Details'>
            <Field
              label='Hospital / Clinic Name'
              name='hospital'
              value={form.hospital}
              onChange={handleChange}
            />
            <Field
              label='Location'
              name='location'
              value={form.location}
              onChange={handleChange}
            />
          </Section>

          <div>
            <label className='block text-sm text-white/60 mb-1'>About</label>
            <textarea
              name='about'
              value={form.about}
              onChange={handleChange}
              rows={4}
              className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50'
              placeholder='Tell patients about yourself...'
            />
          </div>

          <div className='flex items-center gap-3 pt-2'>
            <button
              type='submit'
              disabled={saving}
              className='flex items-center gap-2 px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-sm disabled:opacity-50'
            >
              {saving ? (
                <FaSpinner className='w-3.5 h-3.5 animate-spin' />
              ) : (
                <FaSave className='w-3.5 h-3.5' />
              )}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type='button'
              onClick={handleCancel}
              disabled={saving}
              className='flex items-center gap-2 px-5 py-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition text-sm'
            >
              <FaTimes className='w-3.5 h-3.5' /> Cancel
            </button>
          </div>
        </form>
      )}

      {error && !profile && !isEditing && (
        <p className='text-red-400/70 text-sm mt-4'>{error}</p>
      )}
    </div>
  );
}

const Section = ({ title, children }) => (
  <div>
    <h3 className='text-sm font-semibold text-white/80 mb-3'>{title}</h3>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>{children}</div>
  </div>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}) => (
  <div>
    <label className='block text-sm text-white/60 mb-1'>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50'
    />
  </div>
);

const ProfileView = ({ profile, onEdit }) => {
  if (!profile) {
    return (
      <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-10 text-center'>
        <div className='text-4xl mb-3'>🩺</div>
        <p className='text-white/60 mb-4'>
          You haven't added your doctor profile yet.
        </p>
        <button
          onClick={onEdit}
          className='px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition text-sm'
        >
          Add Profile Now
        </button>
      </div>
    );
  }

  const rows = [
    ['Name', profile.user?.name],
    ['Phone', profile.user?.phone],
    ['Specialization', profile.specialization],
    ['Qualifications', profile.qualifications],
    ['License Number', profile.licenseNumber],
    [
      'Experience',
      profile.experienceYears != null
        ? `${profile.experienceYears} years`
        : null,
    ],
    [
      'Consultation Fee',
      profile.consultationFee != null ? `${profile.consultationFee} BDT` : null,
    ],
    ['Hospital', profile.hospital],
    ['Location', profile.location],
  ];

  return (
    <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 space-y-4'>
      {rows.map(([label, val]) => (
        <div
          key={label}
          className='flex items-start justify-between border-b border-white/5 pb-3 last:border-0'
        >
          <span className='text-white/50 text-sm'>{label}</span>
          <span className='text-white text-sm text-right max-w-[60%]'>
            {val || '—'}
          </span>
        </div>
      ))}

      {profile.about && (
        <div className='pt-2'>
          <p className='text-white/50 text-sm mb-1'>About</p>
          <p className='text-white text-sm leading-relaxed'>{profile.about}</p>
        </div>
      )}
    </div>
  );
};
