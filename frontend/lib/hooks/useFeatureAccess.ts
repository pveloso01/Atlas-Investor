import { useGetUsageQuery } from '@/lib/store/api/subscriptionApi';
import { useSubscription } from './useSubscription';

export function useFeatureAccess(featureSlug: string) {
  const { subscription, tierSlug } = useSubscription();
  const { data: usageData, isLoading: usageLoading } = useGetUsageQuery(
    { feature: featureSlug },
    { skip: !featureSlug }
  );

  // Get usage for this specific feature
  const usage = usageData?.find((u) => u.feature_slug === featureSlug);
  const usageCount = usage?.count ?? 0;
  const usageLimit = usage ? (usage.is_within_limit ? undefined : usage.count) : undefined;
  const isWithinLimit = usage?.is_within_limit ?? true;

  // Determine access based on tier (simplified logic - backend handles actual checks)
  // Free tier has limited access, Basic/Pro/Enterprise have more
  const hasAccess = (() => {
    if (!subscription) {
      // Free tier - check if feature is available for free
      return featureSlug === 'property_search' || featureSlug === 'basic_roi';
    }

    // For paid tiers, assume access unless backend says otherwise
    // Backend will enforce actual limits
    return tierSlug !== 'free';
  })();

  return {
    hasAccess,
    usageCount,
    usageLimit,
    isWithinLimit,
    isLoading: usageLoading,
    subscription,
    tierSlug,
  };
}

