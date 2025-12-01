import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import LoginPage from '../page';

describe('Login Page', () => {
  it('renders login heading', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders login form placeholder text', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login form will be displayed here.')).toBeInTheDocument();
  });

  it('renders in a container', () => {
    const { container } = render(<LoginPage />);
    const containerElement = container.querySelector('.MuiContainer-root');
    expect(containerElement).toBeInTheDocument();
  });
});



