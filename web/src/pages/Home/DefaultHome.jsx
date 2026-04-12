import React, { useEffect } from 'react';
import './landing.css';
import HeroSection from './sections/HeroSection';
import StepsSection from './sections/StepsSection';
import PerformanceSection from './sections/PerformanceSection';
import PricingSection from './sections/PricingSection';
import TrustSignals from './sections/TrustSignals';

const DefaultHome = () => {
  useEffect(() => {
    // Find the scroll container (.semi-layout with overflow:auto)
    // and apply smooth, natural scrolling behavior for the landing page.
    const root = document.querySelector('.ld-root');
    if (!root) return;

    let scrollContainer = null;
    let parent = root.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const ov = style.overflow + style.overflowY;
      if (ov.includes('auto') || ov.includes('scroll')) {
        scrollContainer = parent;
        break;
      }
      parent = parent.parentElement;
    }

    if (scrollContainer) {
      // Enable smooth native scrolling
      scrollContainer.style.scrollBehavior = 'smooth';
      scrollContainer.style.WebkitOverflowScrolling = 'touch';
      // Scroll to top on mount
      scrollContainer.scrollTop = 0;
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.style.scrollBehavior = '';
      }
    };
  }, []);

  return (
    <div className='ld-root'>
      <HeroSection />
      <StepsSection />
      <PerformanceSection />
      <PricingSection />
      <TrustSignals />
    </div>
  );
};

export default DefaultHome;
