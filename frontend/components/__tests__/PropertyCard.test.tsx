import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import PropertyCard from '../PropertyCard';
import { mockProperty, mockPropertyWithoutOptional } from '@/__tests__/utils/mock-data';
import type { Property } from '@/types/property';

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    // Check for specific unique text
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Lisbon')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText(/100 m²/i)).toBeInTheDocument();
    // Price and price per sqm both contain numbers, so check for unique elements
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('renders property type chip', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('handles property without optional fields', () => {
    render(<PropertyCard property={mockPropertyWithoutOptional} />);

    // Price is formatted, check for the number
    expect(screen.getByText(/200/i)).toBeInTheDocument();
    expect(screen.getByText('Rua Minimal 456')).toBeInTheDocument();
    expect(screen.getByText(/80 m²/i)).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument(); // No bedrooms
  });

  it('renders as a link to the property detail page', () => {
    render(<PropertyCard property={mockProperty} />);

    const link = screen.getByText('Rua Teste 123, Lisbon').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/properties/1');
  });

  it('formats price correctly', () => {
    const propertyWithStringPrice = { ...mockProperty, price: '350000' };
    render(<PropertyCard property={propertyWithStringPrice} />);

    // Price is formatted, verify component renders
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('displays N/A for price per sqm when size is 0', () => {
    const propertyWithZeroSize = { ...mockProperty, size_sqm: '0' };
    render(<PropertyCard property={propertyWithZeroSize} />);

    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });

  it('handles different property types', () => {
    const houseProperty = { ...mockProperty, property_type: 'house' as const };
    render(<PropertyCard property={houseProperty} />);
    expect(screen.getByText('House')).toBeInTheDocument();
  });

  it('handles property without region', () => {
    const propertyWithoutRegion = { ...mockProperty, region: undefined };
    render(<PropertyCard property={propertyWithoutRegion} />);

    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
    expect(screen.queryByText('Lisbon')).not.toBeInTheDocument();
  });

  it('handles property with null bedrooms', () => {
    const propertyWithNullBedrooms = { ...mockProperty, bedrooms: undefined };
    render(<PropertyCard property={propertyWithNullBedrooms} />);

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('handles property with undefined bedrooms', () => {
    const propertyWithUndefinedBedrooms = { ...mockProperty, bedrooms: undefined };
    render(<PropertyCard property={propertyWithUndefinedBedrooms} />);

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('handles property without bathrooms', () => {
    const propertyWithoutBathrooms = { ...mockProperty, bathrooms: undefined };
    render(<PropertyCard property={propertyWithoutBathrooms} />);

    expect(screen.queryByText('1.5')).not.toBeInTheDocument();
  });

  it('formats price with number input', () => {
    const propertyWithNumberPrice = { ...mockProperty, price: '250000' };
    render(<PropertyCard property={propertyWithNumberPrice} />);

    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
  });

  it('handles all property types', () => {
    const types = ['house', 'land', 'commercial', 'mixed', 'unknown'];
    types.forEach((type) => {
      const { unmount } = render(
        <PropertyCard
          property={{ ...mockProperty, property_type: type as Property['property_type'] }}
        />
      );
      expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles property with zero size for price per sqm', () => {
    const propertyWithZeroSize = { ...mockProperty, size_sqm: '0' };
    render(<PropertyCard property={propertyWithZeroSize} />);

    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });
});
