'use client';

import React, { useState } from 'react';
import { Box, Switch, FormControlLabel, Typography, Tooltip, IconButton } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface AdvancedModeToggleProps {
  onToggle?: (enabled: boolean) => void;
  defaultEnabled?: boolean;
}

export default function AdvancedModeToggle({
  onToggle,
  defaultEnabled = false,
}: AdvancedModeToggleProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setEnabled(newValue);
    onToggle?.(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        backgroundColor: colors.neutral.gray50,
        borderRadius: 2,
        border: `1px solid ${colors.neutral.gray200}`,
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={handleToggle}
            color="primary"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Advanced Mode
            </Typography>
            <Tooltip title="Show advanced metrics like IRR, sensitivity analysis, and detailed cash flow projections">
              <IconButton size="small" sx={{ p: 0.5 }}>
                <InfoIcon sx={{ fontSize: 16, color: colors.neutral.gray500 }} />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      {enabled && (
        <Typography variant="caption" sx={{ color: colors.neutral.gray600, ml: 1 }}>
          Showing advanced analytics
        </Typography>
      )}
    </Box>
  );
}





