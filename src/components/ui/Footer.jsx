// components/Footer.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Plus,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
];

const services = [
  { href: '/services/cosmetic-dentistry', label: 'Cosmetic Dentistry' },
  { href: '/services/dental-implants', label: 'Dental Implants' },
  { href: '/services/orthodontics', label: 'Orthodontics' },
  { href: '/services/teeth-whitening', label: 'Teeth Whitening' },
  { href: '/services/general-dentistry', label: 'General Dentistry' },
  { href: '/services/emergency-care', label: 'Emergency Care' },
];

const socialLinks = [
  { href: '#', icon: FaFacebook, label: 'Facebook' },
  { href: '#', icon: FaTwitter, label: 'Twitter' },
  { href: '#', icon: FaInstagram, label: 'Instagram' },
  { href: '#', icon: FaLinkedin, label: 'LinkedIn' },
];

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className='relative bg-slate-900 text-white overflow-hidden'>
      {/* Background linear */}
      <div className='absolute inset-0 bg-linear-to-b from-teal-900 via-teal-900/95 to-teal-900/90' />

      {/* Animated Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 -left-1/4 w-1/2 h-1/2 bg-linear-to-r from-cyan-500 to-emerald-500 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-linear-to-r from-teal-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={footerVariants}
        className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8'
      >
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          {/* Brand Section */}
          <motion.div variants={itemVariants} className='space-y-4'>
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

            <p className='text-sm text-white/60 leading-relaxed'>
              Your trusted partner in healthcare excellence. We provide
              exceptional care every single day with cutting-edge technology and
              compassionate professionals.
            </p>

            <div className='flex items-center gap-4 pt-2'>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className='w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300'
                  aria-label={social.label}
                >
                  <social.icon className='w-4 h-4' />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className='text-lg font-semibold mb-4 text-white'>
              Quick Links
            </h3>
            <ul className='space-y-2.5'>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='flex items-center gap-2 text-sm text-white/60 hover:text-white transition-all duration-200 group'
                  >
                    <ChevronRight className='w-3 h-3 text-cyan-400 transition-transform duration-200 group-hover:translate-x-1' />
                    <span className='group-hover:translate-x-0.5 transition-transform duration-200'>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Services */}
          <motion.div variants={itemVariants}>
            <h3 className='text-lg font-semibold mb-4 text-white'>
              Our Services
            </h3>
            <ul className='space-y-2.5'>
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className='flex items-center gap-2 text-sm text-white/60 hover:text-white transition-all duration-200 group'
                  >
                    <ChevronRight className='w-3 h-3 text-emerald-400 transition-transform duration-200 group-hover:translate-x-1' />
                    <span className='group-hover:translate-x-0.5 transition-transform duration-200'>
                      {service.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info & Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className='text-lg font-semibold mb-4 text-white'>
              Contact & Updates
            </h3>

            <div className='space-y-3'>
              <div className='flex items-start gap-3 text-sm text-white/60'>
                <MapPin className='w-4 h-4 text-cyan-400 mt-0.5 shrink-0' />
                <span>123 Healthcare Ave., Smile City, SC 12345</span>
              </div>
              <div className='flex items-center gap-3 text-sm text-white/60'>
                <Phone className='w-4 h-4 text-cyan-400 shrink-0' />
                <a
                  href='tel:+13101234567'
                  className='hover:text-white transition'
                >
                  (310) 123-4567
                </a>
              </div>
              <div className='flex items-center gap-3 text-sm text-white/60'>
                <Mail className='w-4 h-4 text-cyan-400 shrink-0' />
                <a
                  href='mailto:info@micare.com'
                  className='hover:text-white transition'
                >
                  info@micare.com
                </a>
              </div>
              <div className='flex items-center gap-3 text-sm text-white/60'>
                <Clock className='w-4 h-4 text-cyan-400 shrink-0' />
                <span>Mon–Fri: 9AM–6PM</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className='mt-4'>
              <p className='text-xs text-white/50 mb-2'>
                Subscribe to our newsletter
              </p>
              <form onSubmit={handleSubscribe} className='flex gap-2'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition-colors'
                  required
                />
                <motion.button
                  type='submit'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-3 py-2 bg-linear-to-r from-cyan-500 to-emerald-500 rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all'
                >
                  <FiSend className='w-4 h-4' />
                </motion.button>
              </form>
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='text-xs text-emerald-400 mt-2'
                >
                  ✅ Subscribed successfully!
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className='my-8 border-t border-white/5'
        />

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className='flex flex-col md:flex-row items-center justify-between gap-4'
        >
          <p className='text-sm text-white/40'>
            &copy; {new Date().getFullYear()} MiCare. All rights reserved.
          </p>

          <div className='flex items-center gap-6 text-xs text-white/40'>
            <Link href='/privacy' className='hover:text-white transition'>
              Privacy Policy
            </Link>
            <Link href='/terms' className='hover:text-white transition'>
              Terms of Service
            </Link>
            <Link href='/cookies' className='hover:text-white transition'>
              Cookies Policy
            </Link>
          </div>

          <motion.a
            href='#'
            whileHover={{ y: -2 }}
            className='flex items-center gap-1 text-sm text-white/40 hover:text-white transition'
          >
            Back to top
            <ArrowUpRight className='w-3 h-3' />
          </motion.a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
