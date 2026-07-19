// components/HeroSlider.js
'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    id: 1,
    title: 'Your Health, Our Priority',
    subtitle: 'Book an appointment with trusted doctors in seconds.',
    image: '/images/hero/doctor-consultation-1.png',
    href: '/book-appointment',
    cta: 'Book Appointment',
  },
  {
    id: 2,
    title: 'Care That Starts With Listening',
    subtitle: 'Find experienced doctors for every health concern.',
    image: '/images/hero/doctor-consultation-2.png',
    href: '/doctors',
    cta: 'Find a Doctor',
  },
  {
    id: 3,
    title: 'Healthcare From Anywhere',
    subtitle: 'Connect with doctors through secure online consultation.',
    image: '/images/hero/telemedicine.png',
    href: '/services',
    cta: 'Consult Online',
  },
  {
    id: 4,
    title: 'A Team You Can Trust',
    subtitle: 'Professional healthcare specialists are ready to help.',
    image: '/images/hero/doctor-consultation-1.png',
    href: '/doctors',
    cta: 'Meet Our Doctors',
  },
  {
    id: 5,
    title: 'Simple Appointment Booking',
    subtitle: 'Choose your doctor, select a time, and confirm your visit.',
    image: '/images/hero/doctor-consultation-2.png',
    href: '/book-appointment',
    cta: 'Get Started',
  },
];

export default function HeroSlider() {
  const swiperRef = useRef(null);

  return (
    <section className='relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-gray-950'>
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect='fade'
        fadeEffect={{ crossFade: true }}
        speed={1200}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-hero-bullet',
          bulletActiveClass: 'swiper-hero-bullet-active',
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className='w-full h-full'
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className='relative w-full h-full'>
              {/* Background Image */}
              <div
                className='absolute inset-0 bg-cover bg-center scale-105'
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* linear Overlay */}
              <div className='absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/60 to-gray-950/20' />
              <div className='absolute inset-0 bg-linear-to-r from-gray-950/80 via-gray-950/30 to-transparent' />

              {/* Content */}
              <div className='relative z-10 h-full flex items-center'>
                <div className='max-w-6xl mx-auto px-6 w-full'>
                  <div className='max-w-xl'>
                    <span className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium mb-6 swiper-hero-fade'>
                      <Calendar className='w-4 h-4' />
                      Trusted Healthcare Platform
                    </span>

                    <h1 className='text-4xl md:text-6xl font-bold text-white leading-tight mb-4 swiper-hero-fade'>
                      {slide.title}
                    </h1>

                    <p className='text-lg text-gray-300 mb-8 max-w-md swiper-hero-fade'>
                      {slide.subtitle}
                    </p>

                    <Link
                      href={slide.href}
                      className='inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-linear-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 hover:scale-105 active:scale-95 swiper-hero-fade'
                    >
                      {slide.cta}
                      <ArrowRight className='w-4 h-4' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300'
        aria-label='Previous slide'
      >
        <ChevronLeft className='w-5 h-5' />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300'
        aria-label='Next slide'
      >
        <ChevronRight className='w-5 h-5' />
      </button>
    </section>
  );
}
