import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import NavBar from '../Navigation/NavBar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/properties',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useMediaQuery to simulate different screen sizes
const mockUseMediaQuery = jest.fn();
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => mockUseMediaQuery(),
}));

describe('NavBar', () => {
  beforeEach(() => {
    // Default to desktop view
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('renders company name', () => {
    render(<NavBar />);
    const companyNames = screen.getAllByText('Atlas Investor');
    expect(companyNames.length).toBeGreaterThan(0);
  });

  it('renders navigation items on desktop', () => {
    mockUseMediaQuery.mockReturnValue(false); // Desktop
    render(<NavBar />);
    const findDeals = screen.getAllByText('Find Deals');
    expect(findDeals.length).toBeGreaterThan(0);
    // Use getAllByText for items that may appear multiple times
    const analyzeMarkets = screen.getAllByText('Analyze Markets');
    expect(analyzeMarkets.length).toBeGreaterThan(0);
    const portfolio = screen.getAllByText('My Portfolio');
    expect(portfolio.length).toBeGreaterThan(0);
  });

  it('renders login button on desktop', () => {
    mockUseMediaQuery.mockReturnValue(false); // Desktop
    render(<NavBar />);
    const loginButtons = screen.getAllByText('Login');
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  it('renders menu button on mobile', () => {
    mockUseMediaQuery.mockReturnValue(true); // Mobile
    render(<NavBar />);
    const menuButton = screen.getByRole('button', { name: /open drawer/i });
    expect(menuButton).toBeInTheDocument();
  });
});
