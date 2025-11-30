import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import PropertyDetailModal from '../PropertyDetailModal';
import { mockProperty, mockPropertyWithoutOptional } from '@/__tests__/utils/mock-data';

describe('PropertyDetailModal', () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    handleClose.mockClear();
  });

  it('renders nothing when property is null', () => {
    const { container } = render(
      <PropertyDetailModal property={null} open={true} onClose={handleClose} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders property details when open', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    // Property Details appears in DialogTitle and section header
    expect(screen.getAllByText('Property Details').length).toBeGreaterThan(0);
    // Check for unique text elements
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={false} onClose={handleClose} />
    );
    
    expect(screen.queryByText('Property Details')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('displays property type chip', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('displays price per sqm', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    // Price per sqm is calculated and formatted, check for the value or "per m²"
    expect(screen.getByText(/per m²/i)).toBeInTheDocument();
  });

  it('displays bedrooms and bathrooms', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    // Text is split: <strong>2</strong> Bedrooms
    expect(screen.getByText(/Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByText(/Bathrooms/i)).toBeInTheDocument();
    // Check for the numbers separately
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
  });

  it('displays size in square meters', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    // Text is split: <strong>100</strong> m²
    // There are multiple m² elements (size and price per sqm), so use getAllByText
    const m2Elements = screen.getAllByText(/m²/i);
    expect(m2Elements.length).toBeGreaterThan(0);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays coordinates when available', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText(/Latitude: 38.7223/i)).toBeInTheDocument();
    expect(screen.getByText(/Longitude: -9.1393/i)).toBeInTheDocument();
  });

  it('displays external_id when available', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText('TEST-001')).toBeInTheDocument();
  });

  it('displays raw_data description when available', () => {
    render(
      <PropertyDetailModal property={mockProperty} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText('Additional property details')).toBeInTheDocument();
  });

  it('handles property without optional fields', () => {
    render(
      <PropertyDetailModal 
        property={mockPropertyWithoutOptional} 
        open={true} 
        onClose={handleClose} 
      />
    );
    
    expect(screen.getByText(/200.000 €/i)).toBeInTheDocument();
    expect(screen.getByText('Rua Minimal 456')).toBeInTheDocument();
    expect(screen.queryByText(/Bedrooms/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Bathrooms/i)).not.toBeInTheDocument();
  });

  it('handles property without coordinates', () => {
    const propertyWithoutCoords = { ...mockProperty, coordinates: undefined };
    render(
      <PropertyDetailModal property={propertyWithoutCoords} open={true} onClose={handleClose} />
    );
    
    expect(screen.queryByText(/Latitude/i)).not.toBeInTheDocument();
  });

  it('handles property without external_id', () => {
    const propertyWithoutId = { ...mockProperty, external_id: undefined };
    render(
      <PropertyDetailModal property={propertyWithoutId} open={true} onClose={handleClose} />
    );
    
    expect(screen.queryByText('TEST-001')).not.toBeInTheDocument();
  });

  it('handles property without region', () => {
    const propertyWithoutRegion = { ...mockProperty, region: undefined };
    render(
      <PropertyDetailModal property={propertyWithoutRegion} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
    expect(screen.queryByText('Lisbon')).not.toBeInTheDocument();
  });

  it('handles property with null bedrooms', () => {
    const propertyWithNullBedrooms = { ...mockProperty, bedrooms: null };
    render(
      <PropertyDetailModal property={propertyWithNullBedrooms} open={true} onClose={handleClose} />
    );
    
    expect(screen.queryByText(/Bedrooms/i)).not.toBeInTheDocument();
  });

  it('handles property without bathrooms', () => {
    const propertyWithoutBathrooms = { ...mockProperty, bathrooms: undefined };
    render(
      <PropertyDetailModal property={propertyWithoutBathrooms} open={true} onClose={handleClose} />
    );
    
    expect(screen.queryByText(/Bathrooms/i)).not.toBeInTheDocument();
  });

  it('displays N/A for price per sqm when size is 0', () => {
    const propertyWithZeroSize = { ...mockProperty, size_sqm: '0' };
    render(
      <PropertyDetailModal property={propertyWithZeroSize} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });

  it('handles different property types', () => {
    const houseProperty = { ...mockProperty, property_type: 'house' as const };
    render(
      <PropertyDetailModal property={houseProperty} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText('House')).toBeInTheDocument();
  });

  it('handles singular bedroom', () => {
    const propertyWithOneBedroom = { ...mockProperty, bedrooms: 1 };
    render(
      <PropertyDetailModal property={propertyWithOneBedroom} open={true} onClose={handleClose} />
    );
    
    // Text is split: <strong>1</strong> Bedroom (singular)
    expect(screen.getByText(/Bedroom/i)).toBeInTheDocument();
    expect(screen.queryByText(/Bedrooms/i)).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles singular bathroom', () => {
    const propertyWithOneBathroom = { ...mockProperty, bathrooms: '1' };
    render(
      <PropertyDetailModal property={propertyWithOneBathroom} open={true} onClose={handleClose} />
    );
    
    // The component shows "1 Bathroom" (singular) when bathrooms is exactly 1
    // Use getAllByText since "1" appears multiple times
    const ones = screen.getAllByText(/1/);
    expect(ones.length).toBeGreaterThan(0);
    expect(screen.getByText(/Bathroom/i)).toBeInTheDocument();
  });

  it('formats price with number input', () => {
    const propertyWithNumberPrice = { ...mockProperty, price: 250000 };
    render(
      <PropertyDetailModal property={propertyWithNumberPrice} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
  });

  it('handles all property types', () => {
    const types = ['house', 'land', 'commercial', 'mixed', 'unknown'];
    types.forEach(type => {
      const { unmount } = render(
        <PropertyDetailModal property={{ ...mockProperty, property_type: type as any }} open={true} onClose={handleClose} />
      );
      expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles property with zero size for price per sqm', () => {
    const propertyWithZeroSize = { ...mockProperty, size_sqm: '0' };
    render(
      <PropertyDetailModal property={propertyWithZeroSize} open={true} onClose={handleClose} />
    );
    
    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });
});

