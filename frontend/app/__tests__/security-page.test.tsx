import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import SecurityPage from '../security/page';

describe('SecurityPage', () => {
  it('renders page title', () => {
    render(<SecurityPage />);
    expect(screen.getByText('Security & Privacy')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<SecurityPage />);
    expect(screen.getByText(/Your data and privacy are our top priorities/)).toBeInTheDocument();
  });

  it('displays security features', () => {
    render(<SecurityPage />);
    expect(screen.getByText('SSL Encryption')).toBeInTheDocument();
    expect(screen.getByText('GDPR Compliant')).toBeInTheDocument();
    expect(screen.getByText('Secure Payment Processing')).toBeInTheDocument();
    expect(screen.getByText('Regular Security Audits')).toBeInTheDocument();
  });

  it('displays trust badges section', () => {
    render(<SecurityPage />);
    expect(screen.getByText('Trust Badges & Certifications')).toBeInTheDocument();
    expect(screen.getByText('SSL Certificate')).toBeInTheDocument();
  });
});

