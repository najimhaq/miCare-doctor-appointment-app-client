'use client';
import { motion } from 'framer-motion';
import Section from '@/components/sections/Section';
import {
  FaCalendarCheck,
  FaUserMd,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaHeartbeat,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaHospital,
  FaAward,
} from 'react-icons/fa';


import StepCard from '@/components/ui/StepCard';
import FeatureCard from '@/components/ui/FeatureCard';
import StatsCard from '@/components/ui/StatsCard';



export default function Home() {
  const features = [
    {
      icon: FaUserMd,
      title: 'Expert Doctors',
      description:
        'Browse through our network of qualified and experienced doctors across various specialties.',
      color: 'cyan',
    },
    {
      icon: FaCalendarCheck,
      title: 'Easy Booking',
      description:
        'Book appointments in just a few clicks. Choose your preferred date, time, and doctor.',
      color: 'teal',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure & Private',
      description:
        'Your medical information is protected with enterprise-grade security and encryption.',
      color: 'blue',
    },
    {
      icon: FaClock,
      title: '24/7 Availability',
      description:
        'Access your appointments, prescriptions, and medical records anytime, anywhere.',
      color: 'purple',
    },
    {
      icon: FaStar,
      title: 'Patient Reviews',
      description:
        'Read genuine reviews from other patients to make informed decisions about your care.',
      color: 'yellow',
    },
    {
      icon: FaHeartbeat,
      title: 'Health Tracking',
      description:
        'Keep track of your medical history, prescriptions, and upcoming appointments.',
      color: 'pink',
    },
  ];

  const stats = [
    { icon: FaUsers, value: '10,000+', label: 'Happy Patients', color: 'cyan' },
    { icon: FaUserMd, value: '500+', label: 'Expert Doctors', color: 'teal' },
    { icon: FaHospital, value: '50+', label: 'Specialties', color: 'blue' },
    { icon: FaAward, value: '4.9/5', label: 'Patient Rating', color: 'yellow' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Search Doctors',
      description:
        'Find doctors by specialty, location, or availability. Filter by ratings and experience.',
    },
    {
      number: '02',
      title: 'Book Appointment',
      description:
        'Select your preferred time slot and confirm your appointment with just a few clicks.',
    },
    {
      number: '03',
      title: 'Get Consultation',
      description:
        'Visit the doctor or connect online. Receive prescriptions and follow-up care.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section showTopDivider={false} showBadge={false}>
        {/* Background Grid */}
        <div className='absolute inset-0 bg-[linear-linear(rgba(255,255,255,0.02)_1px,transparent_1px),linear-linear(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size:64px_64px' />

        {/* linear Orbs */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[128px] animate-pulse' />
        <div className='absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]' />

        <div className='relative z-10 text-center max-w-5xl mx-auto px-6'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-8'
          >
            <div className='w-2 h-2 rounded-full bg-cyan-400 animate-pulse' />
            <span className='text-sm text-cyan-300 font-medium'>
              Trusted by 10,000+ Patients
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight'
          >
            <span className='bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>
              Your Health,
            </span>
            <br />
            <span className='bg-linear-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent'>
              Our Priority
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed'
          >
            Connect with top-rated doctors, book appointments instantly, and
            manage your healthcare journey all in one place. Quality medical
            care is now just a click away.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <a
              href='#features'
              className='group px-8 py-4 rounded-full bg-linear-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2'
            >
              Book Appointment
              <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
            </a>
            <a
              href='#about'
              className='px-8 py-4 rounded-full border-2 border-gray-700 text-gray-300 font-semibold hover:border-cyan-500/50 hover:text-white hover:bg-white/5 transition-all duration-300'
            >
              Learn More
            </a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500'
          >
            <div className='flex items-center gap-2'>
              <FaCheckCircle className='text-green-500' />
              <span>Verified Doctors</span>
            </div>
            <div className='flex items-center gap-2'>
              <FaCheckCircle className='text-green-500' />
              <span>Secure Payments</span>
            </div>
            <div className='flex items-center gap-2'>
              <FaCheckCircle className='text-green-500' />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className='absolute bottom-10 left-1/2 -translate-x-1/2'
        >
          <div className='w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2'>
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='w-1.5 h-1.5 rounded-full bg-cyan-400'
            />
          </div>
        </motion.div>
      </Section>

      {/* Stats Section */}
      <Section
        id='stats'
        bgColor='from-gray-950 via-gray-900 to-gray-950'
        fullHeight={false}
      >
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto'>
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} index={index} />
          ))}
        </div>
      </Section>

      {/* Features Section */}
      <Section
        id='features'
        title='Why Choose Us'
        description='Experience healthcare reimagined with our comprehensive platform designed for your convenience and peace of mind.'
        bgColor='from-gray-950 via-gray-900 to-gray-950'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </Section>

      {/* How It Works Section */}
      <Section
        id='how-it-works'
        title='How It Works'
        description='Getting started is simple. Follow these three easy steps to book your appointment.'
        bgColor='from-gray-950 via-blue-950/20 to-gray-950'
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </Section>

      {/* About Section */}
      <Section
        id='about'
        title='About Us'
        description='We are revolutionizing healthcare access by connecting patients with qualified doctors through our innovative digital platform.'
        bgColor='from-gray-950 via-purple-950/20 to-gray-950'
      >
        <div className='mt-8 max-w-3xl mx-auto'>
          <p className='text-gray-400 leading-relaxed mb-6'>
            Founded with the mission to make quality healthcare accessible to
            everyone, our platform bridges the gap between patients and
            healthcare providers. We believe that everyone deserves timely
            medical attention, and technology can make that possible.
          </p>
          <p className='text-gray-400 leading-relaxed'>
            Our team of healthcare professionals and technologists work together
            to ensure a seamless, secure, and user-friendly experience. From
            booking appointments to managing medical records, we've got you
            covered.
          </p>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id='cta' bgColor='from-gray-950 via-cyan-950/30 to-gray-950'>
        <div className='text-center max-w-3xl mx-auto'>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent'
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg text-gray-400 mb-8'
          >
            Join thousands of patients who trust us with their healthcare needs.
            Book your appointment today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href='/signup'
              className='inline-flex items-center gap-2 px-10 py-4 rounded-full bg-linear-to-r from-cyan-500 to-teal-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300'
            >
              Sign Up Now
              <FaArrowRight />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section
        id='contact'
        title='Get In Touch'
        description='Have questions or need assistance? Our support team is here to help you 24/7.'
        bgColor='from-gray-950 via-gray-900 to-gray-950'
      >
        <div className='mt-8 max-w-2xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-cyan-500/50 transition-all'>
              <div className='text-3xl mb-3'>📧</div>
              <h3 className='text-white font-semibold mb-2'>Email</h3>
              <p className='text-gray-400 text-sm'>support@doctorbooking.com</p>
            </div>
            <div className='text-center p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-cyan-500/50 transition-all'>
              <div className='text-3xl mb-3'>📞</div>
              <h3 className='text-white font-semibold mb-2'>Phone</h3>
              <p className='text-gray-400 text-sm'>+1 (555) 123-4567</p>
            </div>
            <div className='text-center p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-cyan-500/50 transition-all'>
              <div className='text-3xl mb-3'>💬</div>
              <h3 className='text-white font-semibold mb-2'>Live Chat</h3>
              <p className='text-gray-400 text-sm'>Available 24/7</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
