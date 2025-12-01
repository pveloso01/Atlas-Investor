'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { colors } from '@/lib/theme/colors';

interface PropertyChartsProps {
  propertyYield?: number;
  marketAverageYield?: number;
}


export default function PropertyCharts({
  propertyYield = 5.2,
  marketAverageYield = 4.8,
}: PropertyChartsProps) {
  // Cash flow over time data
  const cashFlowData = [
    { year: 'Year 1', cashFlow: 800, cumulative: 9600 },
    { year: 'Year 2', cashFlow: 850, cumulative: 19800 },
    { year: 'Year 3', cashFlow: 900, cumulative: 30600 },
    { year: 'Year 4', cashFlow: 950, cumulative: 42000 },
    { year: 'Year 5', cashFlow: 1000, cumulative: 54000 },
  ];

  // Returns breakdown
  const returnsData = [
    { name: 'Rental Income', value: 60, color: colors.primary.main },
    { name: 'Appreciation', value: 25, color: colors.success.main },
    { name: 'Tax Benefits', value: 10, color: colors.info.main },
    { name: 'Equity Build', value: 5, color: colors.warning.main },
  ];

  // Market comparison
  const marketComparisonData = [
    { name: 'This Property', yield: propertyYield },
    { name: 'City Average', yield: marketAverageYield },
    { name: 'Top 10%', yield: 7.5 },
    { name: 'Bottom 10%', yield: 3.2 },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, mb: 3, color: colors.neutral.gray900 }}
      >
        Financial Projections
      </Typography>

      <Grid container spacing={3}>
        {/* Cash Flow Over Time */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: `1px solid ${colors.neutral.gray200}`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Cash Flow Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral.gray300} />
                  <XAxis dataKey="year" stroke={colors.neutral.gray600} />
                  <YAxis stroke={colors.neutral.gray600} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.neutral.white,
                      border: `1px solid ${colors.neutral.gray200}`,
                      borderRadius: 2,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cashFlow"
                    stroke={colors.primary.main}
                    strokeWidth={2}
                    name="Monthly Cash Flow"
                    dot={{ fill: colors.primary.main, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke={colors.success.main}
                    strokeWidth={2}
                    name="Cumulative"
                    dot={{ fill: colors.success.main, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Returns Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              border: `1px solid ${colors.neutral.gray200}`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Returns Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={returnsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {returnsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Market Comparison */}
        <Grid size={12}>
          <Card
            sx={{
              border: `1px solid ${colors.neutral.gray200}`,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Market Comparison - Rental Yield
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marketComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral.gray300} />
                  <XAxis dataKey="name" stroke={colors.neutral.gray600} />
                  <YAxis stroke={colors.neutral.gray600} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.neutral.white,
                      border: `1px solid ${colors.neutral.gray200}`,
                      borderRadius: 2,
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Bar
                    dataKey="yield"
                    fill={colors.primary.main}
                    radius={[8, 8, 0, 0]}
                  >
                    {marketComparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === 'This Property'
                            ? colors.accent.main
                            : entry.name === 'City Average'
                            ? colors.primary.main
                            : colors.neutral.gray400
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                  This property&apos;s yield is{' '}
                  <strong style={{ color: colors.accent.main }}>
                    {((propertyYield / marketAverageYield - 1) * 100).toFixed(1)}%
                  </strong>{' '}
                  {propertyYield > marketAverageYield ? 'above' : 'below'} the city average
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

