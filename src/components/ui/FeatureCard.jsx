'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  index,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    teal: 'from-teal-500/20 to-teal-500/5 border-teal-500/30 text-teal-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
    purple:
      'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
    yellow:
      'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-400',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group relative p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}
    >
      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className='text-2xl' />
      </div>

      {/* Content */}
      <h3 className='text-xl font-bold text-white mb-3'>{title}</h3>
      <p className='text-gray-400 leading-relaxed'>{description}</p>

      {/* Hover Effect */}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
    </motion.div>
  );
}
