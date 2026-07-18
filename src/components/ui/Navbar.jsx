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
  // console.log('Navbar ', user);



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

   // ✅ এখন early return — সব hooks কল হয়ে যাওয়ার পরে
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
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        {/* Logo */}
        <SmoothLink href='/'>
          <div className='flex items-center gap-2 cursor-pointer group'>
            <div className='w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <HeartPulse className='w-5 h-5 text-white' aria-hidden='true' />
            </div>
            <span className='text-xl font-bold text-white flex items-center tracking-tight'>
              MiCare
              <Plus
                className='w-4 h-4 text-teal-500 ml-0.5 font-bold'
                aria-hidden='true'
              />
            </span>
          </div>
        </SmoothLink>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => (
            <SmoothLink
              key={link.name}
              href={link.href}
              className='text-sm font-medium text-gray-300 hover:text-teal-400 transition-colors relative group py-1'
            >
              {link.name}
              <span className='absolute -bottom-0 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all duration-300' />
            </SmoothLink>
          ))}
        </div>

        {/* Desktop Buttons — ✅ এখন session-aware */}
        <div className='hidden md:flex items-center gap-3'>
          {isLoading ? (
            // ✅ Session check হওয়ার সময় skeleton দেখাবে, ফ্লিকার এড়ানোর জন্য
            <div className='w-24 h-9 bg-gray-800 rounded-full animate-pulse' />
          ) : isAuthenticated ? (
            <>
              <Link
                href={getRoleDashboardPath(user?.role)}
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-teal-400 transition-colors'
              >
                <LayoutDashboard className='w-4 h-4' />
                Dashboard
              </Link>

              {/* User avatar/dropdown */}
              <div className='flex items-center gap-3 pl-3 border-l border-gray-700'>
                <div className='w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-semibold'>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className='flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors'
                  aria-label='Sign out'
                >
                  <LogOut className='w-4 h-4' />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href='/signin'
                className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors'
              >
                Sign In
              </Link>
              <Link
                href='/book-appointment'
                className='px-5 py-2.5 text-sm rounded-full bg-linear-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:scale-105 active:scale-95'
              >
                Book Appointment
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className='md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition'
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

      {/* Mobile Menu — ✅ এখানেও session-aware */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/50 px-6 py-6 space-y-4'
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
                {/* ✅ User info card */}
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
                  className='w-full text-center px-4 py-3 text-sm rounded-lg border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-all'
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
