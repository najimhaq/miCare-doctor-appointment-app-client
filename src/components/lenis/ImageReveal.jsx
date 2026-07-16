'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ImageReveal({ src, alt, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    ['inset(100% 0 0 0)', 'inset(0 0 0 0)']
  );

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ clipPath }}
        className='w-full h-full overflow-hidden'
      >
        <img src={src} alt={alt} className='w-full h-full object-cover' />
      </motion.div>
    </div>
  );
}
