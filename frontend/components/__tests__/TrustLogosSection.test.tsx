import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import TrustLogosSection from '../Landing/TrustLogosSection';

describe('TrustLogosSection', () => {
  it('renders section title', () => {
    render(<TrustLogosSection />);
    expect(screen.getByText('Trusted Data Sources')).toBeInTheDocument();
  });

  it('displays partner names', () => {
    render(<TrustLogosSection />);
    expect(screen.getByText('Portuguese Government')).toBeInTheDocument();
    expect(screen.getByText('Idealista')).toBeInTheDocument();
    expect(screen.getByText('INE Portugal')).toBeInTheDocument();
    expect(screen.getByText('Municipal Data')).toBeInTheDocument();
  });

  it('displays partner types', () => {
    render(<TrustLogosSection />);
    expect(screen.getByText('Data Source')).toBeInTheDocument();
    expect(screen.getByText('Property Listings')).toBeInTheDocument();
  });

  it('displays data source note', () => {
    render(<TrustLogosSection />);
    expect(screen.getByText(/Data powered by Portuguese Government APIs/)).toBeInTheDocument();
  });
});

