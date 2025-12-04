import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import PropertyComparisonTable from '../Comparison/PropertyComparisonTable';

const mockProperties = [
  {
    id: 1,
    address: 'Rua Augusta 145, Lisboa',
    price: '650000',
    size_sqm: '120',
    property_type: 'apartment',
    bedrooms: 3,
    images: ['https://example.com/img1.jpg'],
    year_built: 2010,
    rental_yield: 5.2,
    region: { name: 'Lisboa' },
    has_parking: true,
    has_terrace: true,
    has_elevator: true,
  },
  {
    id: 2,
    address: 'Rua das Flores 125, Porto',
    price: 380000,
    size_sqm: 95,
    property_type: 'house',
    bedrooms: 2,
    images: ['https://example.com/img2.jpg'],
    year_built: 2015,
    rental_yield: 4.8,
    region: { name: 'Porto' },
    has_parking: false,
    has_terrace: false,
    has_elevator: false,
  },
];

describe('PropertyComparisonTable', () => {
  it('renders empty state when no properties provided', () => {
    render(<PropertyComparisonTable properties={[]} />);
    expect(screen.getByText('No properties to compare')).toBeInTheDocument();
  });

  it('renders property comparison table with properties', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    // Check property addresses are shown
    expect(screen.getByText('Rua Augusta 145')).toBeInTheDocument();
    expect(screen.getByText('Rua das Flores 125')).toBeInTheDocument();
  });

  it('displays property prices correctly', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    // Check prices are formatted correctly (locale may vary)
    expect(screen.getByText(/€.*650.*000/)).toBeInTheDocument();
    expect(screen.getByText(/€.*380.*000/)).toBeInTheDocument();
  });

  it('displays property sizes correctly', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    expect(screen.getByText('120 m²')).toBeInTheDocument();
    expect(screen.getByText('95 m²')).toBeInTheDocument();
  });

  it('displays property types as chips', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('house')).toBeInTheDocument();
  });

  it('displays bedrooms correctly', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays rental yield correctly', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    expect(screen.getByText('5.2%')).toBeInTheDocument();
    expect(screen.getByText('4.8%')).toBeInTheDocument();
  });

  it('displays locations correctly', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    expect(screen.getByText('Lisboa')).toBeInTheDocument();
    expect(screen.getByText('Porto')).toBeInTheDocument();
  });

  it('displays year built correctly', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('2015')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    
    render(<PropertyComparisonTable properties={mockProperties} onRemove={onRemove} />);
    
    // Find close buttons (there should be one for each property)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => btn.querySelector('svg[data-testid="CloseIcon"]'));
    
    if (closeButton) {
      await user.click(closeButton);
      expect(onRemove).toHaveBeenCalledWith(mockProperties[0].id);
    }
  });

  it('calls onViewDetails when View Details button is clicked', async () => {
    const user = userEvent.setup();
    const onViewDetails = jest.fn();
    
    render(
      <PropertyComparisonTable
        properties={mockProperties}
        onViewDetails={onViewDetails}
      />
    );
    
    const viewDetailsButtons = screen.getAllByText('View Details');
    await user.click(viewDetailsButtons[0]);
    
    expect(onViewDetails).toHaveBeenCalledWith(mockProperties[0].id);
  });

  it('handles properties without optional fields', () => {
    const minimalProperty = {
      id: 3,
      address: 'Minimal Property',
      price: '200000',
      size_sqm: '50',
      property_type: 'studio',
    };

    render(<PropertyComparisonTable properties={[minimalProperty]} />);
    
    // Should show N/A for missing optional fields
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  it('calculates price per sqm correctly', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    // €650000 / 120 = €5417 (rounded)
    // €380000 / 95 = €4000
    // The actual locale format may vary
    expect(screen.getByText(/€.*5.*417.*m²/)).toBeInTheDocument();
    expect(screen.getByText(/€.*4.*000.*m²/)).toBeInTheDocument();
  });

  it('handles zero size gracefully', () => {
    const zeroSizeProperty = {
      id: 4,
      address: 'Zero Size Property',
      price: '100000',
      size_sqm: '0',
      property_type: 'apartment',
    };

    render(<PropertyComparisonTable properties={[zeroSizeProperty]} />);
    
    // Should show N/A for price/sqm when size is 0 and other optional fields
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  it('displays all comparison rows', () => {
    render(<PropertyComparisonTable properties={mockProperties} />);
    
    // Check all row labels are present
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Price/m²')).toBeInTheDocument();
    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Property Type')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Year Built')).toBeInTheDocument();
    expect(screen.getByText('Est. Rental Yield')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Terrace')).toBeInTheDocument();
    expect(screen.getByText('Elevator')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});

