// components/dashboard/DashboardSidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  User,
  Users,
  Stethoscope,
  Settings,
  LogOut,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


const MENU_BY_ROLE = {
  PATIENT: [
    { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', href: '/patient/appointments', icon: Calendar },
    { name: 'Find Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Profile', href: '/patient/profile', icon: User },
  ],
  DOCTOR: [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { name: 'My Profile', href: '/doctor/profile', icon: User },
    { name: 'Patients', href: '/doctor/patients', icon: Users },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Doctors', href: '/admin/doctors', icon: Stethoscope },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Appointments', href: '/admin/appointments', icon: ClipboardList },
    { name: 'Approvals', href: '/admin/approvals', icon: ShieldCheck },
  ],
};

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const menu = MENU_BY_ROLE[user.role] || [];


  return (
    <aside className='w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between'>
      <div>
        <div className='p-6 border-b border-gray-800'>
          <h2 className='text-lg font-bold text-white'>MiCare</h2>
          <p className='text-xs text-gray-500 mt-1'>{user.role} Panel</p>
        </div>

        <nav className='p-4 space-y-1'>
          {menu.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className='w-4 h-4' />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='p-4 border-t border-gray-800'>
        <div className='flex items-center gap-3 px-2 mb-3'>
          <div className='w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold text-sm'>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className='min-w-0'>
            <p className='text-sm text-white truncate'>{user.name}</p>
            <p className='text-xs text-gray-500 truncate'>{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className='flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
        >
          <LogOut className='w-4 h-4' />
          Logout
        </button>
      </div>
    </aside>
  );
}
