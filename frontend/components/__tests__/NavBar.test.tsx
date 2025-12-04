import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import NavBar from '../Navigation/NavBar';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/properties',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('NavBar', () => {
  it('renders company name', () => {
    render(<NavBar />);
    const companyNames = screen.getAllByText('Atlas Investor');
    expect(companyNames.length).toBeGreaterThan(0);
  });

  it('renders navigation items', () => {
    render(<NavBar />);
    const findDeals = screen.getAllByText('Find Deals');
    expect(findDeals.length).toBeGreaterThan(0);
    expect(screen.getByText('Analyze Markets')).toBeInTheDocument();
    expect(screen.getByText('My Portfolio')).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<NavBar />);
    const loginButtons = screen.getAllByText('Login');
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  it('opens mobile drawer when menu button is clicked', async () => {
    const user = userEvent.setup();
    render(<NavBar />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    // Drawer should be visible
    expect(screen.getByText('Atlas Investor')).toBeInTheDocument();
  });
});

