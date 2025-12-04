'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Slider,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  CalendarMonth,
  Euro,
  Percent,
  Info,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { useAnalyzePropertyMutation } from '@/lib/store/api/analysisApi';
import { Property } from '@/types/property';

interface AnalysisPanelProps {
  property: Property;
}

interface Assumptions {
  monthlyRent: number;
  annualExpenses: number;
  vacancyRate: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
}

const defaultAssumptions: Assumptions = {
  monthlyRent: 1200,
  annualExpenses: 2000,
  vacancyRate: 5,
  downPaymentPercent: 20,
  interestRate: 4.5,
  loanTermYears: 30,
};

export default function AnalysisPanel({ property }: AnalysisPanelProps) {
  const [assumptions, setAssumptions] = useState<Assumptions>(() => ({
    ...defaultAssumptions,
    monthlyRent: property.region?.avg_rent
      ? Math.round(Number(property.region.avg_rent))
      : defaultAssumptions.monthlyRent,
  }));

  const [analyzeProperty, { data: analysisResult, isLoading, error }] =
    useAnalyzePropertyMutation();

  // Debounced analysis call
  const runAnalysis = useCallback(() => {
    analyzeProperty({
      propertyId: property.id,
      assumptions: {
        strategy: 'rental',
        monthly_rent: assumptions.monthlyRent,
        annual_expenses: assumptions.annualExpenses,
        vacancy_rate: assumptions.vacancyRate / 100,
        down_payment_percent: assumptions.downPaymentPercent / 100,
        interest_rate: assumptions.interestRate / 100,
        loan_term_years: assumptions.loanTermYears,
      },
    });
  }, [analyzeProperty, property.id, assumptions]);

  // Run analysis on mount and when assumptions change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      runAnalysis();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [runAnalysis]);

  const handleInputChange = (field: keyof Assumptions) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    setAssumptions((prev) => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (field: keyof Assumptions) => (
    _event: Event,
    value: number | number[]
  ) => {
    setAssumptions((prev) => ({ ...prev, [field]: value as number }));
  };

  const formatCurrency = (value: number) => {
    return `€${Math.round(value).toLocaleString('pt-PT')}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getYieldColor = (yieldValue: number) => {
    if (yieldValue >= 6) return colors.success.main;
    if (yieldValue >= 4) return colors.warning.main;
    return colors.error.main;
  };

  const getCashFlowColor = (cashFlow: number) => {
    if (cashFlow > 0) return colors.success.main;
    if (cashFlow === 0) return colors.warning.main;
    return colors.error.main;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TrendingUp sx={{ color: colors.primary.main }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Investment Analysis
        </Typography>
        {isLoading && <CircularProgress size={20} sx={{ ml: 'auto' }} />}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to calculate analysis. Please try again.
        </Alert>
      )}

      {/* Assumptions Section */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: colors.neutral.gray700 }}>
        Assumptions
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Rent */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Expected Monthly Rent"
            type="number"
            value={assumptions.monthlyRent}
            onChange={handleInputChange('monthlyRent')}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            size="small"
          />
        </Grid>

        {/* Annual Expenses */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Annual Expenses (maintenance, insurance, etc.)"
            type="number"
            value={assumptions.annualExpenses}
            onChange={handleInputChange('annualExpenses')}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            size="small"
          />
        </Grid>

        {/* Vacancy Rate */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Vacancy Rate: {assumptions.vacancyRate}%
          </Typography>
          <Slider
            value={assumptions.vacancyRate}
            onChange={handleSliderChange('vacancyRate')}
            min={0}
            max={20}
            step={1}
            marks={[
              { value: 0, label: '0%' },
              { value: 10, label: '10%' },
              { value: 20, label: '20%' },
            ]}
          />
        </Grid>

        {/* Down Payment */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Down Payment: {assumptions.downPaymentPercent}%
          </Typography>
          <Slider
            value={assumptions.downPaymentPercent}
            onChange={handleSliderChange('downPaymentPercent')}
            min={10}
            max={100}
            step={5}
            marks={[
              { value: 10, label: '10%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' },
            ]}
          />
        </Grid>

        {/* Interest Rate */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Interest Rate"
            type="number"
            value={assumptions.interestRate}
            onChange={handleInputChange('interestRate')}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            inputProps={{ step: 0.1, min: 0, max: 15 }}
            size="small"
          />
        </Grid>

        {/* Loan Term */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Loan Term"
            type="number"
            value={assumptions.loanTermYears}
            onChange={handleInputChange('loanTermYears')}
            InputProps={{
              endAdornment: <InputAdornment position="end">years</InputAdornment>,
            }}
            inputProps={{ min: 5, max: 40 }}
            size="small"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Results Section */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: colors.neutral.gray700 }}>
        Analysis Results
      </Typography>

      {analysisResult ? (
        <Grid container spacing={2}>
          {/* Gross Yield */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: colors.neutral.gray50,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <Percent fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                  Gross Yield
                </Typography>
                <Tooltip title="Annual rent divided by purchase price">
                  <Info fontSize="small" sx={{ color: colors.neutral.gray400, fontSize: 14 }} />
                </Tooltip>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: getYieldColor(analysisResult.metrics.gross_yield),
                }}
              >
                {formatPercent(analysisResult.metrics.gross_yield)}
              </Typography>
            </Paper>
          </Grid>

          {/* Net Yield */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: colors.neutral.gray50,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <Percent fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                  Net Yield
                </Typography>
                <Tooltip title="Annual rent minus expenses, divided by purchase price">
                  <Info fontSize="small" sx={{ color: colors.neutral.gray400, fontSize: 14 }} />
                </Tooltip>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: getYieldColor(analysisResult.metrics.net_yield),
                }}
              >
                {formatPercent(analysisResult.metrics.net_yield)}
              </Typography>
            </Paper>
          </Grid>

          {/* Monthly Cash Flow */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: colors.neutral.gray50,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <Euro fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                  Monthly Cash Flow
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: getCashFlowColor(analysisResult.metrics.monthly_cash_flow),
                }}
              >
                {formatCurrency(analysisResult.metrics.monthly_cash_flow)}
              </Typography>
            </Paper>
          </Grid>

          {/* Payback Period */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: colors.neutral.gray50,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <CalendarMonth fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                  Payback Period
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: colors.primary.main }}
              >
                {analysisResult.metrics.payback_years.toFixed(1)} yrs
              </Typography>
            </Paper>
          </Grid>

          {/* Additional Metrics */}
          {analysisResult.financing && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1, color: colors.neutral.gray700 }}>
                  Financing Details
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                      Down Payment
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(analysisResult.financing.down_payment)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                      Loan Amount
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(analysisResult.financing.loan_amount)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Euro fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                      Monthly Mortgage
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(analysisResult.financing.monthly_mortgage)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Percent fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                      Cash-on-Cash Return
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPercent(analysisResult.metrics.cash_on_cash_return)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </>
          )}

          {/* Investment Rating */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                Investment Rating:
              </Typography>
              <Chip
                label={
                  analysisResult.metrics.gross_yield >= 6
                    ? 'Excellent'
                    : analysisResult.metrics.gross_yield >= 5
                    ? 'Good'
                    : analysisResult.metrics.gross_yield >= 4
                    ? 'Fair'
                    : 'Below Average'
                }
                color={
                  analysisResult.metrics.gross_yield >= 6
                    ? 'success'
                    : analysisResult.metrics.gross_yield >= 4
                    ? 'warning'
                    : 'error'
                }
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2, color: colors.neutral.gray600 }}>
            Calculating analysis...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

