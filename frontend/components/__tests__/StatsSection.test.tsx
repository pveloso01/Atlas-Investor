import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import StatsSection from '../Landing/StatsSection';

describe('StatsSection', () => {
  it('renders section title', () => {
    render(<StatsSection />);
    expect(screen.getByText('Proven Results')).toBeInTheDocument();
  });

  it('displays all statistics', () => {
    render(<StatsSection />);
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('1,000+')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('displays statistic labels', () => {
    render(<StatsSection />);
    expect(screen.getByText('Deals Analyzed')).toBeInTheDocument();
    expect(screen.getByText('Average ROI Improvement')).toBeInTheDocument();
    expect(screen.getByText('Active Investors')).toBeInTheDocument();
    expect(screen.getByText('Data Accuracy')).toBeInTheDocument();
  });
});

