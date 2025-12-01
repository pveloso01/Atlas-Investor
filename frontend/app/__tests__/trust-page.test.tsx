import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import TrustPage from '../about/trust/page';

describe('TrustPage', () => {
  it('renders page title', () => {
    render(<TrustPage />);
    expect(screen.getByText('Why Trust Us')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<TrustPage />);
    expect(screen.getByText(/Building trust through transparency/)).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    render(<TrustPage />);
    expect(screen.getByText('1,000+')).toBeInTheDocument();
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('displays success stories section', () => {
    render(<TrustPage />);
    expect(screen.getByText('Success Stories')).toBeInTheDocument();
    expect(screen.getByText('From Zero to Five Properties')).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    render(<TrustPage />);
    expect(screen.getByText('What Our Users Say')).toBeInTheDocument();
  });
});

