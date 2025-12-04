import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import Home from '../page';

// Mock the property API
jest.mock('@/lib/store/api/propertyApi', () => ({
  useGetPropertiesQuery: () => ({
    data: { results: [] },
    isLoading: false,
    error: null,
  }),
}));

describe('Home', () => {
  it('renders hero section', () => {
    render(<Home />);
    expect(screen.getByText(/Discover and Analyze the Best Property Deals in Portugal/)).toBeInTheDocument();
  });

  it('renders features section', () => {
    render(<Home />);
    expect(screen.getByText('Everything You Need to Invest Smarter')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    render(<Home />);
    expect(screen.getByText('Proven Results')).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    render(<Home />);
    expect(screen.getByText('Trusted by Real Estate Professionals')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<Home />);
    expect(screen.getByText('Ready to Find Your Next Investment?')).toBeInTheDocument();
  });
});

