'use client';

import { useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { scrollToOptions } from '@/lib/config/lenis-config';


export function useLenisScroll() {
  const lenis = useLenis();

  const scrollToElement = useCallback(
    (selector, customOptions = {}) => {
      const element = document.querySelector(selector);
      if (element && lenis) {
        lenis.scrollTo(element, {
          ...scrollToOptions,
          ...customOptions,
        });
      }
    },
    [lenis]
  );

  const scrollToTop = useCallback(
    (customOptions = {}) => {
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 2,
          ...customOptions,
        });
      }
    },
    [lenis]
  );

  const scrollToBottom = useCallback(
    (customOptions = {}) => {
      if (lenis) {
        lenis.scrollTo('bottom', {
          duration: 2,
          ...customOptions,
        });
      }
    },
    [lenis]
  );

  return { scrollToElement, scrollToTop, scrollToBottom };
}
