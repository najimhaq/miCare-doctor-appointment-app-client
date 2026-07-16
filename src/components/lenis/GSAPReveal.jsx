'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPReveal({ children, className, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    // টেক্সট রিভিল অ্যানিমেশন
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 100,
        scale: 0.9,
        rotateX: 15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1.2,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 45%',
          toggleActions: 'play none none reverse',
          // scrub: 1, // স্ক্রল এর সাথে সিঙ্ক্রোনাইজড
        },
      }
    );

    // প্যারালাক্স ইফেক্ট
    gsap.to(element, {
      y: -50,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
