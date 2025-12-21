'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Paper, Typography, Box, Button, Chip } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import type { SubscriptionTier } from '@/lib/store/api/subscriptionApi';
import { useCreateCheckoutSessionMutation } from '@/lib/store/api/subscriptionApi';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { colors } from '@/lib/theme/colors';

interface PricingCardProps {
  tier: SubscriptionTier;
  billingPeriod: 'monthly' | 'yearly';
}

export default function PricingCard({ tier, billingPeriod }: PricingCardProps) {
  const router = useRouter();
  const { tierSlug } = useSubscription();
  const [createCheckout, { isLoading }] = useCreateCheckoutSessionMutation();

  const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
  const isCurrentTier = tierSlug === tier.slug;
  const isEnterprise = tier.slug === 'enterprise';

  const handleSubscribe = async () => {
    if (isEnterprise) {
      router.push('/contact');
      return;
    }

    try {
      const result = await createCheckout({
        tier_slug: tier.slug,
        billing_period: billingPeriod,
      }).unwrap();

      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  return (
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
          onClick={handleSubscribe}
          sx={{ mt: 'auto' }}
        >
          Contact Sales
        </Button>
      ) : (
        <Button
          variant={isCurrentTier ? 'outlined' : 'contained'}
          fullWidth
          onClick={handleSubscribe}
          disabled={isCurrentTier || isLoading}
          sx={{ mt: 'auto' }}
        >
          {isCurrentTier ? 'Current Plan' : 'Subscribe'}
        </Button>
      )}
    </Paper>
  );
}

