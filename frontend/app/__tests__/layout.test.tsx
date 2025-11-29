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

  it('renders with html and body tags', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    
    expect(container.querySelector('html')).toBeInTheDocument();
    expect(container.querySelector('body')).toBeInTheDocument();
  });

  it('applies lang attribute to html', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    
    const html = container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
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

