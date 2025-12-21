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
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  useSubscription,
} from '@/lib/hooks/useSubscription';
import {
  useCreatePortalSessionMutation,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
  useGetSubscriptionHistoryQuery,
} from '@/lib/store/api/subscriptionApi';
import { colors } from '@/lib/theme/colors';

export default function SubscriptionPage() {
  const router = useRouter();
  const { subscription, tierName, daysRemaining, willCancelAtPeriodEnd, isLoading } = useSubscription();
  const [createPortal, { isLoading: isCreatingPortal }] = useCreatePortalSessionMutation();
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [resumeSubscription, { isLoading: isResuming }] = useResumeSubscriptionMutation();
  const { data: payments } = useGetSubscriptionHistoryQuery();

  const handleManageBilling = async () => {
    try {
      const result = await createPortal().unwrap();
      if (result.portal_url) {
        window.location.href = result.portal_url;
      }
    } catch (error) {
      console.error('Failed to create portal session:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeSubscription().unwrap();
    } catch (error) {
      console.error('Failed to resume subscription:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!subscription) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            No Active Subscription
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 4 }}>
            You are currently on the Free plan. Upgrade to unlock more features.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/pricing')}
            sx={{ backgroundColor: colors.primary.main }}
          >
            View Plans
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Subscription Management
      </Typography>

      {/* Current Subscription */}
      <Paper sx={{ p: 4, mb: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Current Plan: {tierName}
        </Typography>
        
        {willCancelAtPeriodEnd && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Your subscription will be cancelled at the end of the current billing period.
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 1 }}>
            Status: <strong>{subscription.status}</strong>
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 1 }}>
            Days Remaining: <strong>{daysRemaining}</strong>
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700 }}>
            Next Billing Date: <strong>{new Date(subscription.current_period_end).toLocaleDateString()}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={handleManageBilling}
            disabled={isCreatingPortal}
          >
            {isCreatingPortal ? 'Loading...' : 'Manage Billing'}
          </Button>
          {willCancelAtPeriodEnd ? (
            <Button
              variant="contained"
              onClick={handleResume}
              disabled={isResuming}
              sx={{ backgroundColor: colors.success.main }}
            >
              {isResuming ? 'Resuming...' : 'Resume Subscription'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => router.push('/pricing')}
          >
            Change Plan
          </Button>
        </Box>
      </Paper>

      {/* Payment History */}
      {payments && payments.length > 0 && (
        <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Payment History
          </Typography>
          <Box>
            {payments.map((payment) => (
              <Box key={payment.id} sx={{ mb: 2, pb: 2, borderBottom: `1px solid ${colors.neutral.gray200}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      €{payment.amount.toFixed(2)} {payment.currency}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                      {new Date(payment.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: payment.is_successful ? colors.success.main : colors.error.main,
                      fontWeight: 500,
                    }}
                  >
                    {payment.status}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
}

