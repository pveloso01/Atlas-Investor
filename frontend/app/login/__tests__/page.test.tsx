import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { authApi } from '@/lib/store/api/authApi';

// Mock the authApi
jest.mock('@/lib/store/api/authApi', () => ({
  authApi: {
    useLoginMutation: jest.fn(),
  },
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Login Page', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (authApi.useLoginMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { isLoading: false },
    ]);

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders login heading', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome back to Atlas Investor')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Don't have an account?/)).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email and password are required.')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      unwrap: async () => ({ access: 'token', refresh: 'refresh' }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue({
      status: 401,
      data: { error: 'Invalid email or password.' },
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
  });

  it('displays account locked error', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue({
      status: 423,
      data: { error: 'Account is temporarily locked. Please try again later.' },
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account is temporarily locked. Please try again later.')).toBeInTheDocument();
    });
  });

  it('displays account not active error', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue({
      status: 403,
      data: { error: 'Account is not active. Please activate your account first.' },
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account is not active. Please activate your account first.')).toBeInTheDocument();
    });
  });

  it('shows loading state during login', () => {
    (authApi.useLoginMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { isLoading: true },
    ]);

    render(<LoginPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders in a container', () => {
    const { container } = render(<LoginPage />);
    const containerElement = container.querySelector('.MuiContainer-root');
    expect(containerElement).toBeInTheDocument();
  });
});
