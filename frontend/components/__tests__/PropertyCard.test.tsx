import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import PropertyCard from '../PropertyCard';
import { mockProperty, mockPropertyWithoutOptional } from '@/__tests__/utils/mock-data';

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText(/300.000 €/i)).toBeInTheDocument();
    expect(screen.getByText('Rua Teste 123, Lisbon')).toBeInTheDocument();
    expect(screen.getByText('Lisbon')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText(/100 m²/i)).toBeInTheDocument();
    expect(screen.getByText(/3.000 €/i)).toBeInTheDocument();
  });

  it('renders property type chip', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('handles property without optional fields', () => {
    render(<PropertyCard property={mockPropertyWithoutOptional} />);
    
    expect(screen.getByText(/200.000 €/i)).toBeInTheDocument();
    expect(screen.getByText('Rua Minimal 456')).toBeInTheDocument();
    expect(screen.getByText(/80 m²/i)).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument(); // No bedrooms
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<PropertyCard property={mockProperty} onClick={handleClick} />);
    
    const card = screen.getByText('Rua Teste 123, Lisbon').closest('.MuiCard-root');
    fireEvent.click(card!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when not provided', () => {
    render(<PropertyCard property={mockProperty} />);
    
    const card = screen.getByText('Rua Teste 123, Lisbon').closest('.MuiCard-root');
    fireEvent.click(card!);
    
    // Should not throw error
    expect(card).toBeInTheDocument();
  });

  it('formats price correctly', () => {
    const propertyWithStringPrice = { ...mockProperty, price: '350000' };
    render(<PropertyCard property={propertyWithStringPrice} />);
    
    expect(screen.getByText(/350.000 €/i)).toBeInTheDocument();
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
    const propertyWithNullBedrooms = { ...mockProperty, bedrooms: null };
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
});

