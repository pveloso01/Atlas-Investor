'use client';

import React from 'react';
import HeroSection from '@/components/Landing/HeroSection';
import FeaturesSection from '@/components/Landing/FeaturesSection';
import TestimonialsSection from '@/components/Landing/TestimonialsSection';
import StatsSection from '@/components/Landing/StatsSection';
import TrustLogosSection from '@/components/Landing/TrustLogosSection';
import CTASection from '@/components/Landing/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <TrustLogosSection />
      <CTASection />
    </>
  );
}
