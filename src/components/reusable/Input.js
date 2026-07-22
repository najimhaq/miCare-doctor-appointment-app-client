export default function Input({
  label,
  name,
  register,
  errors,
  type = 'text',
  placeholder = '',
  className = '',
  disabled = false,
  ...props
}) {
  const hasError = errors?.[name];

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className='block text-sm font-medium text-white/70 mb-1.5'
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-white/30
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50
          ${hasError ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-cyan-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {hasError && (
        <p className='text-red-400 text-xs mt-1.5 flex items-center gap-1'>
          <span className='text-red-400'>⚠️</span> {errors[name].message}
        </p>
      )}
    </div>
  );
}
