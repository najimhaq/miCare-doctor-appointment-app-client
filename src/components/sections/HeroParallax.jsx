// src/components/sections/HeroParallax.js
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <section ref={ref} className='relative h-screen overflow-hidden'>
      <motion.div style={{ y }} className='absolute inset-0 bg-cover bg-center'>
        <div
          className='w-full h-full'
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
      </motion.div>

      <div className='relative z-10 h-full flex items-center justify-center'>
        <h1 className='text-6xl font-bold text-white'>Welcome</h1>
      </div>
    </section>
  );
}
