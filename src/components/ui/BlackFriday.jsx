import { TicketPercent } from 'lucide-react';

const BlackFriday = () => {
  return (
    <div>
      <h1
        className='fixed top-0 left-0 z-50 w-full mx-auto mt-2 text-center
                   text-white text-sm md:text-base font-semibold uppercase
                   tracking-[0.18em] bg-cyan-600 py-2 flex items-center justify-center gap-2'
      >
        <span>New Patient Special Discount</span>
        <TicketPercent className='w-4 h-4' aria-hidden='true' />
        <span>50% off your first visit</span>
      </h1>
    </div>
  );
};

export default BlackFriday;
