'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import { useSubscription } from '@/lib/hooks/useSubscription';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { colors } from '@/lib/theme/colors';

export default function SubscriptionCancelPage() {
  const router = useRouter();
  const { subscription, willCancelAtPeriodEnd } = useSubscription();

  if (!subscription) {
    return (
      <ProtectedRoute>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              No Active Subscription
            </Typography>
            <Button variant="contained" onClick={() => router.push('/pricing')}>
              View Plans
            </Button>
          </Paper>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 6, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Cancel Subscription
        </Typography>
        
        {willCancelAtPeriodEnd ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            Your subscription has been scheduled for cancellation at the end of the current billing period.
            You will continue to have access until {new Date(subscription.current_period_end).toLocaleDateString()}.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 4 }}>
              Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => router.push('/subscription')}
              >
                Cancel Subscription
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/subscription')}
              >
                Keep Subscription
              </Button>
            </Box>
          </>
        )}
      </Paper>
      </Container>
    </ProtectedRoute>
  );
}

