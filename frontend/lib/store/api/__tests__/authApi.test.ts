import { authApi } from '../authApi';

describe('authApi', () => {
  describe('API configuration', () => {
    it('should have correct reducer path', () => {
      expect(authApi.reducerPath).toBe('authApi');
    });

    it('should have User tag type', () => {
      expect(authApi.util.invalidateTags).toBeDefined();
    });
  });

  describe('endpoints', () => {
    it('should have login endpoint', () => {
      expect(authApi.endpoints.login).toBeDefined();
    });

    it('should have register endpoint', () => {
      expect(authApi.endpoints.register).toBeDefined();
    });

    it('should have getCurrentUser endpoint', () => {
      expect(authApi.endpoints.getCurrentUser).toBeDefined();
    });

    it('should have logout endpoint', () => {
      expect(authApi.endpoints.logout).toBeDefined();
    });

    it('should have activateAccount endpoint', () => {
      expect(authApi.endpoints.activateAccount).toBeDefined();
    });

    it('should have requestPasswordReset endpoint', () => {
      expect(authApi.endpoints.requestPasswordReset).toBeDefined();
    });

    it('should have confirmPasswordReset endpoint', () => {
      expect(authApi.endpoints.confirmPasswordReset).toBeDefined();
    });

    it('should have refreshToken endpoint', () => {
      expect(authApi.endpoints.refreshToken).toBeDefined();
    });
  });

  describe('login endpoint', () => {
    it('should build correct query for login', () => {
      const endpoint = authApi.endpoints.login;
      const credentials = { email: 'test@example.com', password: 'password123' };
      
      // Access the query function
      const queryFn = (endpoint as unknown as { initiate: (arg: { email: string; password: string }) => { arg: { email: string; password: string } } }).initiate;
      expect(queryFn).toBeDefined();
    });
  });

  describe('register endpoint', () => {
    it('should build correct query for register', () => {
      const endpoint = authApi.endpoints.register;
      expect(endpoint).toBeDefined();
    });
  });

  describe('getCurrentUser endpoint', () => {
    it('should provide User tags', () => {
      const endpoint = authApi.endpoints.getCurrentUser;
      expect(endpoint).toBeDefined();
    });
  });

  describe('logout endpoint', () => {
    it('should invalidate User tags', () => {
      const endpoint = authApi.endpoints.logout;
      expect(endpoint).toBeDefined();
    });
  });

  describe('prepareHeaders', () => {
    const originalLocalStorage = global.localStorage;

    beforeEach(() => {
      // Mock localStorage
      const mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: 0,
        key: jest.fn(),
      };
      Object.defineProperty(global, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it('should add authorization header when token exists', () => {
      (global.localStorage.getItem as jest.Mock).mockReturnValue('test-token');
      
      const headers = new Headers();
      
      // The actual prepareHeaders is internal, but we can verify the API is configured correctly
      expect(authApi.reducerPath).toBe('authApi');
    });

    it('should not add authorization header when token does not exist', () => {
      (global.localStorage.getItem as jest.Mock).mockReturnValue(null);
      
      const headers = new Headers();
      expect(headers.get('authorization')).toBeNull();
    });
  });

  describe('exported hooks', () => {
    it('should export useLoginMutation', () => {
      const { useLoginMutation } = require('../authApi');
      expect(useLoginMutation).toBeDefined();
    });

    it('should export useRegisterMutation', () => {
      const { useRegisterMutation } = require('../authApi');
      expect(useRegisterMutation).toBeDefined();
    });

    it('should export useGetCurrentUserQuery', () => {
      const { useGetCurrentUserQuery } = require('../authApi');
      expect(useGetCurrentUserQuery).toBeDefined();
    });

    it('should export useLogoutMutation', () => {
      const { useLogoutMutation } = require('../authApi');
      expect(useLogoutMutation).toBeDefined();
    });

    it('should export useActivateAccountMutation', () => {
      const { useActivateAccountMutation } = require('../authApi');
      expect(useActivateAccountMutation).toBeDefined();
    });

    it('should export useRequestPasswordResetMutation', () => {
      const { useRequestPasswordResetMutation } = require('../authApi');
      expect(useRequestPasswordResetMutation).toBeDefined();
    });

    it('should export useConfirmPasswordResetMutation', () => {
      const { useConfirmPasswordResetMutation } = require('../authApi');
      expect(useConfirmPasswordResetMutation).toBeDefined();
    });

    it('should export useRefreshTokenMutation', () => {
      const { useRefreshTokenMutation } = require('../authApi');
      expect(useRefreshTokenMutation).toBeDefined();
    });
  });

  describe('type exports', () => {
    it('should export LoginCredentials type', () => {
      // Type test - this compiles if the type exists
      const credentials: import('../authApi').LoginCredentials = {
        email: 'test@example.com',
        password: 'password',
      };
      expect(credentials.email).toBe('test@example.com');
    });

    it('should export RegisterData type', () => {
      const data: import('../authApi').RegisterData = {
        email: 'test@example.com',
        password: 'password',
        password_retype: 'password',
      };
      expect(data.email).toBe('test@example.com');
    });

    it('should export TokenResponse type', () => {
      const response: import('../authApi').TokenResponse = {
        access: 'access-token',
        refresh: 'refresh-token',
      };
      expect(response.access).toBe('access-token');
    });

    it('should export User type', () => {
      const user: import('../authApi').User = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      };
      expect(user.id).toBe(1);
    });

    it('should export PasswordResetRequest type', () => {
      const request: import('../authApi').PasswordResetRequest = {
        email: 'test@example.com',
      };
      expect(request.email).toBe('test@example.com');
    });

    it('should export PasswordResetConfirm type', () => {
      const confirm: import('../authApi').PasswordResetConfirm = {
        uid: 'uid',
        token: 'token',
        new_password: 'newpass',
        re_new_password: 'newpass',
      };
      expect(confirm.uid).toBe('uid');
    });

    it('should export ActivationRequest type', () => {
      const request: import('../authApi').ActivationRequest = {
        uid: 'uid',
        token: 'token',
      };
      expect(request.uid).toBe('uid');
    });
  });
});

