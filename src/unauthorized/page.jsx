'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiLock, FiArrowLeft, FiHome } from 'react-icons/fi';
import { useSession } from '@/lib/auth-client';



const roleRedirect = {
  seeker: '/dashboard/seeker',
  recruiter: '/dashboard/recruiter',
  admin: '/dashboard/admin',
};

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // ✅ Sign in থাকলে dashboard link, না থাকলে signin link
  const primaryHref = user
    ? roleRedirect[user?.role] || '/dashboard'
    : '/signin';

  const primaryLabel = user ? 'Go to My Dashboard' : 'Sign In';

  return (
    <div className='relative min-h-screen overflow-hidden bg-linear-to-br from-black via-gray-950 to-black flex items-center justify-center px-4'>
      {/* Background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className='absolute -top-1/3 -left-1/4 w-125 h-125 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none'
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className='absolute -bottom-1/3 -right-1/4 w-125 h-125 rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none'
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className='relative z-10 w-full max-w-md'
      >
        <div className='overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl text-center'>
          <div className='h-1 w-full bg-linear-to-r from-red-500 via-rose-500 to-red-500' />

          <div className='px-8 py-10 sm:px-10'>
            {/* Lock icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 18,
                delay: 0.2,
              }}
              className='mx-auto mb-6 w-20 h-20 relative flex items-center justify-center'
            >
              <motion.div
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='absolute inset-0 rounded-full bg-red-500/30'
              />
              <div className='w-20 h-20 rounded-full bg-linear-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 flex items-center justify-center'>
                <FiLock className='w-8 h-8 text-red-400' strokeWidth={2} />
              </div>
            </motion.div>

            {/* 403 badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-widest mb-4'
            >
              403 — Unauthorized
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h1 className='text-2xl font-bold text-white mb-3'>
                Access Denied
              </h1>
              {/* ✅ Message ও dynamic */}
              <p className='text-sm text-gray-400 leading-relaxed max-w-xs mx-auto'>
                {user
                  ? `Your account (${user.role}) doesn't have permission to view this page.`
                  : "You don't have permission to view this page. Please sign in with the correct account."}
              </p>
            </motion.div>

            <div className='my-8 h-px w-full bg-white/5' />

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className='flex flex-col gap-3'
            >
              {/* ✅ Primary button — dynamic */}
              <Link href={primaryHref}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow cursor-pointer'
                >
                  <FiLock size={15} />
                  {primaryLabel}
                </motion.div>
              </Link>

              <Link href='/'>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer'
                >
                  <FiHome size={15} />
                  Go to Home
                </motion.div>
              </Link>

              <button
                onClick={() => window.history.back()}
                className='flex w-full items-center justify-center gap-2 py-2.5 text-sm text-gray-500 hover:text-gray-300 transition cursor-pointer'
              >
                <FiArrowLeft size={14} />
                Go back
              </button>
            </motion.div>
          </div>

          <div className='border-t border-white/5 bg-white/2 px-8 py-4'>
            <p className='text-xs text-gray-500'>
              Think this is a mistake?{' '}
              <Link
                href='/support'
                className='text-violet-400 hover:text-violet-300 transition'
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
