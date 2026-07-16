'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

// স্থির পার্টিকেল ডেটা - সবসময় একই থাকবে
const generateParticles = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: (i * 2.13) % 100,
    left: (i * 1.73) % 100,
    size: ((i % 3) + 1) * 0.5,
    opacity: 0.1 + (i % 5) / 10,
  }));
};

function AnimatedBackgroundContent() {
  const containerRef = useRef(null);
  const particles = useMemo(() => generateParticles(), []);

  useEffect(() => {
    // GSAP লোড হওয়া পর্যন্ত অপেক্ষা
    const loadGSAP = async () => {
      const gsap = await import('gsap');
      const { default: GSAP } = gsap;

      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll('.particle');

      elements.forEach((el, i) => {
        GSAP.to(el, {
          x: GSAP.utils.random(-200, 200),
          y: GSAP.utils.random(-200, 200),
          scale: GSAP.utils.random(0.5, 1.5),
          rotation: GSAP.utils.random(-180, 180),
          duration: GSAP.utils.random(10, 20),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
    };

    loadGSAP();

    return () => {
      // ক্লিনআপ
      import('gsap').then((gsap) => {
        gsap.default.killTweensOf('.particle');
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 pointer-events-none overflow-hidden z-0'
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className='particle absolute rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30'
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// SSR সম্পূর্ণ ডিসেবল
export default dynamic(() => Promise.resolve(AnimatedBackgroundContent), {
  ssr: false,
  loading: () => (
    <div className='fixed inset-0 pointer-events-none overflow-hidden z-0' />
  ),
});
