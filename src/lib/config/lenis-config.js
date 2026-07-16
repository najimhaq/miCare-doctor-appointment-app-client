export const lenisOptions = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  smoothTouch: false,
  touchMultiplier: 2,
  wheelMultiplier: 1,
  lerp: 0.1,
  infinite: false,
};

export const scrollToOptions = {
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  offset: -80,
};
