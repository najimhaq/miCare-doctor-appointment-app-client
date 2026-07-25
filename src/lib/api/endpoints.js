// ✅ All API endpoints in one place
const API = {
  // Auth
  auth: {
    session: '/api/auth/get-session',
    signout: '/api/auth/signout',
    profile: '/api/auth/profile',
  },

  // Patient
  patient: {
    profile: '/api/patient/profile',
    appointments: '/api/patient/appointments',
    medicalHistory: '/api/patient/medical-history',
    allPatients: '/api/patients',
    patientById: (id) => `/api/patients/${id}`,
  },

  // Doctor
  doctor: {
    profile: '/api/doctor/profile',
    appointments: '/api/doctor/appointments',
    patients: '/api/doctor/patients',
    allDoctors: '/api/all-doctors',
    doctorById: (id) => `/api/all-doctors/${id}`,
  },

  // Common
  doctors: '/api/all-doctors',
  appointments: '/api/appointments',
  bookAppointment: '/api/appointments/book',
  specialties: '/api/specialties',
};

export default API;
