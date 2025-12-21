'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useGetTiersQuery, useCreateCheckoutSessionMutation } from '@/lib/store/api/subscriptionApi';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { colors } from '@/lib/theme/colors';

export default function PricingPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  // Comprehensive feature list
  const features = [
    { category: 'Property Discovery', name: 'Property Searches', free: '5/month', basic: '50/month', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Property Discovery', name: 'Advanced Filters', free: false, basic: true, pro: true, enterprise: true },
    { category: 'Property Discovery', name: 'Saved Searches', free: false, basic: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Property Discovery', name: 'Automated Deal Alerts', free: false, basic: false, pro: true, enterprise: true },
    { category: 'Property Discovery', name: 'Market Trend Analysis', free: false, basic: false, pro: true, enterprise: true },
    
    { category: 'Analysis & Reports', name: 'ROI Calculator', free: 'Basic', basic: 'Advanced', pro: 'Advanced + Scenarios', enterprise: 'Advanced + Scenarios' },
    { category: 'Analysis & Reports', name: 'PDF Reports', free: 'View only', basic: '3/month', pro: 'Unlimited', enterprise: 'Unlimited + White-label' },
    { category: 'Analysis & Reports', name: 'Property Comparison', free: false, basic: '2 properties', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Analysis & Reports', name: 'Bulk Property Analysis', free: false, basic: false, pro: 'Up to 50', enterprise: 'Unlimited' },
    { category: 'Analysis & Reports', name: 'Custom Report Templates', free: false, basic: false, pro: true, enterprise: true },
    { category: 'Analysis & Reports', name: 'Property Valuation Estimates', free: false, basic: false, pro: true, enterprise: true },
    { category: 'Analysis & Reports', name: 'Investment Recommendations', free: false, basic: false, pro: true, enterprise: true },
    
    { category: 'Portfolio Management', name: 'Portfolio Tracking', free: '1 property', basic: '10 properties', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Portfolio Management', name: 'Portfolio Analytics', free: false, basic: 'Basic', pro: 'Advanced', enterprise: 'Advanced + AI Insights' },
    { category: 'Portfolio Management', name: 'Performance Tracking', free: false, basic: true, pro: true, enterprise: true },
    { category: 'Portfolio Management', name: 'Tax Optimization Insights', free: false, basic: false, pro: true, enterprise: true },
    { category: 'Portfolio Management', name: 'Risk Assessment', free: false, basic: false, pro: true, enterprise: true },
    { category: 'Portfolio Management', name: 'Portfolio Optimization', free: false, basic: false, pro: false, enterprise: true },
    
    { category: 'Data & Export', name: 'Data Export (CSV/Excel)', free: false, basic: 'Limited', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Data & Export', name: 'API Access', free: false, basic: false, pro: 'Read-only', enterprise: 'Full Access' },
    { category: 'Data & Export', name: 'Historical Data Access', free: false, basic: '3 months', pro: '2 years', enterprise: 'Unlimited' },
    { category: 'Data & Export', name: 'Neighborhood Analytics', free: false, basic: false, pro: true, enterprise: true },
    { category: 'Data & Export', name: 'Market Insights Dashboard', free: false, basic: false, pro: true, enterprise: true },
    
    { category: 'Support & Features', name: 'Email Support', free: false, basic: 'Standard (48h)', pro: 'Priority (24h)', enterprise: 'Dedicated (4h)' },
    { category: 'Support & Features', name: 'Phone Support', free: false, basic: false, pro: false, enterprise: true },
    { category: 'Support & Features', name: 'Onboarding Assistance', free: false, basic: false, pro: true, enterprise: true },
    { category: 'Support & Features', name: 'Custom Integrations', free: false, basic: false, pro: false, enterprise: true },
    { category: 'Support & Features', name: 'SLA Guarantees', free: false, basic: false, pro: false, enterprise: true },
    { category: 'Support & Features', name: 'Team Collaboration', free: false, basic: false, pro: false, enterprise: true },
  ];

  const getTierColor = (slug: string) => {
    switch (slug) {
      case 'free':
        return colors.neutral.gray400;
      case 'basic':
        return colors.primary.main;
      case 'pro':
        return colors.accent.main;
      case 'enterprise':
        return colors.warning.main;
      default:
        return colors.neutral.gray400;
    }
  };

  const renderFeatureValue = (value: string | boolean | false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon sx={{ color: colors.success.main, fontSize: 24 }} />
      ) : (
        <CloseIcon sx={{ color: colors.error.main, fontSize: 20, opacity: 0.3 }} />
      );
    }
    return (
      <Typography variant="body2" sx={{ fontWeight: 500, color: colors.neutral.gray700 }}>
        {value}
      </Typography>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography>Loading pricing...</Typography>
      </Container>
    );
  }

  // Sort tiers by display order
  const sortedTiers = tiers ? [...tiers].sort((a, b) => a.display_order - b.display_order) : [];

  return (
    <Box sx={{ bgcolor: colors.neutral.gray50, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<StarIcon />}
            label="Simple, Transparent Pricing"
            sx={{
              mb: 3,
              backgroundColor: alpha(colors.primary.main, 0.1),
              color: colors.primary.main,
              fontWeight: 600,
              fontSize: '0.875rem',
              height: 32,
            }}
          />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.accent.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography variant="h6" sx={{ color: colors.neutral.gray600, mb: 4, maxWidth: 700, mx: 'auto' }}>
            Everything you need to make smarter real estate investment decisions. Start free, upgrade as you grow.
          </Typography>

          {/* Billing Period Toggle */}
          <Paper
            elevation={0}
            sx={{
              p: 0.5,
              display: 'inline-flex',
              gap: 0.5,
              backgroundColor: colors.neutral.gray100,
              borderRadius: 3,
            }}
          >
            <Button
              variant={billingPeriod === 'monthly' ? 'contained' : 'text'}
              onClick={() => setBillingPeriod('monthly')}
              sx={{
                minWidth: 120,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                ...(billingPeriod === 'monthly' && {
                  backgroundColor: 'white',
                  color: colors.primary.main,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }),
              }}
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === 'yearly' ? 'contained' : 'text'}
              onClick={() => setBillingPeriod('yearly')}
              sx={{
                minWidth: 120,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                position: 'relative',
                ...(billingPeriod === 'yearly' && {
                  backgroundColor: 'white',
                  color: colors.primary.main,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }),
              }}
            >
              Yearly
              <Chip
                label="Save 20%"
                size="small"
                sx={{
                  ml: 1,
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: colors.success.main,
                  color: 'white',
                  fontWeight: 700,
                }}
              />
            </Button>
          </Paper>
        </Box>

        {/* Pricing Comparison Table */}
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: colors.neutral.gray100,
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colors.neutral.gray400,
              borderRadius: 4,
              '&:hover': {
                backgroundColor: colors.neutral.gray500,
              },
            },
          }}
        >
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${colors.neutral.gray200}`,
              minWidth: 800,
            }}
          >
            <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: colors.neutral.gray100,
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 3,
                    borderRight: `1px solid ${colors.neutral.gray200}`,
                    position: 'sticky',
                    left: 0,
                    zIndex: 10,
                    minWidth: 250,
                  }}
                >
                  Features
                </TableCell>
                {sortedTiers.map((tier) => {
                  const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
                  const isPro = tier.slug === 'pro';
                  const isCurrentTier = tierSlug === tier.slug;
                  const tierColor = getTierColor(tier.slug);

                  return (
                    <TableCell
                      key={tier.id}
                      align="center"
                      sx={{
                        backgroundColor: isPro
                          ? alpha(tierColor, 0.1)
                          : colors.neutral.gray50,
                        borderRight: tier.slug !== 'enterprise' ? `1px solid ${colors.neutral.gray200}` : 'none',
                        py: 3,
                        position: 'relative',
                        minWidth: 180,
                      }}
                    >
                      {isPro && (
                        <Chip
                          icon={<StarIcon />}
                          label="Most Popular"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: tierColor,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            height: 24,
                          }}
                        />
                      )}
                      <Box sx={{ mt: isPro ? 4 : 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            mb: 1,
                            color: tierColor,
                          }}
                        >
                          {tier.name}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="h3"
                            component="span"
                            sx={{
                              fontWeight: 900,
                              color: tierColor,
                              lineHeight: 1,
                            }}
                          >
                            €{price.toFixed(0)}
                          </Typography>
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              color: colors.neutral.gray600,
                              ml: 0.5,
                            }}
                          >
                            /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                          </Typography>
                        </Box>
                        {billingPeriod === 'yearly' && price > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.success.main,
                              fontWeight: 600,
                              display: 'block',
                              mb: 2,
                            }}
                          >
                            Save €{((tier.price_monthly * 12 - price) / 12).toFixed(0)}/month
                          </Typography>
                        )}
                        {tier.slug === 'enterprise' ? (
                          <Button
                            variant="outlined"
                            fullWidth
                            size="medium"
                            onClick={() => router.push('/contact')}
                            sx={{
                              borderColor: tierColor,
                              color: tierColor,
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: 2,
                              mt: 1,
                            }}
                          >
                            Contact Sales
                          </Button>
                        ) : (
                          <Button
                            variant={isCurrentTier ? 'outlined' : 'contained'}
                            fullWidth
                            size="medium"
                            onClick={() => handleSubscribe(tier.slug)}
                            disabled={isCurrentTier || isCreatingCheckout}
                            sx={{
                              backgroundColor: isCurrentTier ? 'transparent' : tierColor,
                              color: isCurrentTier ? tierColor : 'white',
                              borderColor: tierColor,
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: 2,
                              mt: 1,
                              boxShadow: isCurrentTier ? 'none' : `0 4px 12px ${alpha(tierColor, 0.3)}`,
                              '&:hover': {
                                backgroundColor: isCurrentTier ? alpha(tierColor, 0.1) : tierColor,
                                boxShadow: isCurrentTier ? 'none' : `0 6px 16px ${alpha(tierColor, 0.4)}`,
                              },
                              '&:disabled': {
                                backgroundColor: colors.neutral.gray200,
                                color: colors.neutral.gray500,
                                borderColor: colors.neutral.gray300,
                              },
                            }}
                          >
                            {isCurrentTier ? 'Current Plan' : isCreatingCheckout ? 'Processing...' : 'Get Started'}
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {features.map((feature, idx) => {
                const prevCategory = idx > 0 ? features[idx - 1].category : null;
                const showCategory = prevCategory !== feature.category;

                return (
                  <React.Fragment key={idx}>
                    {showCategory && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{
                            backgroundColor: alpha(colors.primary.main, 0.05),
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: colors.primary.main,
                            py: 2,
                            borderTop: idx > 0 ? `2px solid ${colors.neutral.gray200}` : 'none',
                          }}
                        >
                          {feature.category}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(colors.primary.main, 0.02),
                        },
                        '&:last-child td': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          borderRight: `1px solid ${colors.neutral.gray200}`,
                          position: 'sticky',
                          left: 0,
                          backgroundColor: 'white',
                          zIndex: 5,
                          minWidth: 250,
                        }}
                      >
                        {feature.name}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: `1px solid ${colors.neutral.gray200}`,
                          py: 2.5,
                        }}
                      >
                        {renderFeatureValue(feature.free)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: `1px solid ${colors.neutral.gray200}`,
                          py: 2.5,
                        }}
                      >
                        {renderFeatureValue(feature.basic)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: `1px solid ${colors.neutral.gray200}`,
                          py: 2.5,
                          backgroundColor: alpha(getTierColor('pro'), 0.03),
                        }}
                      >
                        {renderFeatureValue(feature.pro)}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        {renderFeatureValue(feature.enterprise)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>

        {/* Footer CTA */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: alpha(colors.primary.main, 0.05),
              borderRadius: 4,
              display: 'inline-block',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Still have questions?
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 3 }}>
              Our team is here to help you choose the right plan for your needs.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/contact')}
              sx={{
                borderColor: colors.primary.main,
                color: colors.primary.main,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Contact Us
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
