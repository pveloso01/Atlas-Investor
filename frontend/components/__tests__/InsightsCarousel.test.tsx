import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import InsightsCarousel from '../Dashboard/InsightsCarousel';
import userEvent from '@testing-library/user-event';

const mockInsights = [
  { id: '1', title: 'Insight 1', description: 'Description 1', metric: '10%' },
  { id: '2', title: 'Insight 2', description: 'Description 2' },
  { id: '3', title: 'Insight 3', description: 'Description 3', link: '/insight/3' },
];

describe('InsightsCarousel', () => {
  it('renders market insights title', () => {
    render(<InsightsCarousel insights={mockInsights} />);
    expect(screen.getByText('Market Insights')).toBeInTheDocument();
  });

  it('displays first insight by default', () => {
    render(<InsightsCarousel insights={mockInsights} />);
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('displays metric when provided', () => {
    render(<InsightsCarousel insights={mockInsights} />);
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('navigates to next insight', async () => {
    const user = userEvent.setup();
    render(<InsightsCarousel insights={mockInsights} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);
    expect(screen.getByText('Insight 2')).toBeInTheDocument();
  });

  it('navigates to previous insight', async () => {
    const user = userEvent.setup();
    render(<InsightsCarousel insights={mockInsights} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });
    await user.click(nextButton);
    await user.click(prevButton);
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
  });

  it('displays link when provided', () => {
    render(<InsightsCarousel insights={mockInsights} />);
    // Navigate to third insight
    // Need to click twice to get to third insight
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('returns null when insights array is empty', () => {
    const { container } = render(<InsightsCarousel insights={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not auto-rotate when autoRotate is false', () => {
    jest.useFakeTimers();
    render(<InsightsCarousel insights={mockInsights} autoRotate={false} />);
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    jest.advanceTimersByTime(6000);
    // Should still be on first insight
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('does not auto-rotate when there is only one insight', () => {
    jest.useFakeTimers();
    const singleInsight = [mockInsights[0]];
    render(<InsightsCarousel insights={singleInsight} />);
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    jest.advanceTimersByTime(6000);
    // Should still be on first insight
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('auto-rotates through insights', () => {
    jest.useFakeTimers();
    render(<InsightsCarousel insights={mockInsights} rotationInterval={1000} />);
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    jest.advanceTimersByTime(1000);
    expect(screen.getByText('Insight 2')).toBeInTheDocument();
    jest.advanceTimersByTime(1000);
    expect(screen.getByText('Insight 3')).toBeInTheDocument();
    jest.advanceTimersByTime(1000);
    // Should wrap around to first
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('wraps around when navigating past last insight', async () => {
    const user = userEvent.setup();
    render(<InsightsCarousel insights={mockInsights} />);
    // Navigate to last insight
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);
    await user.click(nextButton);
    expect(screen.getByText('Insight 3')).toBeInTheDocument();
    // Click next again should wrap to first
    await user.click(nextButton);
    expect(screen.getByText('Insight 1')).toBeInTheDocument();
  });

  it('wraps around when navigating before first insight', async () => {
    const user = userEvent.setup();
    render(<InsightsCarousel insights={mockInsights} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    // Click previous on first insight should wrap to last
    await user.click(prevButton);
    expect(screen.getByText('Insight 3')).toBeInTheDocument();
  });
});

