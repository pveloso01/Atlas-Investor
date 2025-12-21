'use client';

import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess';
import { colors } from '@/lib/theme/colors';

interface UsageDisplayProps {
  featureSlug: string;
  featureName: string;
}

export default function UsageDisplay({ featureSlug, featureName }: UsageDisplayProps) {
  const { usageCount, usageLimit, isWithinLimit, isLoading } = useFeatureAccess(featureSlug);

  if (isLoading || usageLimit === undefined) {
    return null;
  }

  const percentage = usageLimit ? (usageCount / usageLimit) * 100 : 0;

  return (
    <Paper sx={{ p: 2, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {featureName}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
          {usageCount} / {usageLimit || '∞'}
        </Typography>
      </Box>
      {usageLimit && (
        <LinearProgress
          variant="determinate"
          value={Math.min(percentage, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.neutral.gray200,
            '& .MuiLinearProgress-bar': {
              backgroundColor: isWithinLimit ? colors.success.main : colors.warning.main,
            },
          }}
        />
      )}
      {!isWithinLimit && (
        <Typography variant="caption" sx={{ color: colors.warning.main, mt: 1, display: 'block' }}>
          Limit reached. Upgrade to increase your limit.
        </Typography>
      )}
    </Paper>
  );
}

