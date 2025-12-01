import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import Home from '../page';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock the property API
jest.mock('@/lib/store/api/propertyApi', () => ({
  useGetPropertiesQuery: jest.fn(() => ({
    data: { results: [] },
    isLoading: false,
    error: null,
  })),
}));

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Home />);
    expect(screen.getByText(/Discover and Analyze the Best Property Deals in Portugal/i)).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Home />);
    expect(screen.getByText(/All in One Place/i)).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    render(<Home />);
    const getStartedButton = screen.getByText('Get Started Free');
    expect(getStartedButton).toBeInTheDocument();
  });

  it('Get Started button links to /signup', () => {
    render(<Home />);
    const getStartedButton = screen.getByText('Get Started Free').closest('a');
    expect(getStartedButton).toHaveAttribute('href', '/signup');
  });
});

