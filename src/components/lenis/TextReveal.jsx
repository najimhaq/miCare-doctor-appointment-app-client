'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

export default function TextReveal({ text = '', className, delay = 0 }) {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.3,
          delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={wrapperRef} className='overflow-hidden'>
      <h1
        ref={textRef}
        className={className}
        style={{ willChange: 'transform, opacity' }}
      >
        {text}
      </h1>
    </div>
  );
}
