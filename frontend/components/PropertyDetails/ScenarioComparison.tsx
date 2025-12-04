'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, ToggleButtonGroup, ToggleButton, Grid, Paper } from '@mui/material';
import { colors } from '@/lib/theme/colors';

type Scenario = 'long-term' | 'short-term';

interface ScenarioComparisonProps {
  propertyPrice: number;
  defaultRentalIncome?: number;
}

export default function ScenarioComparison({
  propertyPrice,
  defaultRentalIncome = 1200,
}: ScenarioComparisonProps) {
  const [scenario, setScenario] = useState<Scenario>('long-term');

  // Long-term rental scenario
  const longTermData = {
    monthlyIncome: defaultRentalIncome,
    occupancyRate: 95,
    operatingExpenses: 300,
    monthlyCashFlow: defaultRentalIncome * 0.95 - 300,
    annualROI: ((defaultRentalIncome * 0.95 - 300) * 12 / propertyPrice) * 100,
  };

  // Short-term rental scenario
  const shortTermData = {
    monthlyIncome: defaultRentalIncome * 2.5, // Higher income potential
    occupancyRate: 70, // Lower occupancy
    operatingExpenses: 500, // Higher expenses (cleaning, management)
    monthlyCashFlow: defaultRentalIncome * 2.5 * 0.7 - 500,
    annualROI: ((defaultRentalIncome * 2.5 * 0.7 - 500) * 12 / propertyPrice) * 100,
  };

  const currentData = scenario === 'long-term' ? longTermData : shortTermData;

  const handleScenarioChange = (_event: React.MouseEvent<HTMLElement>, newScenario: Scenario | null) => {
    if (newScenario !== null) {
      setScenario(newScenario);
    }
  };

  return (
    <Card
      sx={{
        border: `1px solid ${colors.neutral.gray200}`,
        borderRadius: 2,
        mb: 4,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Scenario Comparison
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 4 }}>
          Compare long-term vs short-term rental strategies
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            value={scenario}
            exclusive
            onChange={handleScenarioChange}
            aria-label="rental scenario"
            sx={{
              '& .MuiToggleButton-root': {
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                border: `2px solid ${colors.neutral.gray300}`,
                '&.Mui-selected': {
                  backgroundColor: colors.primary.main,
                  color: colors.neutral.white,
                  borderColor: colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.dark,
                  },
                },
              },
            }}
          >
            <ToggleButton value="long-term" aria-label="long-term rental">
              Long-Term Rental
            </ToggleButton>
            <ToggleButton value="short-term" aria-label="short-term rental">
              Short-Term Rental
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            transition: 'all 0.3s ease',
            transform: scenario === 'short-term' ? 'translateX(0)' : 'translateX(0)',
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: colors.neutral.gray50,
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.neutral.gray600, display: 'block', mb: 1 }}>
                  Monthly Income
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main }}>
                  €{currentData.monthlyIncome.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: colors.neutral.gray50,
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.neutral.gray600, display: 'block', mb: 1 }}>
                  Occupancy Rate
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: colors.info.main }}>
                  {currentData.occupancyRate}%
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: colors.neutral.gray50,
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.neutral.gray600, display: 'block', mb: 1 }}>
                  Monthly Cash Flow
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: currentData.monthlyCashFlow > 0 ? colors.success.main : colors.error.main,
                  }}
                >
                  €{currentData.monthlyCashFlow.toFixed(0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: colors.primary.main + '10',
                  borderRadius: 2,
                  border: `2px solid ${colors.primary.main}`,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.neutral.gray600, display: 'block', mb: 1 }}>
                  Projected ROI
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main }}>
                  {currentData.annualROI.toFixed(1)}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: colors.info.main + '10',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: colors.neutral.gray700, lineHeight: 1.7 }}>
            <strong>{scenario === 'long-term' ? 'Long-Term Rental:' : 'Short-Term Rental:'}</strong>{' '}
            {scenario === 'long-term'
              ? 'Stable, predictable income with lower management overhead. Ideal for passive investors seeking consistent cash flow.'
              : 'Higher income potential but requires more active management. Best for properties in tourist areas with strong demand.'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

