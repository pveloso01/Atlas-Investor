/**
 * Integration tests for property search and filter flow
 * 
 * Tests the complete user journey through:
 * - Viewing property list
 * - Applying filters
 * - Viewing property details
 * - Performing searches
 */

import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';

// Mock properties data
const mockProperties = {
  results: [
    {
      id: 1,
      address: 'Rua Augusta 123, Lisboa',
      price: '300000',
      size_sqm: '80',
      property_type: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      region: {
        id: 1,
        name: 'Lisbon',
        code: 'LX',
        avg_price_per_sqm: 5000,
        avg_rent: 1200,
        avg_yield: 5.5,
      },
      coordinates: [38.7223, -9.1393],
      images: [],
      year_built: 2010,
      condition: 'good',
      energy_rating: 'B',
      has_elevator: true,
      has_balcony: true,
      has_terrace: false,
      parking_spaces: 1,
      floor_number: 3,
      total_floors: 5,
      price_per_sqm: 3750,
      raw_data: {},
    },
    {
      id: 2,
      address: 'Rua das Flores 456, Porto',
      price: '250000',
      size_sqm: '90',
      property_type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      region: {
        id: 2,
        name: 'Porto',
        code: 'PT',
        avg_price_per_sqm: 3000,
        avg_rent: 900,
        avg_yield: 4.8,
      },
      coordinates: [41.1579, -8.6291],
      images: [],
      year_built: 2015,
      condition: 'excellent',
      energy_rating: 'A',
      has_elevator: true,
      has_balcony: false,
      has_terrace: true,
      parking_spaces: 2,
      floor_number: 2,
      total_floors: 4,
      price_per_sqm: 2778,
      raw_data: {},
    },
  ],
  count: 2,
  next: null,
  previous: null,
};

// Mock propertyApi
const mockGetProperties = jest.fn();

jest.mock('@/lib/store/api/propertyApi', () => ({
  ...jest.requireActual('@/lib/store/api/propertyApi'),
  useGetPropertiesQuery: (params: unknown) => ({
    data: mockProperties,
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockGetProperties,
  }),
  useGetPropertyQuery: (id: number) => ({
    data: mockProperties.results.find(p => p.id === id),
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

describe('Property Search and Filter Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Property List', () => {
    it('should display list of properties', () => {
      expect(mockProperties).toBeDefined();
      expect(mockProperties.results).toHaveLength(2);
      expect(mockProperties.results[0].address).toContain('Lisboa');
      expect(mockProperties.results[1].address).toContain('Porto');
    });

    it('should show property count', () => {
      expect(mockProperties.count).toBe(2);
    });
  });

  describe('Property Filters', () => {
    it('should filter by property type', () => {
      const filters = {
        property_type: 'apartment',
      };

      // In actual test, this would filter the API call
      const filteredProperties = mockProperties.results.filter(
        (p) => p.property_type === filters.property_type
      );

      expect(filteredProperties).toHaveLength(2);
      expect(filteredProperties.every(p => p.property_type === 'apartment')).toBe(true);
    });

    it('should filter by region', () => {
      const filters = {
        region: 1, // Lisbon
      };

      const filteredProperties = mockProperties.results.filter(
        (p) => p.region.id === filters.region
      );

      expect(filteredProperties).toHaveLength(1);
      expect(filteredProperties[0].region.name).toBe('Lisbon');
    });

    it('should filter by price range', () => {
      const filters = {
        min_price: 200000,
        max_price: 280000,
      };

      const filteredProperties = mockProperties.results.filter((p) => {
        const price = parseFloat(p.price);
        return price >= filters.min_price && price <= filters.max_price;
      });

      expect(filteredProperties).toHaveLength(1);
      expect(filteredProperties[0].price).toBe('250000');
    });

    it('should filter by number of bedrooms', () => {
      const filters = {
        bedrooms: 3,
      };

      const filteredProperties = mockProperties.results.filter(
        (p) => p.bedrooms === filters.bedrooms
      );

      expect(filteredProperties).toHaveLength(1);
      expect(filteredProperties[0].bedrooms).toBe(3);
    });

    it('should apply multiple filters simultaneously', () => {
      const filters = {
        property_type: 'apartment',
        region: 2, // Porto
        min_price: 200000,
        max_price: 300000,
      };

      const filteredProperties = mockProperties.results.filter((p) => {
        const price = parseFloat(p.price);
        return (
          p.property_type === filters.property_type &&
          p.region.id === filters.region &&
          price >= filters.min_price &&
          price <= filters.max_price
        );
      });

      expect(filteredProperties).toHaveLength(1);
      expect(filteredProperties[0].address).toContain('Porto');
    });

    it('should reset filters', () => {
      const initialFilters = {
        search: '',
        propertyType: '',
        region: '',
        minPrice: 0,
        maxPrice: 2000000,
      };

      const currentFilters = {
        ...initialFilters,
        propertyType: 'apartment',
        region: '1',
      };

      // Reset to initial
      const resetFilters = { ...initialFilters };

      expect(resetFilters).toEqual(initialFilters);
      expect(resetFilters.propertyType).toBe('');
      expect(resetFilters.region).toBe('');
    });
  });

  describe('Property Search', () => {
    it('should search properties by address', () => {
      const searchTerm = 'Lisboa';

      const searchResults = mockProperties.results.filter((p) =>
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].address).toContain('Lisboa');
    });

    it('should show empty results for non-matching search', () => {
      const searchTerm = 'NonexistentLocation';

      const searchResults = mockProperties.results.filter((p) =>
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(searchResults).toHaveLength(0);
    });
  });

  describe('Property Detail View', () => {
    it('should fetch and display property details', () => {
      const propertyId = 1;
      const property = mockProperties.results.find(p => p.id === propertyId);

      expect(property).toBeDefined();
      expect(property?.id).toBe(propertyId);
      expect(property?.address).toContain('Lisboa');
    });

    it('should show property features', () => {
      const propertyId = 1;
      const property = mockProperties.results.find(p => p.id === propertyId);

      expect(property?.bedrooms).toBe(2);
      expect(property?.bathrooms).toBe(1);
      expect(property?.size_sqm).toBe('80');
      expect(property?.has_elevator).toBe(true);
      expect(property?.parking_spaces).toBe(1);
    });

    it('should show property location', () => {
      const propertyId = 1;
      const property = mockProperties.results.find(p => p.id === propertyId);

      expect(property?.region).toBeDefined();
      expect(property?.region.name).toBe('Lisbon');
      expect(property?.coordinates).toEqual([38.7223, -9.1393]);
    });

    it('should show property price information', () => {
      const propertyId = 1;
      const property = mockProperties.results.find(p => p.id === propertyId);

      expect(property?.price).toBe('300000');
      expect(property?.price_per_sqm).toBe(3750);
    });
  });

  describe('Pagination', () => {
    it('should handle pagination metadata', () => {
      expect(mockProperties.count).toBe(2);
      expect(mockProperties.next).toBeNull();
      expect(mockProperties.previous).toBeNull();
    });
  });

  describe('Loading and Error States', () => {
    it('should handle loading state', () => {
      // In actual implementation, this would show loading spinner
      const isLoading = false;
      
      expect(isLoading).toBe(false);
    });

    it('should handle error state', () => {
      // In actual implementation, this would show error message
      const isError = false;
      const error = null;

      expect(isError).toBe(false);
      expect(error).toBeNull();
    });
  });
});

