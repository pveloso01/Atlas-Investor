import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import MarketComparison from '../PropertyDetails/MarketComparison';
import { Property } from '@/types/property';

const mockComparableProperties: Property[] = [
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
    price: '250000',
    size_sqm: '90',
    property_type: 'apartment',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('MarketComparison', () => {
  it('renders market comparison title', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText('Market Comparison')).toBeInTheDocument();
  });

  it('displays percentile rank', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText('85th')).toBeInTheDocument();
  });

  it('displays property yield', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText('5.2%')).toBeInTheDocument();
  });

  it('displays comparable properties when provided', () => {
    render(
      <MarketComparison
        propertyYield={5.2}
        percentileRank={85}
        comparableProperties={mockComparableProperties}
      />
    );
    expect(screen.getByText('Similar Deals')).toBeInTheDocument();
  });

  it('does not display comparable properties section when empty', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.queryByText('Similar Deals')).not.toBeInTheDocument();
  });

  it('displays correct percentile label for top 10%', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={95} />);
    expect(screen.getByText('Top 10%')).toBeInTheDocument();
  });

  it('displays correct percentile label for top 25%', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={80} />);
    expect(screen.getByText('Top 25%')).toBeInTheDocument();
  });

  it('displays correct percentile label for above average', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={60} />);
    expect(screen.getByText('Above Average')).toBeInTheDocument();
  });

  it('displays correct percentile label for below average', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={30} />);
    expect(screen.getByText('Below Average')).toBeInTheDocument();
  });

  it('displays correct percentile label for bottom 25%', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={20} />);
    expect(screen.getByText('Bottom 25%')).toBeInTheDocument();
  });

  it('displays market average yield', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText('4.8%')).toBeInTheDocument();
  });

  it('displays top 10% average yield', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText('7.5%')).toBeInTheDocument();
  });

  it('displays market ranking section', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText('Market Ranking')).toBeInTheDocument();
  });

  it('displays yield comparison section', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText('Yield Comparison')).toBeInTheDocument();
  });

  it('displays percentile rank correctly', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={75} />);
    expect(screen.getByText('75th')).toBeInTheDocument();
  });

  it('displays percentile description', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    expect(screen.getByText(/This property's yield is in the/)).toBeInTheDocument();
  });

  it('displays progress bar with correct color for high percentile', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={85} />);
    // High percentile should show success color
    expect(screen.getByText('85th')).toBeInTheDocument();
  });

  it('displays progress bar with warning color for medium percentile', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={60} />);
    // Medium percentile should show warning color
    expect(screen.getByText('60th')).toBeInTheDocument();
  });

  it('displays progress bar with error color for low percentile', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={20} />);
    // Low percentile should show error color
    expect(screen.getByText('20th')).toBeInTheDocument();
  });

  it('displays progress bar with success color for percentile >= 75', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={80} />);
    // Percentile >= 75 should show success color
    expect(screen.getByText('80th')).toBeInTheDocument();
  });

  it('displays progress bar with warning color for 50 <= percentile < 75', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={60} />);
    // Percentile between 50 and 75 should show warning color
    expect(screen.getByText('60th')).toBeInTheDocument();
  });

  it('displays progress bar with error color for percentile < 50', () => {
    render(<MarketComparison propertyYield={5.2} percentileRank={30} />);
    // Percentile < 50 should show error color
    expect(screen.getByText('30th')).toBeInTheDocument();
  });
});

