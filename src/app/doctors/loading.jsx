// frontend/app/doctors/loading.jsx
export default function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-900/50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto'></div>
        <p className='text-white/60 mt-4'>Loading doctors...</p>
      </div>
    </div>
  );
}
