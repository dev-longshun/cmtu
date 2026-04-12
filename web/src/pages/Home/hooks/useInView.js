import { useRef, useState, useEffect } from 'react';

/**
 * Scroll-triggered visibility hook.
 * Finds the actual scrolling ancestor (the .semi-layout with overflow:auto)
 * and uses it as the IntersectionObserver root so fade-in works correctly
 * inside the PageLayout scroll container.
 */
export const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Find the nearest scrollable ancestor (the semi-layout container)
    let scrollRoot = null;
    let parent = el.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const ov = style.overflow + style.overflowY;
      if (ov.includes('auto') || ov.includes('scroll')) {
        scrollRoot = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      {
        root: scrollRoot,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
        ...options,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};
