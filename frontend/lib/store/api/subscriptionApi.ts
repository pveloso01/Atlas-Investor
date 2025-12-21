import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SubscriptionTier {
  id: number;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  features: Record<string, any>;
  features_list: string[];
  is_active: boolean;
  display_order: number;
}

export interface Subscription {
  id: number;
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'cancelled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_ends_at?: string;
  is_active: boolean;
  is_trialing: boolean;
  days_remaining: number;
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  created_at: string;
  is_successful: boolean;
}

export interface Usage {
  id: number;
  feature_name: string;
  feature_slug: string;
  count: number;
  period_start: string;
  period_end: string;
  is_within_limit: boolean;
}

export interface CreateCheckoutRequest {
  tier_slug: string;
  billing_period: 'monthly' | 'yearly';
}

export interface CreateCheckoutResponse {
  checkout_url: string;
}

export interface CreatePortalResponse {
  portal_url: string;
}

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Subscription', 'Tier', 'Payment', 'Usage'],
  endpoints: (builder) => ({
    // Get subscription tiers
    getTiers: builder.query<SubscriptionTier[], void>({
      query: () => '/api/subscriptions/tiers/',
      providesTags: ['Tier'],
    }),

    // Get current subscription
    getCurrentSubscription: builder.query<Subscription | { message: string }, void>({
      query: () => '/api/subscriptions/current/',
      providesTags: ['Subscription'],
    }),

    // Create checkout session
    createCheckoutSession: builder.mutation<CreateCheckoutResponse, CreateCheckoutRequest>({
      query: (data) => ({
        url: '/api/subscriptions/create-checkout/',
        method: 'POST',
        body: data,
      }),
    }),

    // Create portal session
    createPortalSession: builder.mutation<CreatePortalResponse, void>({
      query: () => ({
        url: '/api/subscriptions/create-portal/',
        method: 'POST',
      }),
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/api/subscriptions/cancel/',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Resume subscription
    resumeSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/api/subscriptions/resume/',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Get payment history
    getSubscriptionHistory: builder.query<Payment[], void>({
      query: () => '/api/subscriptions/history/',
      providesTags: ['Payment'],
    }),

    // Get usage
    getUsage: builder.query<Usage[], { feature?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.feature) {
          searchParams.append('feature', params.feature);
        }
        const query = searchParams.toString();
        return `/api/subscriptions/usage/${query ? `?${query}` : ''}`;
      },
      providesTags: ['Usage'],
    }),
  }),
});

export const {
  useGetTiersQuery,
  useGetCurrentSubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
  useGetSubscriptionHistoryQuery,
  useGetUsageQuery,
} = subscriptionApi;

