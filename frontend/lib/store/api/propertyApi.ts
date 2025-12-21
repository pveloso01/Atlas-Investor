import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Property } from '@/types/property';

export interface PropertyListParams {
  page?: number;
  page_size?: number;
  property_type?: string | string[];
  region?: number | number[];
  search?: string;
  ordering?: string;
  // Price range
  min_price?: number;
  max_price?: number;
  // Size range
  min_size?: number;
  max_size?: number;
  // Bedrooms range
  min_bedrooms?: number;
  max_bedrooms?: number;
  // Bathrooms range
  min_bathrooms?: number;
  max_bathrooms?: number;
  // Year built range
  min_year_built?: number;
  max_year_built?: number;
  // Condition - supports multiple
  condition?: string | string[];
  // Energy rating - supports multiple
  energy_rating?: string | string[];
  // Features
  has_elevator?: boolean;
  has_balcony?: boolean;
  has_terrace?: boolean;
  min_parking_spaces?: number;
  // Listing status - supports multiple
  listing_status?: string | string[];
  // Geographic filters (for address-based matching)
  district?: string | string[];
  municipality?: string | string[];
  parish?: string | string[];
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
        
        // Pagination
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.page_size) searchParams.append('page_size', params.page_size.toString());
        
        // Basic filters - handle arrays for multiselect
        if (params.property_type) {
          if (Array.isArray(params.property_type)) {
            params.property_type.forEach((type) => searchParams.append('property_type', type));
          } else {
            searchParams.append('property_type', params.property_type);
          }
        }
        if (params.region) {
          if (Array.isArray(params.region)) {
            params.region.forEach((reg) => searchParams.append('region', reg.toString()));
          } else {
            searchParams.append('region', params.region.toString());
          }
        }
        if (params.search) searchParams.append('search', params.search);
        if (params.ordering) searchParams.append('ordering', params.ordering);
        
        // Price range
        if (params.min_price) searchParams.append('price__gte', params.min_price.toString());
        if (params.max_price) searchParams.append('price__lte', params.max_price.toString());
        
        // Size range
        if (params.min_size) searchParams.append('size_sqm__gte', params.min_size.toString());
        if (params.max_size) searchParams.append('size_sqm__lte', params.max_size.toString());
        
        // Bedrooms range
        if (params.min_bedrooms !== undefined) searchParams.append('bedrooms__gte', params.min_bedrooms.toString());
        if (params.max_bedrooms !== undefined) searchParams.append('bedrooms__lte', params.max_bedrooms.toString());
        
        // Bathrooms range
        if (params.min_bathrooms !== undefined) searchParams.append('bathrooms__gte', params.min_bathrooms.toString());
        if (params.max_bathrooms !== undefined) searchParams.append('bathrooms__lte', params.max_bathrooms.toString());
        
        // Year built range
        if (params.min_year_built) searchParams.append('year_built__gte', params.min_year_built.toString());
        if (params.max_year_built) searchParams.append('year_built__lte', params.max_year_built.toString());
        
        // Condition - handle arrays for multiselect
        if (params.condition) {
          if (Array.isArray(params.condition)) {
            params.condition.forEach((cond) => searchParams.append('condition', cond));
          } else {
            searchParams.append('condition', params.condition);
          }
        }
        
        // Energy rating - handle arrays for multiselect
        if (params.energy_rating) {
          if (Array.isArray(params.energy_rating)) {
            params.energy_rating.forEach((rating) => searchParams.append('energy_rating', rating));
          } else {
            searchParams.append('energy_rating', params.energy_rating);
          }
        }
        
        // Features
        if (params.has_elevator !== undefined) searchParams.append('has_elevator', params.has_elevator.toString());
        if (params.has_balcony !== undefined) searchParams.append('has_balcony', params.has_balcony.toString());
        if (params.has_terrace !== undefined) searchParams.append('has_terrace', params.has_terrace.toString());
        if (params.min_parking_spaces !== undefined) searchParams.append('parking_spaces__gte', params.min_parking_spaces.toString());
        
        // Listing status - handle arrays for multiselect
        if (params.listing_status) {
          if (Array.isArray(params.listing_status)) {
            params.listing_status.forEach((status) => searchParams.append('listing_status', status));
          } else {
            searchParams.append('listing_status', params.listing_status);
          }
        }
        
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


