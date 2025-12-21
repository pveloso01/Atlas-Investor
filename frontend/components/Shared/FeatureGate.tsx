'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { colors } from '@/lib/theme/colors';
import UsageDisplay from '@/components/Subscription/UsageDisplay';

interface FeatureGateProps {
  children: React.ReactNode;
  featureSlug: string;
  featureName: string;
  requiredTier?: string;
  showUsage?: boolean;
}

export default function FeatureGate({
  children,
  featureSlug,
  featureName,
  requiredTier,
  showUsage = false,
}: FeatureGateProps) {
  const router = useRouter();
  const { hasAccess, usageCount, usageLimit, isWithinLimit, tierSlug } = useFeatureAccess(featureSlug);
  const { tierName } = useSubscription();

  // Check if feature is locked
  const isLocked = !hasAccess || !isWithinLimit;

  // Generate upgrade message based on tier
  const getUpgradeMessage = () => {
    if (!isWithinLimit && usageLimit) {
      return `You've reached your limit of ${usageLimit} ${featureName.toLowerCase()} this month. Upgrade to increase your limit.`;
    }
    if (requiredTier) {
      return `This feature requires a ${requiredTier} subscription. You are currently on ${tierName}.`;
    }
    return `Upgrade your subscription to access ${featureName}.`;
  };

  if (!isLocked) {
    return (
      <>
        {showUsage && usageLimit !== undefined && (
          <UsageDisplay featureSlug={featureSlug} featureName={featureName} />
        )}
        {children}
      </>
    );
  }

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: colors.neutral.gray50,
        border: `2px dashed ${colors.neutral.gray300}`,
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          filter: 'blur(4px)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.3,
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <LockIcon sx={{ fontSize: 48, color: colors.neutral.gray400, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.neutral.gray700 }}>
          {featureName}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 2 }}>
          {getUpgradeMessage()}
        </Typography>
        {showUsage && usageLimit !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
              Usage: {usageCount} / {usageLimit}
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          onClick={() => router.push('/pricing')}
          sx={{
            backgroundColor: colors.accent.main,
            '&:hover': {
              backgroundColor: colors.accent.dark,
            },
          }}
        >
          See Plans
        </Button>
      </Box>
    </Paper>
  );
}

