'use client';
import { motion } from 'framer-motion';
import Section from '../sections/Section';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const Contact = () => {
  return (
    <div>
      <Section
        showTopDivider={false}
        id='contact'
        title='Get In Touch'
        description='Have questions or need assistance? Our support team is here to help you 24/7.'
        bgColor='from-gray-950 via-gray-900 to-gray-950'
      >
        <div className='mt-1 max-w-2xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-cyan-500/50 transition-all'>
              <div className='text-3xl mb-3'>📧</div>
              <h3 className='text-white font-semibold mb-2'>Email</h3>
              <p className='text-gray-400 text-sm'>support@micare.com</p>
            </div>
            <div className='text-center p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-cyan-500/50 transition-all'>
              <div className='text-3xl mb-3'>📞</div>
              <h3 className='text-white font-semibold mb-2'>Phone</h3>
              <p className='text-gray-400 text-sm'>+880 1234 5678</p>
            </div>
            <div className='text-center p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-cyan-500/50 transition-all'>
              <div className='text-3xl mb-3'>💬</div>
              <h3 className='text-white font-semibold mb-2'>Live Chat</h3>
              <p className='text-gray-400 text-sm'>Available 24/7</p>
            </div>
          </div>
        </div>
      </Section>
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
            <Link
              href='/signup'
              className='inline-flex items-center gap-2 px-10 py-4 rounded-full bg-linear-to-r from-cyan-500 to-teal-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300'
            >
              Sign Up Now
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
