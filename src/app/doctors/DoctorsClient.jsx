'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarCheck } from 'react-icons/fa';

export default function DoctorsClientPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/doctors`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load doctors');
        setLoading(false);
      });
  }, []);

  const handleBookAppointment = async (doctorId, patientId) => {
    // In real app, get patientId from Better-Auth session
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/appointments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientId,
          doctorId: doctorId,
          date: new Date(), // You should use a date picker here
        }),
      }
    );

    if (res.ok) {
      toast.success('Appointment booked successfully!');
    } else {
      toast.error('Booking failed!');
    }
  };

  if (loading) return <p className='text-center mt-10'>Loading doctors...</p>;

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Our Expert Doctors</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition'
          >
            <h3 className='text-xl font-semibold'>{doc.user.name}</h3>
            <p className='text-blue-600 font-medium'>{doc.specialization}</p>
            <p className='text-gray-600 text-sm mt-2'>
              {doc.bio || 'No bio available'}
            </p>
            <div className='mt-4 flex justify-between items-center'>
              <span className='text-lg font-bold text-green-600'>
                ${doc.consultationFee}
              </span>
              <button
                onClick={() =>
                  handleBookAppointment(doc.id, 'PATIENT_ID_FROM_AUTH')
                }
                className='bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600'
              >
                <FaCalendarCheck /> Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
