import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ContactRequestSubmission {
  property: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactRequest extends ContactRequestSubmission {
  id: number;
  property_address: string;
  contacted: boolean;
  created_at: string;
}

export const contactApi = createApi({
  reducerPath: 'contactApi',
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
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    // Submit a contact request for a property
    submitContactRequest: builder.mutation<ContactRequest, ContactRequestSubmission>({
      query: (request) => ({
        url: '/contact/',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Contact'],
    }),

    // Get user's contact requests
    getContactRequests: builder.query<ContactRequest[], void>({
      query: () => '/contact/',
      providesTags: ['Contact'],
    }),

    // Get a specific contact request
    getContactRequest: builder.query<ContactRequest, number>({
      query: (id) => `/contact/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Contact', id }],
    }),
  }),
});

export const {
  useSubmitContactRequestMutation,
  useGetContactRequestsQuery,
  useGetContactRequestQuery,
} = contactApi;

