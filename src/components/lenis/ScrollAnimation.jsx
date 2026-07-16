'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();

    // Lenis ke GSAP ScrollTrigger er sathe connect kora
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Animation example
    const cards = containerRef.current.querySelectorAll('.card');

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className='space-y-8 py-20'>
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className='card w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl'
        >
          <h2 className='text-2xl font-bold mb-4'>Card {item}</h2>
          <p className='text-gray-600'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      ))}
    </div>
  );
}
