'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import {
  TrendingUp,
  Home,
  Euro,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { Property } from '@/types/property';

interface SummaryCardsProps {
  properties: Property[];
  averageYield?: number;
  averageROI?: number;
}

export default function SummaryCards({
  properties,
  averageYield = 0,
  averageROI = 0,
}: SummaryCardsProps) {
  const totalDeals = properties.length;
  const averagePrice =
    properties.length > 0
      ? properties.reduce((sum, p) => sum + parseFloat(p.price), 0) / properties.length
      : 0;

  const cards = [
    {
      label: 'Deals Found',
      value: totalDeals.toLocaleString(),
      icon: Home,
      color: colors.primary.main,
      trend: null,
    },
    {
      label: 'Average Yield',
      value: `${averageYield.toFixed(1)}%`,
      icon: TrendingUp,
      color: averageYield > 5 ? colors.success.main : colors.warning.main,
      trend: averageYield > 5 ? 'up' : 'neutral',
    },
    {
      label: 'Average ROI',
      value: `${averageROI.toFixed(1)}%`,
      icon: TrendingUp,
      color: averageROI > 10 ? colors.success.main : colors.warning.main,
      trend: averageROI > 10 ? 'up' : 'neutral',
    },
    {
      label: 'Avg. Price',
      value: new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(averagePrice),
      icon: Euro,
      color: colors.info.main,
      trend: null,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Grid size={{ xs: 6, md: 3 }} key={index}>
            <Card
              sx={{
                border: `1px solid ${colors.neutral.gray200}`,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.neutral.gray600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: colors.neutral.gray900,
                        mt: 0.5,
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      backgroundColor: card.color + '15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 24, color: card.color }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

