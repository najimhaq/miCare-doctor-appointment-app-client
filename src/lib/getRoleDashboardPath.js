// frontend - lib/getRoleDashboardPath.js
export function getRoleDashboardPath(role) {
  switch (role) {
    case 'DOCTOR':
      return '/doctor/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/patient/dashboard';
  }
}
