// components/dashboard/DashboardSidebar.js
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
  HeartPulse,
  Plus,
} from 'lucide-react';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';


const MENU_BY_ROLE = {
  PATIENT: [
    { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', href: '/patient/my-appointments', icon: Calendar },
    { name: 'Find Doctors', href: '/all-doctors', icon: Stethoscope },
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
    { name: 'Manage Doctors', href: '/admin/all-doctors', icon: Stethoscope },
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
          <div className='flex flex-col'>
            <Link href='/' className='flex items-center gap-2 group'>
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className='w-10 h-10 rounded-full bg-linear-to-r from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/25'
              >
                <HeartPulse className='w-6 h-6 text-white' />
              </motion.div>
              <span className='text-xl font-bold text-white flex items-center'>
                Mi
                <span className='bg-linear-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent'>
                  Care
                </span>
                <Plus className='w-4 h-4 text-teal-400 ml-0.5' />
              </span>
            </Link>
          </div>
          {/* <p className='text-xs text-gray-500 mt-2'>{user.role} Panel</p> */}
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
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              className='h-9 w-9 rounded-full object-cover'
            />
          ) : (
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-primary-500 to-accent-500 text-sm font-bold text-white'>
              {user?.name?.charAt(0)?.toUpperCase() || <FiUser size={16} />}
            </div>
          )}
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium text-white'>
              {user?.name}
            </p>
            <p className='truncate text-xs text-white/50'>{user?.email}</p>
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
