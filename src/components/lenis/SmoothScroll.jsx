// components/SmoothScrollProvider.jsx
'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { lenisOptions } from '@/lib/lenis-config';

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef();

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    lenis.on('scroll', ScrollTrigger.update);
  }, []);

  return (
    <ReactLenis root options={lenisOptions} ref={lenisRef} autoRaf={false}>
      {children}
    </ReactLenis>
  );
}
