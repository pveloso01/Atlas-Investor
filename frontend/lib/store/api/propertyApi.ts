import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Property } from '@/types/property';

export interface PropertyListParams {
  page?: number;
  page_size?: number;
  property_type?: string;
  region?: number;
  search?: string;
  ordering?: string;
  min_price?: number;
  max_price?: number;
}

export interface PropertyListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Property[];
}

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Property'],
  endpoints: (builder) => ({
    getProperties: builder.query<PropertyListResponse, PropertyListParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.page_size) searchParams.append('page_size', params.page_size.toString());
        if (params.property_type) searchParams.append('property_type', params.property_type);
        if (params.region) searchParams.append('region', params.region.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.ordering) searchParams.append('ordering', params.ordering);
        if (params.min_price) searchParams.append('price__gte', params.min_price.toString());
        if (params.max_price) searchParams.append('price__lte', params.max_price.toString());
        
        const queryString = searchParams.toString();
        return queryString ? `properties/?${queryString}` : 'properties/';
      },
      providesTags: ['Property'],
    }),
    getProperty: builder.query<Property, number>({
      query: (id) => `properties/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
  }),
});

export const { useGetPropertiesQuery, useGetPropertyQuery } = propertyApi;


