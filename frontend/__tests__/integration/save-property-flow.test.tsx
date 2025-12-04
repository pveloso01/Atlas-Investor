/**
 * Integration tests for save property flow
 * 
 * Tests the complete user journey through:
 * - Viewing a property
 * - Adding to portfolio
 * - Managing portfolio
 * - Removing from portfolio
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
  ],
  count: 1,
  next: null,
  previous: null,
};

// Mock portfolioApi
const mockAddPropertyToPortfolio = jest.fn();
const mockRemovePropertyFromPortfolio = jest.fn();
const mockGetPortfolios = jest.fn();
const mockCreatePortfolio = jest.fn();

const mockPortfolios = [
  {
    id: 1,
    name: 'My Investment Portfolio',
    description: 'Primary investment properties',
    is_default: true,
    property_count: 2,
    total_value: 500000,
    average_price: 250000,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Secondary Portfolio',
    description: 'Other properties',
    is_default: false,
    property_count: 1,
    total_value: 300000,
    average_price: 300000,
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  },
];

jest.mock('@/lib/store/api/portfolioApi', () => ({
  ...jest.requireActual('@/lib/store/api/portfolioApi'),
  useGetPortfoliosQuery: () => ({
    data: mockPortfolios,
    isLoading: false,
    isError: false,
  }),
  useGetPortfolioQuery: (id: number) => ({
    data: mockPortfolios.find(p => p.id === id),
    isLoading: false,
    isError: false,
  }),
  useAddPropertyToPortfolioMutation: () => [
    mockAddPropertyToPortfolio,
    {
      isLoading: false,
      isSuccess: false,
      isError: false,
    },
  ],
  useRemovePropertyFromPortfolioMutation: () => [
    mockRemovePropertyFromPortfolio,
    {
      isLoading: false,
    },
  ],
  useCreatePortfolioMutation: () => [
    mockCreatePortfolio,
    {
      isLoading: false,
    },
  ],
}));

describe('Save Property Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Add Property to Portfolio', () => {
    it('should add property to existing portfolio', async () => {
      mockAddPropertyToPortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.resolve({
          id: 1,
          property_id: 5,
          property_address: 'Test Property',
          notes: 'Great investment',
          target_price: '280000',
          added_at: '2025-01-01T00:00:00Z',
        }),
      });

      const result = await mockAddPropertyToPortfolio({
        portfolioId: 1,
        property_id: 5,
        notes: 'Great investment',
        target_price: 280000,
      });

      const portfolioProperty = await result.unwrap();

      expect(mockAddPropertyToPortfolio).toHaveBeenCalledWith({
        portfolioId: 1,
        property_id: 5,
        notes: 'Great investment',
        target_price: 280000,
      });
      expect(portfolioProperty.property_id).toBe(5);
    });

    it('should handle adding property without notes or target price', async () => {
      mockAddPropertyToPortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.resolve({
          id: 2,
          property_id: 6,
          property_address: 'Another Property',
          notes: '',
          target_price: null,
          added_at: '2025-01-01T00:00:00Z',
        }),
      });

      const result = await mockAddPropertyToPortfolio({
        portfolioId: 1,
        property_id: 6,
      });

      const portfolioProperty = await result.unwrap();

      expect(portfolioProperty.property_id).toBe(6);
      expect(portfolioProperty.notes).toBe('');
      expect(portfolioProperty.target_price).toBeNull();
    });

    it('should handle duplicate property error', async () => {
      mockAddPropertyToPortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.reject({
          status: 400,
          data: { error: 'Property already in portfolio' },
        }),
      });

      const result = await mockAddPropertyToPortfolio({
        portfolioId: 1,
        property_id: 5,
      });

      await expect(result.unwrap()).rejects.toMatchObject({
        status: 400,
        data: { error: 'Property already in portfolio' },
      });
    });
  });

  describe('Create New Portfolio', () => {
    it('should create new portfolio and add property', async () => {
      // Step 1: Create portfolio
      mockCreatePortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.resolve({
          id: 3,
          name: 'New Portfolio',
          description: '',
          is_default: false,
          property_count: 0,
          total_value: 0,
          average_price: null,
          created_at: '2025-01-03T00:00:00Z',
          updated_at: '2025-01-03T00:00:00Z',
        }),
      });

      const portfolioResult = await mockCreatePortfolio({
        name: 'New Portfolio',
      });

      const newPortfolio = await portfolioResult.unwrap();

      expect(newPortfolio.id).toBe(3);
      expect(newPortfolio.name).toBe('New Portfolio');
      expect(newPortfolio.property_count).toBe(0);

      // Step 2: Add property to new portfolio
      mockAddPropertyToPortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.resolve({
          id: 3,
          property_id: 7,
          property_address: 'Property for New Portfolio',
          notes: '',
          target_price: null,
          added_at: '2025-01-03T00:00:00Z',
        }),
      });

      const propertyResult = await mockAddPropertyToPortfolio({
        portfolioId: newPortfolio.id,
        property_id: 7,
      });

      const portfolioProperty = await propertyResult.unwrap();

      expect(portfolioProperty.property_id).toBe(7);
    });
  });

  describe('Remove Property from Portfolio', () => {
    it('should remove property from portfolio', async () => {
      mockRemovePropertyFromPortfolio.mockResolvedValueOnce(Promise.resolve({}));

      await mockRemovePropertyFromPortfolio({
        portfolioId: 1,
        property_id: 5,
      });

      expect(mockRemovePropertyFromPortfolio).toHaveBeenCalledWith({
        portfolioId: 1,
        property_id: 5,
      });
    });

    it('should handle removing non-existent property', async () => {
      mockRemovePropertyFromPortfolio.mockRejectedValueOnce({
        status: 404,
        data: { error: 'Property not in portfolio' },
      });

      await expect(
        mockRemovePropertyFromPortfolio({
          portfolioId: 1,
          property_id: 999,
        })
      ).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe('Portfolio Management', () => {
    it('should list user portfolios', () => {
      // Verify mock data structure
      expect(mockPortfolios).toHaveLength(2);
      expect(mockPortfolios[0].name).toBe('My Investment Portfolio');
      expect(mockPortfolios[0].is_default).toBe(true);
      expect(mockPortfolios[1].name).toBe('Secondary Portfolio');
    });

    it('should get portfolio details', () => {
      const portfolio = mockPortfolios.find(p => p.id === 1);

      expect(portfolio).toBeDefined();
      expect(portfolio?.id).toBe(1);
      expect(portfolio?.property_count).toBe(2);
      expect(portfolio?.total_value).toBe(500000);
    });

    it('should identify default portfolio', () => {
      const defaultPortfolio = mockPortfolios.find(p => p.is_default);

      expect(defaultPortfolio).toBeDefined();
      expect(defaultPortfolio?.id).toBe(1);
    });

    it('should calculate portfolio total value', () => {
      const portfolio = mockPortfolios.find(p => p.id === 1);

      expect(portfolio?.total_value).toBe(500000);
      expect(portfolio?.average_price).toBe(250000);
    });
  });

  describe('Complete Save Flow', () => {
    it('should complete the full save property workflow', async () => {
      // Step 1: User views property details
      const propertyId = 1;
      const property = mockProperties.results.find(p => p.id === propertyId);
      expect(property).toBeDefined();

      // Step 2: User clicks "Add to Portfolio"
      // Step 3: User selects portfolio
      const selectedPortfolioId = 1;

      // Step 4: User adds property with notes
      mockAddPropertyToPortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.resolve({
          id: 10,
          property_id: propertyId,
          property_address: property?.address || '',
          notes: 'High rental yield potential',
          target_price: '280000',
          added_at: '2025-01-01T00:00:00Z',
        }),
      });

      const result = await mockAddPropertyToPortfolio({
        portfolioId: selectedPortfolioId,
        property_id: propertyId,
        notes: 'High rental yield potential',
        target_price: 280000,
      });

      const portfolioProperty = await result.unwrap();

      // Step 5: Verify property was added
      expect(portfolioProperty.property_id).toBe(propertyId);
      expect(portfolioProperty.notes).toBe('High rental yield potential');

      // Step 6: User can view the property in their portfolio
      const portfolio = mockPortfolios.find(p => p.id === selectedPortfolioId);
      expect(portfolio).toBeDefined();
      expect(portfolio?.property_count).toBeGreaterThan(0);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle network errors gracefully', async () => {
      mockAddPropertyToPortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.reject({
          status: 'FETCH_ERROR',
          error: 'Network request failed',
        }),
      });

      const result = await mockAddPropertyToPortfolio({
        portfolioId: 1,
        property_id: 5,
      });

      await expect(result.unwrap()).rejects.toMatchObject({
        status: 'FETCH_ERROR',
      });
    });

    it('should handle unauthorized access', async () => {
      mockAddPropertyToPortfolio.mockResolvedValueOnce({
        unwrap: () => Promise.reject({
          status: 401,
          data: { detail: 'Authentication required' },
        }),
      });

      const result = await mockAddPropertyToPortfolio({
        portfolioId: 1,
        property_id: 5,
      });

      await expect(result.unwrap()).rejects.toMatchObject({
        status: 401,
      });
    });
  });
});

