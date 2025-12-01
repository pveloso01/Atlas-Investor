'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Home,
  CalendarToday,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface InvestmentMetricsProps {
  roi?: number;
  yield?: number;
  cashFlow?: number;
  occupancyRate?: number;
  paybackPeriod?: number;
}

export default function InvestmentMetrics({
  roi = 12.5,
  yield: rentalYield = 5.2,
  cashFlow = 800,
  occupancyRate = 95,
  paybackPeriod = 8,
}: InvestmentMetricsProps) {
  const metrics = [
    {
      label: 'ROI',
      value: `${roi.toFixed(1)}%`,
      icon: TrendingUp,
      color: roi > 10 ? colors.success.main : colors.warning.main,
      trend: roi > 10 ? 'up' : 'neutral',
      description: 'Return on Investment',
    },
    {
      label: 'Rental Yield',
      value: `${rentalYield.toFixed(1)}%`,
      icon: AccountBalance,
      color: rentalYield > 5 ? colors.success.main : colors.warning.main,
      trend: rentalYield > 5 ? 'up' : 'neutral',
      description: 'Annual rental income / Property value',
    },
    {
      label: 'Monthly Cash Flow',
      value: `€${cashFlow.toLocaleString()}`,
      icon: Home,
      color: cashFlow > 0 ? colors.success.main : colors.error.main,
      trend: cashFlow > 0 ? 'up' : 'down',
      description: 'Net monthly income after expenses',
    },
    {
      label: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      icon: Home,
      color: occupancyRate > 90 ? colors.success.main : colors.warning.main,
      trend: occupancyRate > 90 ? 'up' : 'neutral',
      description: 'Expected occupancy percentage',
    },
    {
      label: 'Payback Period',
      value: `${paybackPeriod} years`,
      icon: CalendarToday,
      color: paybackPeriod < 10 ? colors.success.main : colors.warning.main,
      trend: paybackPeriod < 10 ? 'up' : 'neutral',
      description: 'Time to recover initial investment',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, mb: 3, color: colors.neutral.gray900 }}
      >
        Investment Metrics
      </Typography>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: `1px solid ${colors.neutral.gray200}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        backgroundColor: metric.color + '15',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 24, color: metric.color }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.neutral.gray600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        {metric.label}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: colors.neutral.gray900,
                          mb: 0.5,
                        }}
                      >
                        {metric.value}
                      </Typography>
                      {metric.trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {metric.trend === 'up' ? (
                            <TrendingUp sx={{ fontSize: 14, color: colors.success.main }} />
                          ) : (
                            <TrendingDown sx={{ fontSize: 14, color: colors.error.main }} />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              color: metric.trend === 'up' ? colors.success.main : colors.error.main,
                              fontSize: '0.7rem',
                            }}
                          >
                            {metric.trend === 'up' ? 'Above average' : 'Below average'}
                          </Typography>
                        </Box>
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.neutral.gray500,
                          fontSize: '0.7rem',
                          display: 'block',
                          mt: 0.5,
                        }}
                      >
                        {metric.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

