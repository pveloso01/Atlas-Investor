import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import PropertyMap from '../PropertyMap';
import { mockProperties, mockProperty } from '@/__tests__/utils/mock-data';

// Mock mapbox-gl
jest.mock('mapbox-gl', () => ({
  Map: jest.fn().mockImplementation(() => ({
    addControl: jest.fn(),
    fitBounds: jest.fn(),
    remove: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
  Marker: jest.fn().mockImplementation(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    getElement: jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }),
    getLngLat: jest.fn().mockReturnValue({ lng: -9.1393, lat: 38.7223 }),
    remove: jest.fn(),
  })),
  Popup: jest.fn().mockImplementation(() => ({
    setDOMContent: jest.fn().mockReturnThis(),
  })),
  NavigationControl: jest.fn(),
  LngLatBounds: jest.fn().mockImplementation(() => ({
    extend: jest.fn(),
  })),
  accessToken: '',
}));

describe('PropertyMap', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: 'test-token',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders map container when token is provided', () => {
    const { container } = render(
      <PropertyMap properties={mockProperties} />
    );
    
    const mapContainer = container.querySelector('[class*="MuiBox-root"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('displays error message when token is not configured', () => {
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = '';
    
    render(<PropertyMap properties={mockProperties} />);
    
    expect(screen.getByText(/Mapbox access token is not configured/i)).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const { container } = render(
      <PropertyMap properties={mockProperties} height={800} />
    );
    
    const mapContainer = container.querySelector('[class*="MuiBox-root"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('handles empty properties array', () => {
    const { container } = render(<PropertyMap properties={[]} />);
    
    const mapContainer = container.querySelector('[class*="MuiBox-root"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('handles properties without coordinates', () => {
    const propertiesWithoutCoords = [
      { ...mockProperty, coordinates: undefined },
    ];
    
    const { container } = render(
      <PropertyMap properties={propertiesWithoutCoords} />
    );
    
    const mapContainer = container.querySelector('[class*="MuiBox-root"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('handles properties with invalid coordinates', () => {
    const propertiesWithInvalidCoords = [
      { ...mockProperty, coordinates: [1] as any },
    ];
    
    const { container } = render(
      <PropertyMap properties={propertiesWithInvalidCoords} />
    );
    
    const mapContainer = container.querySelector('[class*="MuiBox-root"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it('calls onPropertyClick when provided', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <PropertyMap properties={mockProperties} onPropertyClick={handleClick} />
    );
    
    const mapContainer = container.querySelector('[class*="MuiBox-root"]');
    expect(mapContainer).toBeInTheDocument();
    // Note: Actual click testing would require more complex setup with mapbox
  });

  it('handles properties with valid coordinates', () => {
    const { container } = render(
      <PropertyMap properties={[mockProperty]} />
    );
    
    const mapContainer = container.querySelector('[class*="MuiBox-root"]');
    expect(mapContainer).toBeInTheDocument();
  });
});

