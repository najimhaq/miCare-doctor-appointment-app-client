// frontend/components/DoctorCardSkeleton.jsx
export const DoctorCardSkeleton = () => {
  return (
    <div className='bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden animate-pulse'>
      {/* Image Skeleton */}
      <div className='h-48 md:h-56 bg-white/5'></div>

      {/* Content Skeleton */}
      <div className='p-4 md:p-5 space-y-3'>
        <div className='h-6 bg-white/5 rounded-lg w-3/4'></div>
        <div className='h-4 bg-white/5 rounded-lg w-1/2'></div>
        <div className='flex gap-1'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='w-4 h-4 bg-white/5 rounded-full'></div>
          ))}
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='h-4 bg-white/5 rounded-lg'></div>
          <div className='h-4 bg-white/5 rounded-lg'></div>
        </div>
        <div className='h-10 bg-white/5 rounded-lg'></div>
      </div>
    </div>
  );
};
