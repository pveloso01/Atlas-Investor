'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { colors } from '@/lib/theme/colors';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refetch } = useSubscription();

  useEffect(() => {
    // Refetch subscription data after successful payment
    if (sessionId) {
      refetch();
    }
  }, [sessionId, refetch]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center', border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: colors.success.main, mb: 2 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Subscription Activated!
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 4 }}>
          Thank you for subscribing to Atlas Investor. Your subscription has been activated and you now have access to all premium features.
        </Typography>
        <Alert severity="success" sx={{ mb: 4 }}>
          You will receive a confirmation email shortly with your subscription details.
        </Alert>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => router.push('/dashboard')}
            sx={{ backgroundColor: colors.primary.main }}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/subscription')}
          >
            Manage Subscription
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

