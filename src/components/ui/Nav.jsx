'use client';
import { ChevronDown, HeartPulse, Plus, Menu } from 'lucide-react';
import { useState } from 'react';
import ReusableButton from '../reusable/ReusableButton';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='w-full bg-black shadow-md fixed top-0 left-0 z-50 mt-12'>
      <div className='max-w-7xl mx-auto px-4 flex items-center justify-between h-16'>
        {/* Logo */}
        <div className='flex items-center gap-2 cursor-pointer'>
          <div className='w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center'>
            <HeartPulse className='w-5 h-5 text-white' aria-hidden='true' />
          </div>
          <span className='text-xl font-semibold text-white flex items-center'>
            MiCare
            <Plus className='w-4 h-4 text-teal-600 ml-1' aria-hidden='true' />
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className='hidden md:flex items-center gap-6 text-white font-medium'>
          <li className='hover:text-cyan-600 cursor-pointer'>Home</li>
          <li className='hover:text-cyan-600 cursor-pointer'>Services</li>
          <li className='hover:text-cyan-600 cursor-pointer'>About Us</li>
          <li className='hover:text-cyan-600 cursor-pointer'>Doctors</li>
          <li className='flex items-center gap-1 hover:text-cyan-600 cursor-pointer'>
            Pages <ChevronDown className='w-4 h-4' />
          </li>
          <li className='hover:text-teal-600 cursor-pointer'>Contact</li>
        </ul>

        {/* CTA Button */}
        <div className='flex justify-center gap-2'>
          <ReusableButton>Book Appointment</ReusableButton>
          <ReusableButton>
            <Link href='/signin'>Login</Link>
          </ReusableButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className='md:hidden text-gray-700'
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Toggle menu'
        >
          <Menu className='w-6 h-6' />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden bg-white shadow-md px-4 py-3 space-y-2'>
          <a href='#' className='block text-gray-700 hover:text-teal-600'>
            Home
          </a>
          <a href='#' className='block text-gray-700 hover:text-teal-600'>
            Services
          </a>
          <a href='#' className='block text-gray-700 hover:text-teal-600'>
            About Us
          </a>
          <a href='#' className='block text-gray-700 hover:text-teal-600'>
            Doctors
          </a>
          <a
            href='#'
            className=' text-gray-700 hover:text-teal-600 flex items-center gap-1'
          >
            Pages <ChevronDown className='w-4 h-4' />
          </a>
          <a href='#' className='block text-gray-700 hover:text-teal-600'>
            Contact
          </a>
          <button className='w-full bg-cyan-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition'>
            Book Appointment
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
