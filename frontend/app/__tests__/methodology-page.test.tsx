import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import MethodologyPage from '../about/methodology/page';

describe('MethodologyPage', () => {
  it('renders page title', () => {
    render(<MethodologyPage />);
    expect(screen.getByText('Data & Methodology')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<MethodologyPage />);
    expect(screen.getByText(/Transparency in how we collect/)).toBeInTheDocument();
  });

  it('displays data sources section', () => {
    render(<MethodologyPage />);
    expect(screen.getByText('Data Sources')).toBeInTheDocument();
    expect(screen.getByText('Portuguese Government APIs')).toBeInTheDocument();
    expect(screen.getByText('Idealista')).toBeInTheDocument();
  });

  it('displays update frequency section', () => {
    render(<MethodologyPage />);
    expect(screen.getByText('Update Frequency')).toBeInTheDocument();
    expect(screen.getByText('Property Listings')).toBeInTheDocument();
  });

  it('displays analysis methodology section', () => {
    render(<MethodologyPage />);
    expect(screen.getByText('Analysis Methodology')).toBeInTheDocument();
    expect(screen.getByText('Historical Market Data')).toBeInTheDocument();
  });
});

