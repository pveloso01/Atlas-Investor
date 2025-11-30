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

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Home />);
    expect(screen.getByText('Atlas Investor')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Home />);
    expect(screen.getByText('Real Estate Investment Platform for Portugal')).toBeInTheDocument();
  });

  it('renders Browse Properties button', () => {
    render(<Home />);
    const browseButton = screen.getByText('Browse Properties');
    expect(browseButton).toBeInTheDocument();
  });

  it('renders Login button', () => {
    render(<Home />);
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });

  it('Browse Properties button links to /properties', () => {
    render(<Home />);
    const browseButton = screen.getByText('Browse Properties').closest('a');
    expect(browseButton).toHaveAttribute('href', '/properties');
  });

  it('Login button links to /login', () => {
    render(<Home />);
    const loginButton = screen.getByText('Login').closest('a');
    expect(loginButton).toHaveAttribute('href', '/login');
  });
});

