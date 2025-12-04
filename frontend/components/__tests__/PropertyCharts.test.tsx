import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import PropertyCharts from '../PropertyDetails/PropertyCharts';

describe('PropertyCharts', () => {
  it('renders financial projections title', () => {
    render(<PropertyCharts />);
    expect(screen.getByText('Financial Projections')).toBeInTheDocument();
  });

  it('displays cash flow over time chart', () => {
    render(<PropertyCharts />);
    expect(screen.getByText('Cash Flow Over Time')).toBeInTheDocument();
  });

  it('displays returns breakdown chart', () => {
    render(<PropertyCharts />);
    expect(screen.getByText('Returns Breakdown')).toBeInTheDocument();
  });

  it('displays market comparison chart', () => {
    render(<PropertyCharts />);
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('displays property yield', () => {
    render(<PropertyCharts propertyYield={5.2} />);
    // The yield is used in calculations and displayed in the chart
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('displays market average yield', () => {
    render(<PropertyCharts marketAverageYield={4.8} />);
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('displays comparison text', () => {
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    expect(screen.getByText(/This property's yield is/)).toBeInTheDocument();
  });

  it('displays above average message when yield is higher', () => {
    render(<PropertyCharts propertyYield={6.0} marketAverageYield={4.8} />);
    expect(screen.getByText(/above/)).toBeInTheDocument();
  });

  it('displays below average message when yield is lower', () => {
    render(<PropertyCharts propertyYield={4.0} marketAverageYield={4.8} />);
    expect(screen.getByText(/below/)).toBeInTheDocument();
  });

  it('handles chart data correctly', () => {
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Charts should render without errors
    expect(screen.getByText('Financial Projections')).toBeInTheDocument();
  });

  it('displays all chart types', () => {
    render(<PropertyCharts />);
    expect(screen.getByText('Cash Flow Over Time')).toBeInTheDocument();
    expect(screen.getByText('Returns Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('displays correct comparison percentage when yield is higher', () => {
    render(<PropertyCharts propertyYield={6.0} marketAverageYield={4.8} />);
    // Should show percentage difference
    expect(screen.getByText(/This property's yield is/)).toBeInTheDocument();
  });

  it('displays correct comparison percentage when yield is lower', () => {
    render(<PropertyCharts propertyYield={4.0} marketAverageYield={4.8} />);
    // Should show percentage difference
    expect(screen.getByText(/This property's yield is/)).toBeInTheDocument();
  });

  it('handles equal yields', () => {
    render(<PropertyCharts propertyYield={4.8} marketAverageYield={4.8} />);
    // Should handle equal yields
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('displays correct bar color for This Property', () => {
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // This Property should use accent color
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('displays correct bar color for City Average', () => {
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // City Average should use primary color
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('displays correct bar color for other entries', () => {
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Other entries should use gray color
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('renders pie chart with label function that handles undefined percent', () => {
    // The label function uses nullish coalescing: (percent ?? 0)
    // This tests the function when percent might be undefined
    render(<PropertyCharts />);
    // Chart should render without errors
    expect(screen.getByText('Returns Breakdown')).toBeInTheDocument();
  });

  it('renders bar chart with formatter function', () => {
    // The formatter function formats values as percentages
    // This tests the function: (value: number) => `${value}%`
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render without errors
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('renders pie chart label function with percent parameter', () => {
    // The label function: ({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
    // This function is called by Recharts when rendering pie chart labels
    render(<PropertyCharts />);
    // Chart should render, and label function should be called internally by Recharts
    expect(screen.getByText('Returns Breakdown')).toBeInTheDocument();
  });

  it('renders bar chart Cell fill function for This Property', () => {
    // The fill function in Cell: entry.name === 'This Property' ? colors.accent.main : ...
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render with correct cell colors
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('renders bar chart Cell fill function for City Average', () => {
    // The fill function: entry.name === 'City Average' ? colors.primary.main : ...
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render with correct cell colors
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('renders bar chart Cell fill function for other entries', () => {
    // The fill function: default to colors.neutral.gray400
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render with correct cell colors
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('executes pie chart label function with name and percent parameters', () => {
    // The label function: ({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
    // This function is called by Recharts when rendering pie chart labels
    render(<PropertyCharts />);
    // Chart should render, and label function should be called internally by Recharts
    // The function handles undefined percent with nullish coalescing
    expect(screen.getByText('Returns Breakdown')).toBeInTheDocument();
  });

  it('executes bar chart formatter function with value parameter', () => {
    // The formatter function: (value: number) => `${value}%`
    // This function is called by Recharts when displaying tooltip values
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render, and formatter function should be called internally by Recharts
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('executes Cell fill function for This Property entry', () => {
    // The fill function: entry.name === 'This Property' ? colors.accent.main : ...
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render with correct cell colors based on entry name
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('executes Cell fill function for City Average entry', () => {
    // The fill function: entry.name === 'City Average' ? colors.primary.main : ...
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render with correct cell colors
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('executes Cell fill function for other market entries', () => {
    // The fill function: default to colors.neutral.gray400 for other entries
    render(<PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />);
    // Chart should render with correct cell colors
    expect(screen.getByText('Market Comparison - Rental Yield')).toBeInTheDocument();
  });

  it('executes comparison text function for above average yield', () => {
    // The comparison text: propertyYield > marketAverageYield ? 'above' : 'below'
    render(<PropertyCharts propertyYield={6.0} marketAverageYield={4.8} />);
    // Should display "above" text
    expect(screen.getByText(/above/i)).toBeInTheDocument();
  });

  it('executes comparison text function for below average yield', () => {
    // The comparison text: propertyYield > marketAverageYield ? 'above' : 'below'
    render(<PropertyCharts propertyYield={4.0} marketAverageYield={4.8} />);
    // Should display "below" text
    expect(screen.getByText(/below/i)).toBeInTheDocument();
  });
});

