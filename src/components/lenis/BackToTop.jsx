'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { useLenis } from 'lenis/react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  // Scroll position track করা
  useEffect(() => {
    function handleScroll(e) {
      // 300px এর বেশি scroll করলে button দেখাবে
      if (e.scroll > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    if (lenis) {
      lenis.on('scroll', handleScroll);
      return () => lenis.off('scroll', handleScroll);
    }
  }, [lenis]);

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 2,
        easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
      });
    } else {
      // Fallback if Lenis not loaded
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenis]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className='fixed bottom-8 right-8 z-[9998] group'
          aria-label='Back to top'
        >
          <div className='relative w-14 h-14'>
            {/* Circular progress ring (decorative) */}
            <svg
              className='absolute inset-0 w-full h-full -rotate-90'
              viewBox='0 0 56 56'
            >
              <circle
                cx='28'
                cy='28'
                r='24'
                fill='none'
                stroke='rgba(56,189,248,0.2)'
                strokeWidth='2'
              />
              <motion.circle
                cx='28'
                cy='28'
                r='24'
                fill='none'
                stroke='url(#gradient)'
                strokeWidth='2'
                strokeDasharray='150.8'
                strokeDashoffset='150.8'
                strokeLinecap='round'
                initial={{ strokeDashoffset: 150.8 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id='gradient'>
                  <stop offset='0%' stopColor='#22d3ee' />
                  <stop offset='100%' stopColor='#a855f7' />
                </linearGradient>
              </defs>
            </svg>

            {/* Button content */}
            <div className='absolute inset-1 rounded-full bg-gray-900/90 backdrop-blur-sm border border-gray-800 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-500/50 transition-colors'>
              <svg
                className='w-5 h-5 text-cyan-400 group-hover:text-white transition-colors'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 15l7-7 7 7'
                />
              </svg>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
