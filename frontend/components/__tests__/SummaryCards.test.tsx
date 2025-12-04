import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import SummaryCards from '../Dashboard/SummaryCards';
import { Property } from '@/types/property';

const mockProperties: Property[] = [
  {
    id: 1,
    address: 'Property 1',
    price: '200000',
    size_sqm: '80',
    property_type: 'apartment',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 2,
    address: 'Property 2',
    price: '300000',
    size_sqm: '100',
    property_type: 'apartment',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('SummaryCards', () => {
  it('renders all summary cards', () => {
    render(<SummaryCards properties={mockProperties} averageYield={5.5} averageROI={12} />);
    expect(screen.getByText('Deals Found')).toBeInTheDocument();
    expect(screen.getByText('Average Yield')).toBeInTheDocument();
    expect(screen.getByText('Average ROI')).toBeInTheDocument();
    expect(screen.getByText('Avg. Price')).toBeInTheDocument();
  });

  it('displays correct number of deals', () => {
    render(<SummaryCards properties={mockProperties} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays average yield', () => {
    render(<SummaryCards properties={mockProperties} averageYield={5.5} />);
    expect(screen.getByText('5.5%')).toBeInTheDocument();
  });

  it('displays average ROI', () => {
    render(<SummaryCards properties={mockProperties} averageROI={12} />);
    expect(screen.getByText('12.0%')).toBeInTheDocument();
  });

  it('calculates and displays average price', () => {
    render(<SummaryCards properties={mockProperties} />);
    // Average of 200000 and 300000 is 250000
    // Portuguese locale formats as EUR with different separators
    expect(screen.getByText(/250/)).toBeInTheDocument();
  });

  it('handles empty properties array', () => {
    render(<SummaryCards properties={[]} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
