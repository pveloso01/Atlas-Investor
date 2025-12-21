'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Paper, Typography, Box, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { colors } from '@/lib/theme/colors';

interface UpgradePromptProps {
  requiredTier?: string;
  message?: string;
}

export default function UpgradePrompt({ requiredTier, message }: UpgradePromptProps) {
  const router = useRouter();
  const { tierName } = useSubscription();

  const defaultMessage = requiredTier
    ? `This feature requires a ${requiredTier} subscription. You are currently on ${tierName}.`
    : `Upgrade your subscription to access this feature.`;

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: colors.primary.lightest,
        border: `1px solid ${colors.primary.main}`,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.primary.dark }}>
        Upgrade Required
      </Typography>
      <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 3 }}>
        {message || defaultMessage}
      </Typography>
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        onClick={() => router.push('/pricing')}
        sx={{
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        }}
      >
        View Plans
      </Button>
    </Paper>
  );
}

