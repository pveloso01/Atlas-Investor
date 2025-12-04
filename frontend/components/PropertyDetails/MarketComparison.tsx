'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Paper, LinearProgress } from '@mui/material';
import { TrendingUp, Home } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';

interface MarketComparisonProps {
  propertyYield: number;
  percentileRank: number;
  comparableProperties?: Property[];
}

export default function MarketComparison({
  propertyYield = 5.2,
  percentileRank = 85,
  comparableProperties = [],
}: MarketComparisonProps) {
  const getPercentileLabel = (rank: number) => {
    if (rank >= 90) return 'Top 10%';
    if (rank >= 75) return 'Top 25%';
    if (rank >= 50) return 'Above Average';
    if (rank >= 25) return 'Below Average';
    return 'Bottom 25%';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, mb: 3, color: colors.neutral.gray900 }}
      >
        Market Comparison
      </Typography>

      <Grid container spacing={3}>
        {/* Percentile Rank */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: `1px solid ${colors.neutral.gray200}`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp sx={{ color: colors.success.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Market Ranking
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 3 }}>
                This property&apos;s yield is in the{' '}
                <strong style={{ color: colors.accent.main }}>top {100 - percentileRank}%</strong>{' '}
                in this market area.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                    Percentile Rank
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary.main }}>
                    {percentileRank}th
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentileRank}
                  sx={{
                    height: 12,
                    borderRadius: 1,
                    backgroundColor: colors.neutral.gray200,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        percentileRank >= 75
                          ? colors.success.main
                          : percentileRank >= 50
                          ? colors.warning.main
                          : colors.error.main,
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              <Paper
                sx={{
                  p: 2,
                  backgroundColor: colors.success.main + '10',
                  borderRadius: 1,
                  border: `1px solid ${colors.success.main}30`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: colors.success.main,
                    textAlign: 'center',
                  }}
                >
                  {getPercentileLabel(percentileRank)}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Yield Comparison */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: `1px solid ${colors.neutral.gray200}`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Home sx={{ color: colors.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Yield Comparison
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.neutral.gray700 }}>
                    This Property
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.accent.main }}>
                    {propertyYield}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(propertyYield / 10) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: colors.neutral.gray200,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.accent.main,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.neutral.gray700 }}>
                    Market Average
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.neutral.gray700 }}>
                    4.8%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={48}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: colors.neutral.gray200,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.primary.main,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.neutral.gray700 }}>
                    Top 10% Average
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.neutral.gray700 }}>
                    7.5%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: colors.neutral.gray200,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.success.main,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Comparable Properties */}
        {comparableProperties.length > 0 && (
          <Grid size={12}>
            <Card
              sx={{
                border: `1px solid ${colors.neutral.gray200}`,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Similar Deals
                </Typography>
                <Grid container spacing={2}>
                  {comparableProperties.slice(0, 3).map((property) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
                      <PropertyCard property={property} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

