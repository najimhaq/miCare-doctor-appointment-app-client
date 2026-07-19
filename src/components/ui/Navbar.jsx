'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import SmoothLink from '../lenis/SmoothLink';
import {
  HeartPulse,
  Plus,
  Menu,
  X,
  TicketPercent,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { getRoleDashboardPath } from '@/lib/getRoleDashboardPath';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About us', href: '/about-us' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const pathname = usePathname();

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const isClosed = sessionStorage.getItem('promoBannerClosed');
    if (isClosed === 'true') {
      setShowBanner(false);
    }
  }, []);

  const handleBannerClose = () => {
    setShowBanner(false);
    sessionStorage.setItem('promoBannerClosed', 'true');
  };

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
  };

  if (pathname.includes('dashboard')) {
    return null;
  }

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      {/* --- PROMO BANNER SECTION --- */}
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className='bg-teal-600 text-white text-sm md:text-base font-medium py-2 px-4 flex items-center justify-center gap-2 relative overflow-hidden'
        >
          <div className='flex items-center gap-2 animate-pulse'>
            <TicketPercent
              className='w-4 h-4 text-yellow-300'
              aria-hidden='true'
            />
            <span>
              New Patient Special: <b className='text-yellow-300'>50% OFF</b>{' '}
              your first visit!
            </span>
          </div>

          <button
            onClick={handleBannerClose}
            className='absolute right-4 p-1 hover:bg-teal-700 rounded-full transition-colors'
            aria-label='Close banner'
          >
            <X className='w-4 h-4' />
          </button>
        </motion.div>
      )}

      {/* --- MAIN NAVBAR SECTION --- */}
      <div className='max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6'>
        {/* Logo */}
        <SmoothLink href='/'>
          <div className='flex items-center gap-2 cursor-pointer group shrink-0'>
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
          </div>
        </SmoothLink>

        {/* Desktop Menu */}
        <div className='hidden lg:flex items-center gap-6 xl:gap-8'>
          {navLinks.map((link) => (
            <SmoothLink
              key={link.name}
              href={link.href}
              className='text-sm font-medium text-gray-300 hover:text-teal-400 transition-colors relative group py-1 whitespace-nowrap'
            >
              {link.name}
              <span className='absolute -bottom-0 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all duration-300' />
            </SmoothLink>
          ))}
        </div>

        {/* Desktop Buttons — ✅ session-aware, fixed spacing */}
        <div className='hidden lg:flex items-center gap-2 shrink-0'>
          {isLoading ? (
            <div className='w-28 h-10 bg-gray-800 rounded-full animate-pulse' />
          ) : isAuthenticated ? (
            <>
              <Link
                href={getRoleDashboardPath(user?.role)}
                className='flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-teal-400'
              >
                <LayoutDashboard className='w-4 h-4' />
                Dashboard
              </Link>

              {/* User avatar/dropdown */}
              <div className='flex shrink-0 items-center gap-2 border-l border-gray-700 pl-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white'>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className='flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-red-500/10 hover:text-red-400'
                  aria-label='Sign out'
                  title='Sign out'
                >
                  <LogOut className='w-4 h-4' />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href='/signin'
                className='shrink-0 whitespace-nowrap rounded-full border border-teal-500 px-4 py-2.5 text-sm font-medium text-gray-200 shadow-md shadow-teal-500/10 transition-all hover:border-teal-400 hover:bg-teal-500/10 hover:text-teal-300'
              >
                Sign In
              </Link>
              <Link
                href='/book-appointment'
                className='shrink-0 whitespace-nowrap rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/20 transition-all duration-300 hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/30 active:scale-95'
              >
                Book Appointment
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className='lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition shrink-0'
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label='Toggle menu'
        >
          {mobileOpen ? (
            <X className='w-6 h-6' />
          ) : (
            <Menu className='w-6 h-6' />
          )}
        </button>
      </div>

      {/* Mobile Menu — ✅ session-aware */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='lg:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/50 px-6 py-6 space-y-4'
        >
          {navLinks.map((link) => (
            <SmoothLink
              key={link.name}
              href={link.href}
              className='block text-base font-medium text-gray-300 hover:text-teal-400 transition-colors py-2'
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </SmoothLink>
          ))}

          <div className='flex flex-col gap-3 mt-6 pt-6 border-t border-gray-800'>
            {isLoading ? (
              <div className='w-full h-12 bg-gray-800 rounded-lg animate-pulse' />
            ) : isAuthenticated ? (
              <>
                {/* User info card */}
                <div className='flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-lg'>
                  <div className='w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold'>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm text-white font-medium truncate'>
                      {user?.name}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={getRoleDashboardPath(user?.role)}
                  className='w-full flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-lg border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-all'
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className='w-4 h-4' />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className='w-full flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-lg bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-all'
                >
                  <LogOut className='w-4 h-4' />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href='/signin'
                  className='w-full text-center px-4 py-3 text-sm rounded-lg border border-teal-700 text-gray-300 font-medium hover:bg-gray-800 transition-all'
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href='/book-appointment'
                  className='w-full text-center px-4 py-3 text-sm rounded-lg bg-linear-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg shadow-teal-500/20 transition-all'
                  onClick={() => setMobileOpen(false)}
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
