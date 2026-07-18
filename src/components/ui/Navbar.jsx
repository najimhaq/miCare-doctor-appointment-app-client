'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import SmoothLink from '../lenis/SmoothLink';
import { HeartPulse, Plus, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from '../themes/MoodToggle';

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
          ? 'bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between mt-20 md:mt-12'>
        {/* Logo */}
        <SmoothLink href='/'>
          <div className='flex items-center gap-2 cursor-pointer'>
            <div className='w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center'>
              <HeartPulse className='w-5 h-5 text-white' aria-hidden='true' />
            </div>
            <span className='text-xl font-semibold text-white flex items-center'>
              MiCare
              <Plus
                className='w-4 h-4 text-teal-600 ml-1 font-bold'
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
              className='text-md text-gray-400 hover:text-teal-400 transition-colors relative group'
            >
              {link.name}
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all duration-300' />
            </SmoothLink>
          ))}
        </div>

        {/* Buttons */}
        <div className='hidden md:flex items-center gap-4'>
          <Link
            href='/book-appointment'
            className='px-4 py-2 text-sm rounded-md bg-linear-to-r from-teal-500 to-teal-500 text-white font-medium shadow-sm sm:text-center hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105'
          >
            Book Appointment
          </Link>
          <Link
            href='/signin'
            className='px-4 py-2 text-sm rounded-md bg-linear-to-r from-teal-500 to-teal-500 text-white font-medium shadow-sm sm:text-center hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105'
          >
            Signin
          </Link>
          {/* <ModeToggle /> */}
        </div>

        {/* Mobile Hamburger */}
        <button
          className='md:hidden text-white'
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className='w-6 h-6' />
          ) : (
            <Menu className='w-6 h-6' />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className='md:hidden bg-gray-950/90 backdrop-blur-xl border-t border-gray-800/50 px-6 py-4 space-y-4'>
          {navLinks.map((link) => (
            <SmoothLink
              key={link.name}
              href={link.href}
              className='block text-md text-gray-300 hover:text-teal-400 transition-colors'
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </SmoothLink>
          ))}
          <div className='flex flex-col gap-2 mt-4'>
            <Link
              href='/book-appointment'
              className='px-4 py-2 text-sm rounded-md bg-linear-to-r from-teal-500 to-teal-500 text-white font-medium shadow-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300'
              onClick={() => setMobileOpen(false)}
            >
              Book Appointment
            </Link>
            <Link
              href='/signin'
              className='px-4 py-2 text-sm rounded-md bg-linear-to-r from-teal-500 to-teal-500 text-white font-medium shadow-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300'
              onClick={() => setMobileOpen(false)}
            >
              Signin
            </Link>
            {/* <ModeToggle /> */}
          </div>
        </div>
      )}
    </motion.nav>
  );
}
