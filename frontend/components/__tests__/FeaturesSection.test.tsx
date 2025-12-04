import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import FeaturesSection from '../Landing/FeaturesSection';

describe('FeaturesSection', () => {
  it('renders section title', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Everything You Need to Invest Smarter')).toBeInTheDocument();
  });

  it('renders section subtitle', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Powerful tools and analytics in one platform/)).toBeInTheDocument();
  });

  it('displays all features', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Map-based Deal Finder')).toBeInTheDocument();
    expect(screen.getByText('ROI & Yield Calculator')).toBeInTheDocument();
    expect(screen.getByText('Zoning & Feasibility Analysis')).toBeInTheDocument();
    expect(screen.getByText('Marketplace Listings')).toBeInTheDocument();
  });

  it('displays feature descriptions', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Explore properties on an interactive map/)).toBeInTheDocument();
    expect(screen.getByText(/Calculate rental yield/)).toBeInTheDocument();
  });
});

