'use client';

import { motion } from 'framer-motion';

export default function SecondTextReveal({ text, className }) {
  const words = text.split(' ');

  return (
    <motion.h1
      className={className}
      initial='hidden'
      animate='visible'
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <span key={index} className='inline-block mr-2'>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className='inline-block'
              variants={{
                hidden: { y: 100, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: 'spring',
                    damping: 12,
                    stiffness: 100,
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}
