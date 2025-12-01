import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import InvestmentMetrics from '../PropertyDetails/InvestmentMetrics';

describe('InvestmentMetrics', () => {
  it('renders investment metrics title', () => {
    render(<InvestmentMetrics />);
    expect(screen.getByText('Investment Metrics')).toBeInTheDocument();
  });

  it('displays ROI', () => {
    render(<InvestmentMetrics roi={12.5} />);
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });

  it('displays rental yield', () => {
    render(<InvestmentMetrics yield={5.2} />);
    expect(screen.getByText('5.2%')).toBeInTheDocument();
  });

  it('displays monthly cash flow', () => {
    render(<InvestmentMetrics cashFlow={800} />);
    expect(screen.getByText(/€800/)).toBeInTheDocument();
  });

  it('displays occupancy rate', () => {
    render(<InvestmentMetrics occupancyRate={95} />);
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('displays payback period', () => {
    render(<InvestmentMetrics paybackPeriod={8} />);
    expect(screen.getByText('8 years')).toBeInTheDocument();
  });

  it('displays all metrics', () => {
    render(
      <InvestmentMetrics
        roi={12.5}
        yield={5.2}
        cashFlow={800}
        occupancyRate={95}
        paybackPeriod={8}
      />
    );
    expect(screen.getByText('ROI')).toBeInTheDocument();
    expect(screen.getByText('Rental Yield')).toBeInTheDocument();
    expect(screen.getByText('Monthly Cash Flow')).toBeInTheDocument();
    expect(screen.getByText('Occupancy Rate')).toBeInTheDocument();
    expect(screen.getByText('Payback Period')).toBeInTheDocument();
  });

  it('displays metric descriptions', () => {
    render(<InvestmentMetrics roi={12.5} yield={5.2} />);
    expect(screen.getByText('Return on Investment')).toBeInTheDocument();
    expect(screen.getByText('Annual rental income / Property value')).toBeInTheDocument();
  });

  it('shows success color for high ROI', () => {
    render(<InvestmentMetrics roi={12.5} />);
    // ROI > 10 should show success color
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });

  it('shows warning color for low ROI', () => {
    render(<InvestmentMetrics roi={8} />);
    // ROI <= 10 should show warning color
    expect(screen.getByText('8.0%')).toBeInTheDocument();
  });

  it('shows success color for high rental yield', () => {
    render(<InvestmentMetrics yield={6} />);
    // Yield > 5 should show success color
    expect(screen.getByText('6.0%')).toBeInTheDocument();
  });

  it('shows warning color for low rental yield', () => {
    render(<InvestmentMetrics yield={4} />);
    // Yield <= 5 should show warning color
    expect(screen.getByText('4.0%')).toBeInTheDocument();
  });

  it('shows success color for positive cash flow', () => {
    render(<InvestmentMetrics cashFlow={500} />);
    // Cash flow > 0 should show success color
    expect(screen.getByText(/€500/)).toBeInTheDocument();
  });

  it('shows error color for negative cash flow', () => {
    render(<InvestmentMetrics cashFlow={-100} />);
    // Cash flow <= 0 should show error color
    expect(screen.getByText(/-100/)).toBeInTheDocument();
  });

  it('shows success color for high occupancy rate', () => {
    render(<InvestmentMetrics occupancyRate={95} />);
    // Occupancy > 90 should show success color
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('shows warning color for low occupancy rate', () => {
    render(<InvestmentMetrics occupancyRate={80} />);
    // Occupancy <= 90 should show warning color
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('shows success color for short payback period', () => {
    render(<InvestmentMetrics paybackPeriod={8} />);
    // Payback < 10 should show success color
    expect(screen.getByText('8 years')).toBeInTheDocument();
  });

  it('shows warning color for long payback period', () => {
    render(<InvestmentMetrics paybackPeriod={12} />);
    // Payback >= 10 should show warning color
    expect(screen.getByText('12 years')).toBeInTheDocument();
  });

  it('displays trend indicators', () => {
    render(<InvestmentMetrics roi={12.5} yield={6} cashFlow={800} />);
    // Should display trend indicators for metrics
    expect(screen.getByText('ROI')).toBeInTheDocument();
  });

  it('displays up trend for positive cash flow', () => {
    render(<InvestmentMetrics cashFlow={800} />);
    // Positive cash flow should show up trend
    expect(screen.getByText('Monthly Cash Flow')).toBeInTheDocument();
  });

  it('displays down trend for negative cash flow', () => {
    render(<InvestmentMetrics cashFlow={-100} />);
    // Negative cash flow should show down trend
    expect(screen.getByText(/-100/)).toBeInTheDocument();
  });

  it('displays neutral trend for metrics without trend', () => {
    render(<InvestmentMetrics roi={8} yield={4} occupancyRate={80} paybackPeriod={12} />);
    // Metrics with neutral trend should not show trend icon
    expect(screen.getByText('ROI')).toBeInTheDocument();
  });
});

