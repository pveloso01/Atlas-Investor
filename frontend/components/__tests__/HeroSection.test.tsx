import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '../Landing/HeroSection';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock the property API and store
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
    getCanvas: jest.fn(() => ({
      style: {},
    })),
    resize: jest.fn(),
    addControl: jest.fn(),
    removeControl: jest.fn(),
  })),
  NavigationControl: jest.fn(),
  GeolocateControl: jest.fn(),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn(() => ({
      setPopup: jest.fn(() => ({
        addTo: jest.fn(() => ({
          remove: jest.fn(),
        })),
      })),
    })),
    remove: jest.fn(),
  })),
  Popup: jest.fn(() => ({
    setHTML: jest.fn(() => ({
      setMaxWidth: jest.fn(),
    })),
  })),
}));

// Simple wrapper without full store
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

describe('HeroSection', () => {
  it('renders main headline', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    expect(
      screen.getByText(/Discover and Analyze the Best Property Deals in Portugal/)
    ).toBeInTheDocument();
  });

  it('renders subheadline', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    expect(screen.getByText(/All in One Place/)).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    render(<HeroSection />, { wrapper: Wrapper });
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });
});
