// components/ui/button.jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils'; // যদি ব্যবহার করেন

export const Button = forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      loading = false, // ✅ destructure করে আলাদা রাখা হলো
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading} // ✅ loading হলে বাটন নিজে থেকেই disable
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-cyan-500 text-white hover:bg-cyan-600',
          variant === 'secondary' && 'bg-white/5 text-white hover:bg-white/10',
          className
        )}
        {...props} // ✅ এখন loading এর মধ্যে নেই, তাই DOM-এ যাবে না
      >
        {loading ? (
          <span className='flex items-center gap-2'>
            <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
