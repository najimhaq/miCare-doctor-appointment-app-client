// ✅ All API endpoints in one place
const API = {
  // Auth
  auth: {
    session: '/api/auth/get-session',
    me: '/api/auth/me',
    profile: '/api/auth/profile',
    signout: '/api/auth/signout',
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
    dashboardStats: '/api/appointments/doctor/dashboard-stats',
    appointments: '/api/doctor/appointments',
    patients: '/api/doctor/patients',
    allDoctors: '/api/all-doctors',
    doctorById: (id) => `/api/all-doctors/${id}`,
    appointmentHistory: '/api/appointments/doctor/history',
  },

  // Common
  doctors: '/api/all-doctors',
  myAppointments: '/api/appointments/my-appointments',
  bookAppointment: '/api/appointments/book',
  specialties: '/api/specialties',
  appointmentById: (id) => `/api/appointments/${id}`,
  appointmentRestore: (id) => `/api/appointments/${id}/restore`, //patient only
  appointmentStatus: (id) => `/api/appointments/${id}/status`, //doctor only
};

export default API;
