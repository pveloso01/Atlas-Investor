import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface AnalysisAssumptions {
  strategy?: 'rental' | 'flip' | 'development';
  monthly_rent?: number;
  annual_expenses?: number;
  vacancy_rate?: number;
  down_payment_percent?: number;
  interest_rate?: number;
  loan_term_years?: number;
  renovation_cost?: number;
}

export interface AnalysisResult {
  property_id: number;
  strategy: string;
  assumptions: {
    monthly_rent: number;
    annual_expenses: number;
    vacancy_rate: number;
    down_payment_percent: number;
    interest_rate: number;
    loan_term_years: number;
  };
  metrics: {
    gross_yield: number;
    net_yield: number;
    monthly_cash_flow: number;
    annual_cash_flow: number;
    payback_years: number;
    cap_rate: number;
    cash_on_cash_return: number;
  };
  financing?: {
    down_payment: number;
    loan_amount: number;
    monthly_mortgage: number;
    total_monthly_expenses: number;
  };
}

export const analysisApi = createApi({
  reducerPath: 'analysisApi',
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
  tagTypes: ['Analysis'],
  endpoints: (builder) => ({
    analyzeProperty: builder.mutation<AnalysisResult, { propertyId: number; assumptions: AnalysisAssumptions }>({
      query: ({ propertyId, assumptions }) => ({
        url: `/properties/${propertyId}/analyze/`,
        method: 'POST',
        body: assumptions,
      }),
      invalidatesTags: (_result, _error, { propertyId }) => [{ type: 'Analysis', id: propertyId }],
    }),
  }),
});

export const { useAnalyzePropertyMutation } = analysisApi;

