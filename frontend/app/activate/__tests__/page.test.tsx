import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import ActivateAccountPage from '../[uid]/[token]/page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({
    uid: 'test-uid-123',
    token: 'test-token-456',
  }),
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the auth API
const mockActivateAccount = jest.fn();

jest.mock('@/lib/store/api/authApi', () => ({
  authApi: {
    reducerPath: 'authApi',
    reducer: (state = {}) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
  useActivateAccountMutation: () => [mockActivateAccount, { isLoading: false }],
  useLoginMutation: () => [jest.fn(), { isLoading: false }],
  useRegisterMutation: () => [jest.fn(), { isLoading: false }],
  useGetCurrentUserQuery: () => ({ data: null, isLoading: false }),
  useLogoutMutation: () => [jest.fn(), { isLoading: false }],
  useRequestPasswordResetMutation: () => [jest.fn(), { isLoading: false }],
  useConfirmPasswordResetMutation: () => [jest.fn(), { isLoading: false }],
  useRefreshTokenMutation: () => [jest.fn(), { isLoading: false }],
}));

describe('ActivateAccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it('shows loading state initially', () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => new Promise(() => {}), // Never resolves
    });

    render(<ActivateAccountPage />);
    expect(screen.getByText('Activating Your Account')).toBeInTheDocument();
    expect(screen.getByText(/Please wait while we verify your email/i)).toBeInTheDocument();
  });

  it('shows success state after successful activation', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(screen.getByText('Account Activated!')).toBeInTheDocument();
    });

    expect(screen.getByText(/Your email has been verified/i)).toBeInTheDocument();
    expect(screen.getByText('Sign In Now')).toBeInTheDocument();
  });

  it('shows error state when activation fails', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.reject({ data: { detail: 'Token is invalid or expired' } }),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(screen.getByText('Activation Failed')).toBeInTheDocument();
    });

    expect(screen.getByText('Token is invalid or expired')).toBeInTheDocument();
    expect(screen.getByText('Register Again')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('shows error for invalid uid', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.reject({ data: { uid: ['Invalid uid'] } }),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(screen.getByText('Activation Failed')).toBeInTheDocument();
    });

    expect(screen.getByText('Invalid activation link.')).toBeInTheDocument();
  });

  it('shows error for invalid token', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.reject({ data: { token: ['Invalid token'] } }),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(screen.getByText('Activation Failed')).toBeInTheDocument();
    });

    expect(screen.getByText('This activation link has expired or is invalid.')).toBeInTheDocument();
  });

  it('navigates to login when Sign In button is clicked', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(screen.getByText('Sign In Now')).toBeInTheDocument();
    });

    screen.getByText('Sign In Now').click();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('navigates to register when Register Again button is clicked', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.reject({ data: { detail: 'Error' } }),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(screen.getByText('Register Again')).toBeInTheDocument();
    });

    screen.getByText('Register Again').click();
    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  it('calls activateAccount with uid and token from params', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(mockActivateAccount).toHaveBeenCalledWith({
        uid: 'test-uid-123',
        token: 'test-token-456',
      });
    });
  });

  it('shows return to home link', () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => new Promise(() => {}),
    });

    render(<ActivateAccountPage />);
    expect(screen.getByText('Return to Home')).toBeInTheDocument();
  });
});

describe('ActivateAccountPage - Generic Error', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows generic error message for unknown errors', async () => {
    mockActivateAccount.mockReturnValue({
      unwrap: () => Promise.reject({}),
    });

    render(<ActivateAccountPage />);

    await waitFor(() => {
      expect(screen.getByText('Activation Failed')).toBeInTheDocument();
    });

    expect(screen.getByText(/Account activation failed/i)).toBeInTheDocument();
  });
});

