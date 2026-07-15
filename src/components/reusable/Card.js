'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  hover = true,
  className = '',
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        bg-white rounded-2xl shadow-md
        overflow-hidden
        ${hover ? 'hover:shadow-2xl' : ''}
        transition-shadow duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Card Header Sub-component
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// Card Body Sub-component
export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

// Card Footer Sub-component
export function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`}
    >
      {children}
    </div>
  );
}
