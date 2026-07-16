'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

export default function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}
