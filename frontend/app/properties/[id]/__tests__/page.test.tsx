import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import PropertyDetailPage from '../page';
import { mockProperty, mockPropertyWithoutOptional } from '@/__tests__/utils/mock-data';
import { useGetPropertyQuery } from '@/lib/store/api/propertyApi';

// Mock the RTK Query hook
jest.mock('@/lib/store/api/propertyApi', () => ({
  useGetPropertyQuery: jest.fn(),
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseGetPropertyQuery = useGetPropertyQuery as jest.MockedFunction<typeof useGetPropertyQuery>;

describe('PropertyDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays property details when loaded', async () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: mockProperty,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Property Details')).toBeInTheDocument();
    });

    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText(/TEST-001/i)).toBeInTheDocument();
  });

  it('displays error message when property fetch fails', () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: undefined,
      error: { status: 'FETCH_ERROR', error: 'Network error' },
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);
    expect(screen.getByText(/Failed to load property/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Properties/i)).toBeInTheDocument();
  });

  it('displays not found message when property is null', () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);
    expect(screen.getByText(/Property not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Properties/i)).toBeInTheDocument();
  });

  it('displays property without optional fields', async () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: mockPropertyWithoutOptional,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Rua Minimal 456')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Bedrooms/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Bathrooms/i)).not.toBeInTheDocument();
  });

  it('handles property with coordinates', async () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: mockProperty,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/Latitude: 38.7223/i)).toBeInTheDocument();
      expect(screen.getByText(/Longitude: -9.1393/i)).toBeInTheDocument();
    });
  });

  it('handles property without coordinates', async () => {
    const propertyWithoutCoords = { ...mockProperty, coordinates: undefined };
    mockUseGetPropertyQuery.mockReturnValue({
      data: propertyWithoutCoords,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Property Details')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Latitude/i)).not.toBeInTheDocument();
  });

  it('handles different property types', async () => {
    const houseProperty = { ...mockProperty, property_type: 'house' as const };
    mockUseGetPropertyQuery.mockReturnValue({
      data: houseProperty,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('House')).toBeInTheDocument();
    });
  });

  it('displays price per sqm correctly', async () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: mockProperty,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/per m²/i)).toBeInTheDocument();
    });
  });

  it('handles property with raw_data description', async () => {
    mockUseGetPropertyQuery.mockReturnValue({
      data: mockProperty,
      error: undefined,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Additional property details')).toBeInTheDocument();
    });
  });
});
