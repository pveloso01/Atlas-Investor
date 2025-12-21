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
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Stack,
  alpha,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
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

  // Enhanced feature list with more valuable features
  const featureCategories = [
    {
      category: 'Property Discovery',
      features: [
        { name: 'Property Searches', free: '5/month', basic: '50/month', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Advanced Filters', free: false, basic: true, pro: true, enterprise: true },
        { name: 'Saved Searches', free: false, basic: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Automated Deal Alerts', free: false, basic: false, pro: true, enterprise: true },
        { name: 'Market Trend Analysis', free: false, basic: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Analysis & Reports',
      features: [
        { name: 'ROI Calculator', free: 'Basic', basic: 'Advanced', pro: 'Advanced + Scenarios', enterprise: 'Advanced + Scenarios' },
        { name: 'PDF Reports', free: 'View only', basic: '3/month', pro: 'Unlimited', enterprise: 'Unlimited + White-label' },
        { name: 'Property Comparison', free: false, basic: '2 properties', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Bulk Property Analysis', free: false, basic: false, pro: 'Up to 50', enterprise: 'Unlimited' },
        { name: 'Custom Report Templates', free: false, basic: false, pro: true, enterprise: true },
        { name: 'Property Valuation Estimates', free: false, basic: false, pro: true, enterprise: true },
        { name: 'Investment Recommendations', free: false, basic: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Portfolio Management',
      features: [
        { name: 'Portfolio Tracking', free: '1 property', basic: '10 properties', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Portfolio Analytics', free: false, basic: 'Basic', pro: 'Advanced', enterprise: 'Advanced + AI Insights' },
        { name: 'Performance Tracking', free: false, basic: true, pro: true, enterprise: true },
        { name: 'Tax Optimization Insights', free: false, basic: false, pro: true, enterprise: true },
        { name: 'Risk Assessment', free: false, basic: false, pro: true, enterprise: true },
        { name: 'Portfolio Optimization', free: false, basic: false, pro: false, enterprise: true },
      ],
    },
    {
      category: 'Data & Export',
      features: [
        { name: 'Data Export (CSV/Excel)', free: false, basic: 'Limited', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'API Access', free: false, basic: false, pro: 'Read-only', enterprise: 'Full Access' },
        { name: 'Historical Data Access', free: false, basic: '3 months', pro: '2 years', enterprise: 'Unlimited' },
        { name: 'Neighborhood Analytics', free: false, basic: false, pro: true, enterprise: true },
        { name: 'Market Insights Dashboard', free: false, basic: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Support & Features',
      features: [
        { name: 'Email Support', free: false, basic: 'Standard (48h)', pro: 'Priority (24h)', enterprise: 'Dedicated (4h)' },
        { name: 'Phone Support', free: false, basic: false, pro: false, enterprise: true },
        { name: 'Onboarding Assistance', free: false, basic: false, pro: true, enterprise: true },
        { name: 'Custom Integrations', free: false, basic: false, pro: false, enterprise: true },
        { name: 'SLA Guarantees', free: false, basic: false, pro: false, enterprise: true },
        { name: 'Team Collaboration', free: false, basic: false, pro: false, enterprise: true },
      ],
    },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography>Loading pricing...</Typography>
      </Container>
    );
  }

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

  const getTierGradient = (slug: string) => {
    switch (slug) {
      case 'free':
        return `linear-gradient(135deg, ${colors.neutral.gray50} 0%, ${colors.neutral.gray100} 100%)`;
      case 'basic':
        return `linear-gradient(135deg, ${alpha(colors.primary.main, 0.1)} 0%, ${alpha(colors.primary.main, 0.05)} 100%)`;
      case 'pro':
        return `linear-gradient(135deg, ${alpha(colors.accent.main, 0.15)} 0%, ${alpha(colors.accent.main, 0.05)} 100%)`;
      case 'enterprise':
        return `linear-gradient(135deg, ${alpha(colors.warning.main, 0.15)} 0%, ${alpha(colors.warning.main, 0.05)} 100%)`;
      default:
        return 'transparent';
    }
  };

  return (
    <Box sx={{ bgcolor: colors.neutral.gray50, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            icon={<StarIcon />}
            label="Choose the Right Plan"
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
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" sx={{ color: colors.neutral.gray600, mb: 4, maxWidth: 600, mx: 'auto' }}>
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

        {/* Pricing Cards */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {tiers?.map((tier) => {
            const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
            const isCurrentTier = tierSlug === tier.slug;
            const isEnterprise = tier.slug === 'enterprise';
            const isPro = tier.slug === 'pro';
            const tierColor = getTierColor(tier.slug);
            const tierGradient = getTierGradient(tier.slug);

            return (
              <Grid size={{ xs: 12, md: 6, lg: 3 }} key={tier.id}>
                <Card
                  elevation={isPro ? 8 : 2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: isPro
                      ? `3px solid ${tierColor}`
                      : isCurrentTier
                      ? `2px solid ${tierColor}`
                      : `1px solid ${colors.neutral.gray200}`,
                    borderRadius: 4,
                    overflow: 'visible',
                    background: tierGradient,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isPro ? 12 : 6,
                    },
                  }}
                >
                  {isPro && (
                    <Chip
                      icon={<StarIcon />}
                      label="Most Popular"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: tierColor,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 28,
                        zIndex: 1,
                      }}
                    />
                  )}
                  {isCurrentTier && !isPro && (
                    <Chip
                      label="Current Plan"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: alpha(tierColor, 0.1),
                        color: tierColor,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Tier Name */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          mb: 1,
                          color: tierColor,
                        }}
                      >
                        {tier.name}
                      </Typography>
                      {tier.slug === 'free' && (
                        <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                          Perfect for getting started
                        </Typography>
                      )}
                      {tier.slug === 'basic' && (
                        <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                          For individual investors
                        </Typography>
                      )}
                      {tier.slug === 'pro' && (
                        <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                          For serious investors
                        </Typography>
                      )}
                      {tier.slug === 'enterprise' && (
                        <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                          For teams and agencies
                        </Typography>
                      )}
                    </Box>

                    {/* Price */}
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                        <Typography
                          variant="h2"
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
                          variant="h6"
                          component="span"
                          sx={{
                            color: colors.neutral.gray600,
                            ml: 1,
                            fontWeight: 500,
                          }}
                        >
                          /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                        </Typography>
                      </Box>
                      {billingPeriod === 'yearly' && price > 0 && (
                        <Typography variant="body2" sx={{ color: colors.success.main, fontWeight: 600 }}>
                          Save €{((tier.price_monthly * 12 - price) / 12).toFixed(0)}/month
                        </Typography>
                      )}
                    </Box>

                    {/* Key Features */}
                    <List sx={{ flexGrow: 1, mb: 3, p: 0 }}>
                      {tier.features_list?.slice(0, 6).map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon
                              sx={{
                                color: tierColor,
                                fontSize: 20,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { fontWeight: 500 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA Button */}
                    {isEnterprise ? (
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        onClick={() => router.push('/contact')}
                        sx={{
                          mt: 'auto',
                          borderColor: tierColor,
                          color: tierColor,
                          fontWeight: 700,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: tierColor,
                            backgroundColor: alpha(tierColor, 0.1),
                          },
                        }}
                      >
                        Contact Sales
                      </Button>
                    ) : (
                      <Button
                        variant={isCurrentTier ? 'outlined' : 'contained'}
                        fullWidth
                        size="large"
                        onClick={() => handleSubscribe(tier.slug)}
                        disabled={isCurrentTier || isCreatingCheckout}
                        sx={{
                          mt: 'auto',
                          backgroundColor: isCurrentTier ? 'transparent' : tierColor,
                          color: isCurrentTier ? tierColor : 'white',
                          borderColor: tierColor,
                          fontWeight: 700,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: isCurrentTier ? 'none' : `0 4px 12px ${alpha(tierColor, 0.3)}`,
                          '&:hover': {
                            backgroundColor: isCurrentTier ? alpha(tierColor, 0.1) : tierColor,
                            boxShadow: isCurrentTier ? 'none' : `0 6px 16px ${alpha(tierColor, 0.4)}`,
                          },
                          '&:disabled': {
                            backgroundColor: colors.neutral.gray200,
                            color: colors.neutral.gray500,
                          },
                        }}
                      >
                        {isCurrentTier ? 'Current Plan' : isCreatingCheckout ? 'Processing...' : 'Get Started'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Feature Comparison */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              textAlign: 'center',
            }}
          >
            Compare Plans
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray600, mb: 6, textAlign: 'center' }}>
            See what's included in each plan
          </Typography>

          {featureCategories.map((category, catIdx) => (
            <Box key={catIdx} sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: colors.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {category.category === 'Property Discovery' && <TrendingUpIcon />}
                {category.category === 'Analysis & Reports' && <AnalyticsIcon />}
                {category.category === 'Portfolio Management' && <SpeedIcon />}
                {category.category === 'Data & Export' && <SecurityIcon />}
                {category.category === 'Support & Features' && <SupportIcon />}
                {category.category}
              </Typography>

              <Grid container spacing={2}>
                {category.features.map((feature, featIdx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={featIdx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        border: `1px solid ${colors.neutral.gray200}`,
                        borderRadius: 2,
                        height: '100%',
                        backgroundColor: 'white',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        {feature.name}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: colors.neutral.gray500, display: 'block' }}>
                            Free
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {typeof feature.free === 'boolean'
                              ? feature.free
                                ? '✓'
                                : '✗'
                              : feature.free}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: colors.neutral.gray500, display: 'block' }}>
                            Basic
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {typeof feature.basic === 'boolean'
                              ? feature.basic
                                ? '✓'
                                : '✗'
                              : feature.basic}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: colors.neutral.gray500, display: 'block' }}>
                            Pro
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {typeof feature.pro === 'boolean'
                              ? feature.pro
                                ? '✓'
                                : '✗'
                              : feature.pro}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: colors.neutral.gray500, display: 'block' }}>
                            Enterprise
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {typeof feature.enterprise === 'boolean'
                              ? feature.enterprise
                                ? '✓'
                                : '✗'
                              : feature.enterprise}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>

        {/* FAQ or Additional Info */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            backgroundColor: alpha(colors.primary.main, 0.05),
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray600, mb: 3 }}>
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
      </Container>
    </Box>
  );
}
