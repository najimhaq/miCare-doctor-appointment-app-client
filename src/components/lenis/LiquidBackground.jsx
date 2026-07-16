'use client';

import { motion } from 'framer-motion';

export default function LiquidBackground() {
  return (
    <div className='absolute inset-0 overflow-hidden'>
      <motion.div
        className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[128px]'
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]'
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className='absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]'
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
