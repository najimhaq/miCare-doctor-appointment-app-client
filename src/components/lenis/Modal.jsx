// src/components/ui/Modal.js
'use client';

import { useLenis } from 'lenis/react';

export default function Modal({ isOpen, onClose, children }) {
  const lenis = useLenis();

  const handleOpen = () => {
    lenis?.stop(); // Scroll lock
  };

  const handleClose = () => {
    lenis?.start(); // Scroll unlock
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center'>
          <div className='bg-gray-900 p-8 rounded-2xl'>
            {children}
            <button
              onClick={handleClose}
              className='mt-4 px-4 py-2 bg-cyan-500 rounded'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
