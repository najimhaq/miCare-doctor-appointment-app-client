import { ClipLoader } from 'react-spinners';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95',
    secondary: 'bg-white/5 text-white hover:bg-white/10 active:scale-95',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 active:scale-95',
    outline:
      'border border-white/20 text-white hover:bg-white/5 active:scale-95',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <ClipLoader size={18} color='currentColor' />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
