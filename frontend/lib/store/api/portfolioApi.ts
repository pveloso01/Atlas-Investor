import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface PortfolioProperty {
  id: number;
  property_id: number;
  property_address: string;
  property_price: string;
  property_type: string;
  size_sqm: string;
  bedrooms: number | null;
  region_name: string | null;
  notes: string;
  target_price: string | null;
  price_difference: {
    amount: number;
    percentage: number;
    is_below_target: boolean;
  } | null;
  added_at: string;
}

export interface Portfolio {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  property_count: number;
  total_value: number;
  average_price: number | null;
  properties?: PortfolioProperty[];
  created_at: string;
  updated_at: string;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  is_default?: boolean;
}

export interface UpdatePortfolioRequest {
  id: number;
  name?: string;
  description?: string;
  is_default?: boolean;
}

export interface AddPropertyRequest {
  portfolioId: number;
  property_id: number;
  notes?: string;
  target_price?: number;
}

export interface RemovePropertyRequest {
  portfolioId: number;
  property_id: number;
}

export interface UpdatePropertyRequest {
  portfolioId: number;
  property_id: number;
  notes?: string;
  target_price?: number | null;
}

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
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
  tagTypes: ['Portfolio', 'PortfolioList'],
  endpoints: (builder) => ({
    // Get all user portfolios
    getPortfolios: builder.query<Portfolio[], void>({
      query: () => '/portfolios/',
      transformResponse: (response: { results: Portfolio[] }) => response.results,
      providesTags: ['PortfolioList'],
    }),

    // Get single portfolio with properties
    getPortfolio: builder.query<Portfolio, number>({
      query: (id) => `/portfolios/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Portfolio', id }],
    }),

    // Get default portfolio
    getDefaultPortfolio: builder.query<Portfolio, void>({
      query: () => '/portfolios/default/',
      providesTags: [{ type: 'Portfolio', id: 'default' }],
    }),

    // Create new portfolio
    createPortfolio: builder.mutation<Portfolio, CreatePortfolioRequest>({
      query: (data) => ({
        url: '/portfolios/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PortfolioList'],
    }),

    // Update portfolio
    updatePortfolio: builder.mutation<Portfolio, UpdatePortfolioRequest>({
      query: ({ id, ...data }) => ({
        url: `/portfolios/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Portfolio', id },
        'PortfolioList',
      ],
    }),

    // Delete portfolio
    deletePortfolio: builder.mutation<void, number>({
      query: (id) => ({
        url: `/portfolios/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PortfolioList'],
    }),

    // Add property to portfolio
    addPropertyToPortfolio: builder.mutation<PortfolioProperty, AddPropertyRequest>({
      query: ({ portfolioId, ...data }) => ({
        url: `/portfolios/${portfolioId}/add_property/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { portfolioId }) => [
        { type: 'Portfolio', id: portfolioId },
        { type: 'Portfolio', id: 'default' },
        'PortfolioList',
      ],
    }),

    // Remove property from portfolio
    removePropertyFromPortfolio: builder.mutation<void, RemovePropertyRequest>({
      query: ({ portfolioId, property_id }) => ({
        url: `/portfolios/${portfolioId}/remove-property/`,
        method: 'POST',
        body: { property_id },
      }),
      invalidatesTags: (_result, _error, { portfolioId }) => [
        { type: 'Portfolio', id: portfolioId },
        { type: 'Portfolio', id: 'default' },
        'PortfolioList',
      ],
    }),

    // Update property in portfolio (notes/target price)
    updatePropertyInPortfolio: builder.mutation<PortfolioProperty, UpdatePropertyRequest>({
      query: ({ portfolioId, property_id, ...data }) => ({
        url: `/portfolios/${portfolioId}/update-property/${property_id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { portfolioId }) => [
        { type: 'Portfolio', id: portfolioId },
      ],
    }),
  }),
});

export const {
  useGetPortfoliosQuery,
  useGetPortfolioQuery,
  useGetDefaultPortfolioQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useAddPropertyToPortfolioMutation,
  useRemovePropertyFromPortfolioMutation,
  useUpdatePropertyInPortfolioMutation,
} = portfolioApi;

