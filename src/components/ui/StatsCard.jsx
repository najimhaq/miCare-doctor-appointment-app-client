'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function StatsCard({ icon: Icon, value, label, color, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const colorClasses = {
    cyan: 'text-cyan-400',
    teal: 'text-teal-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className='text-center p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-gray-700 transition-all'
    >
      <Icon className={`text-4xl ${colorClasses[color]} mx-auto mb-3`} />
      <div className='text-3xl md:text-4xl font-bold text-white mb-2'>
        {value}
      </div>
      <div className='text-sm text-gray-400'>{label}</div>
    </motion.div>
  );
}
