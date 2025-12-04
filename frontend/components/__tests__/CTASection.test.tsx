import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import CTASection from '../Landing/CTASection';

describe('CTASection', () => {
  it('renders CTA title', () => {
    render(<CTASection />);
    expect(screen.getByText('Ready to Find Your Next Investment?')).toBeInTheDocument();
  });

  it('renders CTA description', () => {
    render(<CTASection />);
    expect(screen.getByText(/Join thousands of investors/)).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    render(<CTASection />);
    expect(screen.getByText('Start Your Free Trial')).toBeInTheDocument();
  });
});

