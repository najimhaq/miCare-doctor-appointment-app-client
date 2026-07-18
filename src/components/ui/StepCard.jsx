'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function StepCard({ number, title, description, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className='relative text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group'
    >
      {/* Step Number */}
      <div className='text-6xl font-bold bg-gradient-to-br from-cyan-500/20 to-teal-500/20 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300'>
        {number}
      </div>

      {/* Content */}
      <h3 className='text-2xl font-bold text-white mb-3'>{title}</h3>
      <p className='text-gray-400 leading-relaxed'>{description}</p>

      {/* Connector Line (for desktop) */}
      {index < 2 && (
        <div className='hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-cyan-500/50 to-transparent' />
      )}
    </motion.div>
  );
}
