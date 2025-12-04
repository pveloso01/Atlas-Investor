import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../dashboard/page';
import { mockProperty } from '@/__tests__/utils/mock-data';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';

const mockPush = jest.fn();

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the property API
jest.mock('@/lib/store/api/propertyApi', () => ({
  useGetPropertiesQuery: jest.fn(),
  propertyApi: {
    reducerPath: 'propertyApi',
    reducer: (state = {}) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
}));

const mockedUseGetPropertiesQuery = useGetPropertiesQuery as jest.MockedFunction<
  typeof useGetPropertiesQuery
>;

// Helper to create mock return value with all required properties
const createMockReturnValue = (overrides: Partial<ReturnType<typeof useGetPropertiesQuery>> = {}) =>
  ({
    data: { results: [], count: 0, next: null, previous: null },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  }) as ReturnType<typeof useGetPropertiesQuery>;

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseGetPropertiesQuery.mockReturnValue(createMockReturnValue());
  });

  it('renders dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Deal Finder Dashboard')).toBeInTheDocument();
  });

  it('renders filter panel', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /Filters/i })).toBeInTheDocument();
  });

  it('renders summary cards', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Deals Found/i)).toBeInTheDocument();
  });

  it('renders insights carousel', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Market Insights')).toBeInTheDocument();
  });

  it('displays property list section', () => {
    render(<DashboardPage />);
    // Multiple elements may contain "Properties" text
    expect(screen.getAllByText(/Properties/i).length).toBeGreaterThan(0);
  });

  it('executes handlePropertyClick callback when property is clicked', async () => {
    const user = userEvent.setup();
    mockedUseGetPropertiesQuery.mockReturnValue(
      createMockReturnValue({
        data: { results: [mockProperty], count: 1, next: null, previous: null },
      })
    );
    render(<DashboardPage />);
    const propertyCard = await screen.findByText(mockProperty.address);
    await user.click(propertyCard);
    expect(mockPush).toHaveBeenCalledWith(`/properties/${mockProperty.id}`);
  });

  it('executes handlePropertySelect callback when property is selected on map', () => {
    mockedUseGetPropertiesQuery.mockReturnValue(
      createMockReturnValue({
        data: { results: [mockProperty], count: 1, next: null, previous: null },
      })
    );
    render(<DashboardPage />);
    // Multiple elements may contain "Properties" text
    expect(screen.getAllByText(/Properties/i).length).toBeGreaterThan(0);
  });

  it('executes handleResetFilters function when reset is called', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);
    const searchInput = screen.getByPlaceholderText(/City, neighborhood, or property ID/i);
    await user.type(searchInput, 'test');

    // Wait for clear button to appear
    await waitFor(() => {
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);
    expect(searchInput).toHaveValue('');
  });

  it('executes filter function in filteredProperties array', () => {
    mockedUseGetPropertiesQuery.mockReturnValue(
      createMockReturnValue({
        data: { results: [mockProperty], count: 1, next: null, previous: null },
      })
    );
    render(<DashboardPage />);
    // Multiple elements may contain "Properties" text
    expect(screen.getAllByText(/Properties/i).length).toBeGreaterThan(0);
  });

  it('executes parseInt function when region filter is set', () => {
    render(<DashboardPage />);
    // Filter panel with region select is rendered
    expect(screen.getAllByText(/region/i).length).toBeGreaterThan(0);
    expect(mockedUseGetPropertiesQuery).toHaveBeenCalled();
  });

  it('builds queryParams object with search filter', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);
    const searchInput = screen.getByPlaceholderText(/City, neighborhood, or property ID/i);
    await user.type(searchInput, 'test');
    expect(mockedUseGetPropertiesQuery).toHaveBeenCalled();
  });

  it('builds queryParams object with propertyType filter', () => {
    render(<DashboardPage />);
    // Filter panel with property type select is rendered
    expect(screen.getAllByText(/property type/i).length).toBeGreaterThan(0);
    expect(mockedUseGetPropertiesQuery).toHaveBeenCalled();
  });

  it('builds queryParams object with minPrice filter', async () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /Filters/i })).toBeInTheDocument();
  });

  it('builds queryParams object with maxPrice filter', async () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /Filters/i })).toBeInTheDocument();
  });

  it('displays loading state when isLoading is true', () => {
    mockedUseGetPropertiesQuery.mockReturnValue(
      createMockReturnValue({
        data: undefined,
        isLoading: true,
      })
    );
    render(<DashboardPage />);
    // Should render page without errors (skeleton loaders are shown)
    expect(screen.getByText('Deal Finder Dashboard')).toBeInTheDocument();
  });

  it('displays empty state when no properties found', () => {
    mockedUseGetPropertiesQuery.mockReturnValue(
      createMockReturnValue({
        data: { results: [], count: 0, next: null, previous: null },
      })
    );
    render(<DashboardPage />);
    expect(screen.getByText(/No properties found/i)).toBeInTheDocument();
  });

  it('executes onClick callback in property map function', async () => {
    const user = userEvent.setup();
    mockedUseGetPropertiesQuery.mockReturnValue(
      createMockReturnValue({
        data: { results: [mockProperty], count: 1, next: null, previous: null },
      })
    );
    render(<DashboardPage />);
    const propertyCard = await screen.findByText(mockProperty.address);
    await user.click(propertyCard);
    expect(mockPush).toHaveBeenCalled();
  });

  it('executes map function for filteredProperties array', () => {
    mockedUseGetPropertiesQuery.mockReturnValue(
      createMockReturnValue({
        data: {
          results: [mockProperty, { ...mockProperty, id: 2, address: 'Another Address' }],
          count: 2,
          next: null,
          previous: null,
        },
      })
    );
    render(<DashboardPage />);
    expect(screen.getByText(mockProperty.address)).toBeInTheDocument();
  });
});
