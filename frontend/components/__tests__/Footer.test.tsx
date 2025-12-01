import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import Footer from '../Layout/Footer';

describe('Footer', () => {
  it('renders footer with company name', () => {
    render(<Footer />);
    expect(screen.getByText('Atlas Investor')).toBeInTheDocument();
  });

  it('renders platform links', () => {
    render(<Footer />);
    expect(screen.getByText('Find Deals')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('renders resource links', () => {
    render(<Footer />);
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders company links', () => {
    render(<Footer />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Methodology')).toBeInTheDocument();
    expect(screen.getByText('Why Trust Us')).toBeInTheDocument();
  });

  it('renders copyright notice', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Atlas Investor`))).toBeInTheDocument();
  });

  it('renders trust badges', () => {
    render(<Footer />);
    expect(screen.getByText('SSL Encrypted')).toBeInTheDocument();
    expect(screen.getByText('GDPR Compliant')).toBeInTheDocument();
  });

  it('renders social proof', () => {
    render(<Footer />);
    expect(screen.getByText(/Trusted by 1,000\+ investors/)).toBeInTheDocument();
  });
});

