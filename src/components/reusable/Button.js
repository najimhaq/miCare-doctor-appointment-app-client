// components/ui/Button.js
'use client';

import { cn } from "@/utils/cn";



export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  ...props
}) {
  const variants = {
    primary: 'bg-purple-500 text-white hover:bg-purple-600',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700',
    outline:
      'border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    gradient:
      'bg-linear-to-r from-purple-400 via-pink-400 to-sky-400 text-white hover:from-purple-600 hover:to-pink-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className='animate-spin -ml-1 mr-2 h-4 w-4'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
          />
        </svg>
      )}
      {children}
    </button>
  );
}
