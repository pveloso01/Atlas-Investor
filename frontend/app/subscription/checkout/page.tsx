'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierSlug = searchParams.get('tier');
  const billingPeriod = searchParams.get('period') || 'monthly';

  useEffect(() => {
    // This page is just a redirect handler
    // The actual checkout is handled by Stripe
    router.push('/pricing');
  }, [router]);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Redirecting to checkout...</Typography>
      </Box>
    </Container>
  );
}

