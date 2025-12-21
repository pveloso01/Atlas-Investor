'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useGetTiersQuery, useCreateCheckoutSessionMutation } from '@/lib/store/api/subscriptionApi';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { colors } from '@/lib/theme/colors';

export default function PricingPage() {
  const router = useRouter();
  const { data: tiers, isLoading } = useGetTiersQuery();
  const { subscription, tierSlug } = useSubscription();
  const [createCheckout, { isLoading: isCreatingCheckout }] = useCreateCheckoutSessionMutation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (tierSlug: string) => {
    try {
      const result = await createCheckout({
        tier_slug: tierSlug,
        billing_period: billingPeriod,
      }).unwrap();
      
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  const features = [
    { name: 'Property Searches', free: '10/month', basic: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'ROI Calculator', free: 'Basic', basic: 'Full', pro: 'Full', enterprise: 'Full' },
    { name: 'PDF Reports', free: 'View only', basic: '5/month', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Portfolio Tracking', free: '1 property', basic: '5 properties', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Advanced Analytics', free: false, basic: false, pro: true, enterprise: true },
    { name: 'API Access', free: false, basic: false, pro: true, enterprise: true },
    { name: 'Data Export', free: false, basic: false, pro: true, enterprise: true },
    { name: 'Support', free: 'Community', basic: 'Email', pro: 'Priority', enterprise: 'Dedicated' },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Loading pricing...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Choose Your Plan
      </Typography>
      <Typography variant="h6" sx={{ color: colors.neutral.gray600, mb: 4, textAlign: 'center' }}>
        Select the perfect plan for your real estate investment needs
      </Typography>

      {/* Billing Period Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper sx={{ p: 1, display: 'flex', gap: 1 }}>
          <Button
            variant={billingPeriod === 'monthly' ? 'contained' : 'outlined'}
            onClick={() => setBillingPeriod('monthly')}
            sx={{ minWidth: 100 }}
          >
            Monthly
          </Button>
          <Button
            variant={billingPeriod === 'yearly' ? 'contained' : 'outlined'}
            onClick={() => setBillingPeriod('yearly')}
            sx={{ minWidth: 100 }}
          >
            Yearly
            <Chip label="Save 17%" size="small" sx={{ ml: 1, height: 20 }} />
          </Button>
        </Paper>
      </Box>

      {/* Pricing Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {tiers?.map((tier) => {
          const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
          const isCurrentTier = tierSlug === tier.slug;
          const isEnterprise = tier.slug === 'enterprise';

          return (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={tier.id}>
              <Paper
                sx={{
                  p: 4,
                  border: `2px solid ${isCurrentTier ? colors.primary.main : colors.neutral.gray200}`,
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {isCurrentTier && (
                  <Chip
                    label="Current Plan"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                  />
                )}
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {tier.name}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" component="span" sx={{ fontWeight: 700 }}>
                    €{price.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ color: colors.neutral.gray600, ml: 1 }}>
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, mb: 3 }}>
                  {tier.features_list?.slice(0, 5).map((feature, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckIcon sx={{ color: colors.success.main, fontSize: 20, mr: 1 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                {isEnterprise ? (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => router.push('/contact')}
                    sx={{ mt: 'auto' }}
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Button
                    variant={isCurrentTier ? 'outlined' : 'contained'}
                    fullWidth
                    onClick={() => handleSubscribe(tier.slug)}
                    disabled={isCurrentTier || isCreatingCheckout}
                    sx={{ mt: 'auto' }}
                  >
                    {isCurrentTier ? 'Current Plan' : 'Subscribe'}
                  </Button>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Divider sx={{ my: 6 }} />

      {/* Feature Comparison Table */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
          Feature Comparison
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Feature</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Free</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Basic</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Pro</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Enterprise</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {features.map((feature, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 500 }}>{feature.name}</TableCell>
                  <TableCell align="center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <CheckIcon sx={{ color: colors.success.main }} />
                      ) : (
                        <CloseIcon sx={{ color: colors.error.main }} />
                      )
                    ) : (
                      feature.free
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {typeof feature.basic === 'boolean' ? (
                      feature.basic ? (
                        <CheckIcon sx={{ color: colors.success.main }} />
                      ) : (
                        <CloseIcon sx={{ color: colors.error.main }} />
                      )
                    ) : (
                      feature.basic
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <CheckIcon sx={{ color: colors.success.main }} />
                      ) : (
                        <CloseIcon sx={{ color: colors.error.main }} />
                      )
                    ) : (
                      feature.pro
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <CheckIcon sx={{ color: colors.success.main }} />
                      ) : (
                        <CloseIcon sx={{ color: colors.error.main }} />
                      )
                    ) : (
                      feature.enterprise
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

