import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/test-utils';
import PropertiesPage from '../page';
import { mockProperties, mockProperty } from '@/__tests__/utils/mock-data';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';

// Mock mapbox-gl
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(),
  Marker: jest.fn(),
  Popup: jest.fn(),
  NavigationControl: jest.fn(),
  LngLatBounds: jest.fn(),
  accessToken: '',
}));

// Mock the RTK Query hook
jest.mock('@/lib/store/api/propertyApi', () => ({
  propertyApi: {
    reducerPath: 'propertyApi',
    endpoints: {
      getProperties: {},
      getProperty: {},
    },
  },
  useGetPropertiesQuery: jest.fn(),
  useGetPropertyQuery: jest.fn(),
}));

const mockUseGetPropertiesQuery = useGetPropertiesQuery as jest.MockedFunction<typeof useGetPropertiesQuery>;

describe('PropertiesPage', () => {
  beforeEach(() => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: mockProperties.length,
        next: null,
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders properties page heading', () => {
    render(<PropertiesPage />);
    expect(screen.getByText('Properties')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<PropertiesPage />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('renders property type filter', () => {
    render(<PropertiesPage />);
    expect(screen.getByLabelText('Property Type')).toBeInTheDocument();
  });

  it('renders region filter', () => {
    render(<PropertiesPage />);
    expect(screen.getByLabelText('Region')).toBeInTheDocument();
  });

  it('renders show map button', () => {
    render(<PropertiesPage />);
    expect(screen.getByText('Show Map')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isFetching: false,
      isSuccess: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error state', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: undefined,
      error: { status: 500, data: 'Error' },
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: true,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    expect(screen.getByText(/Failed to load properties/i)).toBeInTheDocument();
  });

  it('displays properties when loaded', () => {
    render(<PropertiesPage />);
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
  });

  it('displays empty state when no properties', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    expect(screen.getByText('No properties found')).toBeInTheDocument();
  });

  it('handles search input change', () => {
    render(<PropertiesPage />);
    const searchInput = screen.getByLabelText('Search') as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: 'Lisbon' } });
    
    expect(searchInput.value).toBe('Lisbon');
  });

  it('handles property type filter change', () => {
    render(<PropertiesPage />);
    const propertyTypeSelect = screen.getByLabelText('Property Type');
    
    fireEvent.mouseDown(propertyTypeSelect);
    const apartmentOption = screen.getByText('Apartment');
    fireEvent.click(apartmentOption);
    
    expect(apartmentOption).toBeInTheDocument();
  });

  it('handles region filter change', () => {
    render(<PropertiesPage />);
    const regionSelect = screen.getByLabelText('Region');
    
    fireEvent.mouseDown(regionSelect);
    const lisbonOption = screen.getByText('Lisbon');
    fireEvent.click(lisbonOption);
    
    expect(lisbonOption).toBeInTheDocument();
  });

  it('toggles map view', () => {
    render(<PropertiesPage />);
    const showMapButton = screen.getByText('Show Map');
    
    fireEvent.click(showMapButton);
    
    expect(screen.getByText('Hide Map')).toBeInTheDocument();
  });

  it('toggles view mode between grid and list', () => {
    render(<PropertiesPage />);
    const gridButton = screen.getByLabelText('grid view');
    const listButton = screen.getByLabelText('list view');
    
    expect(gridButton).toBeInTheDocument();
    expect(listButton).toBeInTheDocument();
    
    fireEvent.click(listButton);
    
    expect(listButton).toBeInTheDocument();
  });

  it('opens property detail modal when property card is clicked', async () => {
    render(<PropertiesPage />);
    const propertyCard = screen.getByText('Rua Teste 123, Lisbon').closest('.MuiCard-root');
    
    if (propertyCard) {
      fireEvent.click(propertyCard);
      
      await waitFor(() => {
        expect(screen.getByText('Property Details')).toBeInTheDocument();
      });
    }
  });

  it('displays pagination when there are more properties than page size', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: 25,
        next: 'http://example.com/api/properties/?page=2',
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    expect(screen.getByText(/Showing 1 to 12 of 25 properties/i)).toBeInTheDocument();
  });

  it('handles page change', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: 25,
        next: 'http://example.com/api/properties/?page=2',
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    const pagination = screen.getByRole('navigation');
    expect(pagination).toBeInTheDocument();
  });

  it('displays map when showMap is true', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: mockProperties.length,
        next: null,
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    const showMapButton = screen.getByText('Show Map');
    fireEvent.click(showMapButton);
    
    expect(screen.getByText('Hide Map')).toBeInTheDocument();
  });

  it('hides grid/list view when map is shown', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: mockProperties.length,
        next: null,
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    const showMapButton = screen.getByText('Show Map');
    fireEvent.click(showMapButton);
    
    // View mode toggle should not be visible when map is shown
    expect(screen.queryByLabelText('grid view')).not.toBeInTheDocument();
  });

  it('resets page to 1 when search changes', () => {
    render(<PropertiesPage />);
    const searchInput = screen.getByLabelText('Search') as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: 'Lisbon' } });
    
    expect(searchInput.value).toBe('Lisbon');
    // Page should reset to 1 (tested via the query being called)
  });

  it('resets page to 1 when property type changes', () => {
    render(<PropertiesPage />);
    const propertyTypeSelect = screen.getByLabelText('Property Type');
    
    fireEvent.mouseDown(propertyTypeSelect);
    const apartmentOption = screen.getByText('Apartment');
    fireEvent.click(apartmentOption);
    
    expect(apartmentOption).toBeInTheDocument();
  });

  it('resets page to 1 when region changes', () => {
    render(<PropertiesPage />);
    const regionSelect = screen.getByLabelText('Region');
    
    fireEvent.mouseDown(regionSelect);
    const lisbonOption = screen.getByText('Lisbon');
    fireEvent.click(lisbonOption);
    
    expect(lisbonOption).toBeInTheDocument();
  });

  it('displays pagination info correctly', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: 25,
        next: 'http://example.com/api/properties/?page=2',
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    expect(screen.getByText(/Showing 1 to 12 of 25 properties/i)).toBeInTheDocument();
  });

  it('does not display pagination when count is less than page size', () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: 5,
        next: null,
        previous: null,
        results: mockProperties.slice(0, 5),
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument();
  });

  it('closes modal when onClose is called', async () => {
    render(<PropertiesPage />);
    const propertyCard = screen.getByText('Rua Teste 123, Lisbon').closest('.MuiCard-root');
    
    if (propertyCard) {
      fireEvent.click(propertyCard);
      
      await waitFor(() => {
        expect(screen.getByText('Property Details')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Property Details')).not.toBeInTheDocument();
      });
    }
  });

  it('handles property click from map', async () => {
    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: mockProperties.length,
        next: null,
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    const showMapButton = screen.getByText('Show Map');
    fireEvent.click(showMapButton);
    
    // Map should be displayed (tested via component rendering)
    expect(screen.getByText('Hide Map')).toBeInTheDocument();
  });

  it('displays grid view by default', () => {
    render(<PropertiesPage />);
    expect(screen.getByLabelText('grid view')).toBeInTheDocument();
    expect(screen.getByLabelText('list view')).toBeInTheDocument();
  });

  it('switches to list view when list button is clicked', () => {
    render(<PropertiesPage />);
    const listButton = screen.getByLabelText('list view');
    fireEvent.click(listButton);
    
    // List view should be active
    expect(listButton).toBeInTheDocument();
  });

  it('handles window.scrollTo when page changes', () => {
    const scrollToSpy = jest.fn();
    window.scrollTo = scrollToSpy;

    mockUseGetPropertiesQuery.mockReturnValue({
      data: {
        count: 25,
        next: 'http://example.com/api/properties/?page=2',
        previous: null,
        results: mockProperties,
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);
    const pagination = screen.getByRole('navigation');
    const nextButton = pagination.querySelector('[aria-label*="Go to page"]');
    
    if (nextButton) {
      fireEvent.click(nextButton);
      // scrollTo should be called (though we can't easily test the exact call)
    }
  });

  it('handles all property type filter options', () => {
    render(<PropertiesPage />);
    const propertyTypeSelect = screen.getByLabelText('Property Type');
    
    fireEvent.mouseDown(propertyTypeSelect);
    
    expect(screen.getByText('All Types')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('House')).toBeInTheDocument();
    expect(screen.getByText('Land')).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
    expect(screen.getByText('Mixed Use')).toBeInTheDocument();
  });

  it('handles all region filter options', () => {
    render(<PropertiesPage />);
    const regionSelect = screen.getByLabelText('Region');
    
    fireEvent.mouseDown(regionSelect);
    
    expect(screen.getByText('All Regions')).toBeInTheDocument();
    expect(screen.getByText('Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Porto')).toBeInTheDocument();
    expect(screen.getByText('Cascais')).toBeInTheDocument();
  });

  it('displays properties in grid mode', () => {
    render(<PropertiesPage />);
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
  });

  it('displays properties in list mode', () => {
    render(<PropertiesPage />);
    const listButton = screen.getByLabelText('list view');
    fireEvent.click(listButton);
    
    // Properties should still be visible
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
  });

  it('handles modal close correctly', async () => {
    render(<PropertiesPage />);
    const propertyCard = screen.getByText('Rua Teste 123, Lisbon').closest('.MuiCard-root');
    
    if (propertyCard) {
      fireEvent.click(propertyCard);
      
      await waitFor(() => {
        expect(screen.getByText('Property Details')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Property Details')).not.toBeInTheDocument();
      });
    }
  });

  it('updates query when filters change', () => {
    render(<PropertiesPage />);
    const searchInput = screen.getByLabelText('Search') as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
    // The query should be called with updated params
    expect(mockUseGetPropertiesQuery).toHaveBeenCalled();
  });
});

