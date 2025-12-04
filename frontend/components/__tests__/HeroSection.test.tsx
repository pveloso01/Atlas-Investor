import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import HeroSection from '../Landing/HeroSection';

// Mock the property API
jest.mock('@/lib/store/api/propertyApi', () => ({
  useGetPropertiesQuery: () => ({
    data: { results: [] },
    isLoading: false,
    error: null,
  }),
}));

describe('HeroSection', () => {
  it('renders main headline', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Discover and Analyze the Best Property Deals in Portugal/)).toBeInTheDocument();
  });

  it('renders subheadline', () => {
    render(<HeroSection />);
    expect(screen.getByText(/All in One Place/)).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    render(<HeroSection />);
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });
});

