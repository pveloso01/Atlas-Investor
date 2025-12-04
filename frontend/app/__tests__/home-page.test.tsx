import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock the property API
jest.mock('@/lib/store/api/propertyApi', () => ({
  useGetPropertiesQuery: () => ({
    data: { results: [] },
    isLoading: false,
    error: null,
  }),
  propertyApi: {
    reducerPath: 'propertyApi',
    reducer: () => ({}),
    middleware: () => () => (next: (action: unknown) => unknown) => (action: unknown) =>
      next(action),
  },
}));

// Mock mapbox-gl
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    remove: jest.fn(),
    getCanvas: jest.fn(() => ({ style: {} })),
    resize: jest.fn(),
    addControl: jest.fn(),
    removeControl: jest.fn(),
  })),
  NavigationControl: jest.fn(),
  GeolocateControl: jest.fn(),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn(() => ({
      setPopup: jest.fn(() => ({
        addTo: jest.fn(() => ({ remove: jest.fn() })),
      })),
    })),
    remove: jest.fn(),
  })),
  Popup: jest.fn(() => ({
    setHTML: jest.fn(() => ({ setMaxWidth: jest.fn() })),
  })),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

describe('Home', () => {
  it('renders hero section', () => {
    render(<Home />, { wrapper: Wrapper });
    expect(
      screen.getByText(/Discover and Analyze the Best Property Deals in Portugal/)
    ).toBeInTheDocument();
  });

  it('renders features section', () => {
    render(<Home />, { wrapper: Wrapper });
    expect(screen.getByText('Everything You Need to Invest Smarter')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    render(<Home />, { wrapper: Wrapper });
    expect(screen.getByText('Proven Results')).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    render(<Home />, { wrapper: Wrapper });
    expect(screen.getByText('Trusted by Real Estate Professionals')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<Home />, { wrapper: Wrapper });
    expect(screen.getByText('Ready to Find Your Next Investment?')).toBeInTheDocument();
  });
});
