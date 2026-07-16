'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import SmoothLink from '../lenis/SmoothLink';
import { HeartPulse, Plus } from 'lucide-react';
import Link from 'next/link';

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
      className={`fixed top-0 left-0 right-0 z-9990 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between mt-12'>
        <SmoothLink href='/'>
          <div className='flex items-center gap-2 cursor-pointer'>
            <div className='w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center'>
              <HeartPulse className='w-5 h-5 text-white' aria-hidden='true' />
            </div>
            <span className='text-xl font-semibold text-white flex items-center'>
              MiCare
              <Plus
                className='w-4 h-4 text-cyan-600 ml-1 font-bold'
                aria-hidden='true'
              />
            </span>
          </div>
        </SmoothLink>

        <div className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => (
            <SmoothLink
              key={link.name}
              href={link.href}
              className='text-sm text-gray-400 hover:text-cyan-400 transition-colors relative group'
            >
              {link.name}
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300' />
            </SmoothLink>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <Link
            href='/book-appointment'
            className='px-4 py-2 text-sm rounded-md bg-linear-to-r from-cyan-500 to-teal-500 text-white font-medium shadow-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105'
          >
            Book Appointment
          </Link>
          <Link
            href='/signin'
            className='px-4 py-2 text-sm rounded-md bg-linear-to-r from-cyan-500 to-teal-500 text-white font-medium shadow-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105'
          >
            Signin
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
