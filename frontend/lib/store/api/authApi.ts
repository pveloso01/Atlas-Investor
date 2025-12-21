import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_retype: string;
  first_name?: string;
  last_name?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

export interface ActivationRequest {
  uid: string;
  token: string;
}

export interface ResendActivationRequest {
  email: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<TokenResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/api/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
          }
        } catch {
          // Handle error silently
        }
      },
    }),

    // Register
    register: builder.mutation<{ email: string; message: string }, RegisterData>({
      query: (userData) => ({
        url: '/api/auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => '/api/auth/me/',
      providesTags: ['User'],
    }),

    // Logout
    logout: builder.mutation<void, void>({
      queryFn: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
        return { data: undefined };
      },
      invalidatesTags: ['User'],
    }),

    // Activate account
    activateAccount: builder.mutation<{ message: string }, ActivationRequest>({
      query: (data) => ({
        url: '/api/auth/activate/',
        method: 'POST',
        body: data,
      }),
    }),

    // Request password reset
    requestPasswordReset: builder.mutation<{ message: string }, PasswordResetRequest>({
      query: (data) => ({
        url: '/api/auth/password-reset/',
        method: 'POST',
        body: data,
      }),
    }),

    // Confirm password reset
    confirmPasswordReset: builder.mutation<{ message: string }, PasswordResetConfirm>({
      query: (data) => ({
        url: '/api/auth/password-reset/confirm/',
        method: 'POST',
        body: data,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<TokenResponse, { refresh: string }>({
      query: (data) => ({
        url: '/api/auth/refresh/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', data.access);
          }
        } catch {
          // Handle error silently
        }
      },
    }),

    // Resend activation email
    resendActivation: builder.mutation<{ message: string }, ResendActivationRequest>({
      query: (data) => ({
        url: '/api/auth/resend-activation/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useActivateAccountMutation,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
  useRefreshTokenMutation,
  useResendActivationMutation,
} = authApi;

