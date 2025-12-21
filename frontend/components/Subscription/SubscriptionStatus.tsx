'use client';

import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { colors } from '@/lib/theme/colors';

export default function SubscriptionStatus() {
  const { subscription, tierName, daysRemaining, willCancelAtPeriodEnd } = useSubscription();

  if (!subscription) {
    return (
      <Paper sx={{ p: 3, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
          Plan: Free
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
          Upgrade to unlock premium features
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Plan: {tierName}
        </Typography>
        <Chip
          label={subscription.status}
          size="small"
          color={subscription.is_active ? 'success' : 'default'}
        />
      </Box>
      {willCancelAtPeriodEnd && (
        <Typography variant="body2" sx={{ color: colors.warning.main, mt: 1 }}>
          Cancelling at period end
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: colors.neutral.gray600, mt: 1 }}>
        {daysRemaining} days remaining
      </Typography>
    </Paper>
  );
}

