'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface ROICalculatorProps {
  propertyPrice: number;
  defaultRentalIncome?: number;
}

export default function ROICalculator({
  propertyPrice,
  defaultRentalIncome = 1200,
}: ROICalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // 80% LTV
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [rentalIncome, setRentalIncome] = useState(defaultRentalIncome);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [operatingExpenses, setOperatingExpenses] = useState(300);
  const [renovationCost, setRenovationCost] = useState(0);
  const [holdingPeriod, setHoldingPeriod] = useState(5);

  // Calculations
  const downPayment = propertyPrice - loanAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : 0;

  const effectiveRentalIncome = rentalIncome * (1 - vacancyRate / 100);
  const monthlyCashFlow = effectiveRentalIncome - monthlyPayment - operatingExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const totalInvestment = downPayment + renovationCost;
  const annualROI = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0;
  const totalReturn = annualCashFlow * holdingPeriod;
  const totalROI = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;

  return (
    <Card
      sx={{
        border: `1px solid ${colors.neutral.gray200}`,
        borderRadius: 2,
        mb: 4,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Interactive ROI Calculator
          </Typography>
          <InfoIcon sx={{ fontSize: 20, color: colors.neutral.gray500 }} />
        </Box>
        <Typography
          variant="body2"
          sx={{ color: colors.neutral.gray600, mb: 4 }}
        >
          Try Adjusting Assumptions - See how changes affect your returns in real-time
        </Typography>

        <Grid container spacing={4}>
          {/* Inputs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Financing
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Loan Amount: €{loanAmount.toLocaleString()}
              </Typography>
              <Slider
                value={loanAmount}
                onChange={(_, value) => setLoanAmount(value as number)}
                min={0}
                max={propertyPrice}
                step={10000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `€${value.toLocaleString()}`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Interest Rate: {interestRate}%
              </Typography>
              <Slider
                value={interestRate}
                onChange={(_, value) => setInterestRate(value as number)}
                min={1}
                max={8}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Loan Term: {loanTerm} years
              </Typography>
              <Slider
                value={loanTerm}
                onChange={(_, value) => setLoanTerm(value as number)}
                min={5}
                max={30}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} years`}
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, mt: 4 }}>
              Income & Expenses
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Monthly Rental Income: €{rentalIncome}
              </Typography>
              <Slider
                value={rentalIncome}
                onChange={(_, value) => setRentalIncome(value as number)}
                min={500}
                max={5000}
                step={50}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `€${value}`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Vacancy Rate: {vacancyRate}%
                <InfoIcon
                  sx={{ fontSize: 14, ml: 0.5, verticalAlign: 'middle', color: colors.neutral.gray500 }}
                  titleAccess="Percentage of time property may be vacant"
                />
              </Typography>
              <Slider
                value={vacancyRate}
                onChange={(_, value) => setVacancyRate(value as number)}
                min={0}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Monthly Operating Expenses: €{operatingExpenses}
              </Typography>
              <Slider
                value={operatingExpenses}
                onChange={(_, value) => setOperatingExpenses(value as number)}
                min={0}
                max={1000}
                step={25}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `€${value}`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Renovation Cost: €{renovationCost.toLocaleString()}
              </Typography>
              <Slider
                value={renovationCost}
                onChange={(_, value) => setRenovationCost(value as number)}
                min={0}
                max={100000}
                step={5000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `€${value.toLocaleString()}`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Holding Period: {holdingPeriod} years
              </Typography>
              <Slider
                value={holdingPeriod}
                onChange={(_, value) => setHoldingPeriod(value as number)}
                min={1}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} years`}
              />
            </Box>
          </Grid>

          {/* Results */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Projected Returns
            </Typography>

            <Paper
              sx={{
                p: 3,
                backgroundColor: colors.neutral.gray50,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                  Down Payment
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  €{downPayment.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                  Monthly Payment
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  €{monthlyPayment.toFixed(0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                  Monthly Cash Flow
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: monthlyCashFlow > 0 ? colors.success.main : colors.error.main,
                  }}
                >
                  €{monthlyCashFlow.toFixed(0)}
                </Typography>
              </Box>
            </Paper>

            <Paper
              sx={{
                p: 3,
                backgroundColor: colors.primary.main + '10',
                borderRadius: 2,
                border: `2px solid ${colors.primary.main}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: colors.neutral.gray700 }}>
                  Annual ROI
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: colors.primary.main,
                  }}
                >
                  {annualROI.toFixed(1)}%
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                  Total Return ({holdingPeriod} years)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  €{totalReturn.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                  Total ROI
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: totalROI > 0 ? colors.success.main : colors.error.main,
                  }}
                >
                  {totalROI.toFixed(1)}%
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

