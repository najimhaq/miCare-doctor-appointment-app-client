'use client';

import { useState, useEffect } from 'react';

const TypingAnimation = () => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const words = [
    'Full Stack Web Developer',
    'Next.js Prisma PostgreSQL MongoDB Expert',
    'UI/UX Enthusiast',
    'Open Source Contributor',
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[index];
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, words]);

  return (
    <span className='font-normal'>
      {text}
      <span className='animate-pulse'>|</span>
    </span>
  );
};

export default TypingAnimation;
