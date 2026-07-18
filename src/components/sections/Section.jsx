'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Section({
  id,
  title,
  description,
  bgColor,
  children,
  fullHeight = false,
  showTopDivider = true,
  showBadge = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id={id}
      className={`relative flex items-center justify-center bg-gradient-to-b ${bgColor} ${
        fullHeight ? 'min-h-screen' : 'py-24 md:py-32'
      }`}
    >
      {/* ১. Conditional Top Divider (শুধু showTopDivider true হলে দেখাবে) */}
      {showTopDivider && (
        <div className='absolute left-1/2 top-0 w-px h-32 bg-gradient-to-b from-transparent via-gray-700 to-transparent' />
      )}

      <div ref={ref} className='max-w-4xl mx-auto px-6 text-center'>
        {/* ২. Conditional Badge (শুধু showBadge true এবং id থাকলে দেখাবে) */}
        {showBadge && id && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className='inline-block text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5'
          >
            {id}
          </motion.span>
        )}

        {/* Title (থাকলে দেখাবে) */}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'
          >
            {title}
          </motion.h2>
        )}

        {/* Description (থাকলে দেখাবে) */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg text-gray-400 max-w-2xl mx-auto mb-8'
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
