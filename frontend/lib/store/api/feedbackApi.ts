import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface FeedbackSubmission {
  rating: number;
  comment?: string;
  page_url?: string;
}

export interface Feedback extends FeedbackSubmission {
  id: number;
  created_at: string;
}

export interface SupportMessageSubmission {
  email: string;
  subject?: string;
  message: string;
  page_url?: string;
}

export interface SupportMessage extends SupportMessageSubmission {
  id: number;
  status: string;
  created_at: string;
}

export interface ContactRequestSubmission {
  property: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactRequest extends ContactRequestSubmission {
  id: number;
  created_at: string;
}

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Feedback', 'Support', 'Contact'],
  endpoints: (builder) => ({
    // Feedback endpoints
    submitFeedback: builder.mutation<Feedback, FeedbackSubmission>({
      query: (feedback) => ({
        url: '/feedback/',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: ['Feedback'],
    }),
    getFeedback: builder.query<Feedback[], void>({
      query: () => '/feedback/',
      providesTags: ['Feedback'],
    }),

    // Support message endpoints
    submitSupportMessage: builder.mutation<SupportMessage, SupportMessageSubmission>({
      query: (message) => ({
        url: '/support/',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Support'],
    }),
    getSupportMessages: builder.query<SupportMessage[], void>({
      query: () => '/support/',
      providesTags: ['Support'],
    }),

    // Contact request endpoints
    submitContactRequest: builder.mutation<ContactRequest, ContactRequestSubmission>({
      query: (request) => ({
        url: '/contact/',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Contact'],
    }),
    getContactRequests: builder.query<ContactRequest[], void>({
      query: () => '/contact/',
      providesTags: ['Contact'],
    }),
  }),
});

export const {
  useSubmitFeedbackMutation,
  useGetFeedbackQuery,
  useSubmitSupportMessageMutation,
  useGetSupportMessagesQuery,
  useSubmitContactRequestMutation,
  useGetContactRequestsQuery,
} = feedbackApi;

