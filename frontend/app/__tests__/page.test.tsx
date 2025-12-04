import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock the property API
jest.mock('@/lib/store/api/propertyApi', () => ({
  useGetPropertiesQuery: jest.fn(() => ({
    data: { results: [] },
    isLoading: false,
    error: null,
  })),
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

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Home />, { wrapper: Wrapper });
    expect(
      screen.getByText(/Discover and Analyze the Best Property Deals in Portugal/i)
    ).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Home />, { wrapper: Wrapper });
    expect(screen.getByText(/All in One Place/i)).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    render(<Home />, { wrapper: Wrapper });
    const getStartedButton = screen.getByText('Get Started Free');
    expect(getStartedButton).toBeInTheDocument();
  });

  it('Get Started button links to /signup', () => {
    render(<Home />, { wrapper: Wrapper });
    const getStartedButton = screen.getByText('Get Started Free').closest('a');
    expect(getStartedButton).toHaveAttribute('href', '/signup');
  });
});
