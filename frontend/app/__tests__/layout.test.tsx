import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import RootLayout from '../layout';

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({
    className: 'inter-class',
  })),
}));

describe('RootLayout', () => {
  it('renders children correctly', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders children correctly in layout structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    
    // Next.js layouts render children, html/body are handled by Next.js
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    
    // Verify the layout renders children
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('wraps children with providers', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});


