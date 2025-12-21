'use client';

import React from 'react';
import { Container } from '@mui/material';
import HeroSection from '@/components/Landing/HeroSection';
import FeaturesSection from '@/components/Landing/FeaturesSection';
import TestimonialsSection from '@/components/Landing/TestimonialsSection';
import StatsSection from '@/components/Landing/StatsSection';
import TrustLogosSection from '@/components/Landing/TrustLogosSection';
import CTASection from '@/components/Landing/CTASection';
import DisclaimerBanner from '@/components/Shared/DisclaimerBanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <DisclaimerBanner storageKey="atlas-homepage-disclaimer" condensed={true} />
      </Container>
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <TrustLogosSection />
      <CTASection />
    </>
  );
}
