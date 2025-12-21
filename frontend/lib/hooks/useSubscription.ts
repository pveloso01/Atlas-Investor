import { useGetCurrentSubscriptionQuery } from '@/lib/store/api/subscriptionApi';
import type { Subscription } from '@/lib/store/api/subscriptionApi';

export function useSubscription() {
  const { data, isLoading, error, refetch } = useGetCurrentSubscriptionQuery();

  const subscription: Subscription | null = 
    data && 'id' in data ? data : null;

  const hasActiveSubscription = subscription?.is_active ?? false;
  const isTrialing = subscription?.is_trialing ?? false;
  const tierSlug = subscription?.tier.slug ?? 'free';
  const tierName = subscription?.tier.name ?? 'Free';
  const daysRemaining = subscription?.days_remaining ?? 0;
  const willCancelAtPeriodEnd = subscription?.cancel_at_period_end ?? false;

  return {
    subscription,
    hasActiveSubscription,
    isTrialing,
    tierSlug,
    tierName,
    daysRemaining,
    willCancelAtPeriodEnd,
    isLoading,
    error,
    refetch,
  };
}

