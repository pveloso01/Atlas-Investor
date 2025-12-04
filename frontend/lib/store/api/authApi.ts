import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  re_password: string;
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
        url: '/auth/jwt/create/',
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
    register: builder.mutation<User, RegisterData>({
      query: (userData) => ({
        url: '/auth/users/',
        method: 'POST',
        body: userData,
      }),
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/users/me/',
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
    activateAccount: builder.mutation<void, ActivationRequest>({
      query: (data) => ({
        url: '/auth/users/activation/',
        method: 'POST',
        body: data,
      }),
    }),

    // Request password reset
    requestPasswordReset: builder.mutation<void, PasswordResetRequest>({
      query: (data) => ({
        url: '/auth/users/reset_password/',
        method: 'POST',
        body: data,
      }),
    }),

    // Confirm password reset
    confirmPasswordReset: builder.mutation<void, PasswordResetConfirm>({
      query: (data) => ({
        url: '/auth/users/reset_password_confirm/',
        method: 'POST',
        body: data,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<TokenResponse, { refresh: string }>({
      query: (data) => ({
        url: '/auth/jwt/refresh/',
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
} = authApi;

