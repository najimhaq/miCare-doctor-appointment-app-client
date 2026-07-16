'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ImageParallax({ src, alt, className }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    // জুম ইন/আউট ইফেক্ট
    gsap.fromTo(
      image,
      { scale: 1.2 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      }
    );

    // রোটেশন ইফেক্ট
    gsap.fromTo(
      image,
      { rotation: -3 },
      {
        rotation: 3,
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className='w-full h-full object-cover'
      />
    </div>
  );
}
