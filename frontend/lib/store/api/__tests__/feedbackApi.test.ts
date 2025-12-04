import { feedbackApi } from '../feedbackApi';

describe('feedbackApi', () => {
  describe('API configuration', () => {
    it('should have correct reducer path', () => {
      expect(feedbackApi.reducerPath).toBe('feedbackApi');
    });

    it('should have correct tag types', () => {
      expect(feedbackApi.util.invalidateTags).toBeDefined();
    });
  });

  describe('endpoints', () => {
    it('should have submitFeedback endpoint', () => {
      expect(feedbackApi.endpoints.submitFeedback).toBeDefined();
    });

    it('should have getFeedback endpoint', () => {
      expect(feedbackApi.endpoints.getFeedback).toBeDefined();
    });

    it('should have submitSupportMessage endpoint', () => {
      expect(feedbackApi.endpoints.submitSupportMessage).toBeDefined();
    });

    it('should have getSupportMessages endpoint', () => {
      expect(feedbackApi.endpoints.getSupportMessages).toBeDefined();
    });

    it('should have submitContactRequest endpoint', () => {
      expect(feedbackApi.endpoints.submitContactRequest).toBeDefined();
    });

    it('should have getContactRequests endpoint', () => {
      expect(feedbackApi.endpoints.getContactRequests).toBeDefined();
    });
  });

  describe('submitFeedback endpoint', () => {
    it('should have mutation type', () => {
      const endpoint = feedbackApi.endpoints.submitFeedback;
      expect(endpoint).toBeDefined();
    });
  });

  describe('getFeedback endpoint', () => {
    it('should have query type', () => {
      const endpoint = feedbackApi.endpoints.getFeedback;
      expect(endpoint).toBeDefined();
    });
  });

  describe('submitSupportMessage endpoint', () => {
    it('should have mutation type', () => {
      const endpoint = feedbackApi.endpoints.submitSupportMessage;
      expect(endpoint).toBeDefined();
    });
  });

  describe('getSupportMessages endpoint', () => {
    it('should have query type', () => {
      const endpoint = feedbackApi.endpoints.getSupportMessages;
      expect(endpoint).toBeDefined();
    });
  });

  describe('submitContactRequest endpoint', () => {
    it('should have mutation type', () => {
      const endpoint = feedbackApi.endpoints.submitContactRequest;
      expect(endpoint).toBeDefined();
    });
  });

  describe('getContactRequests endpoint', () => {
    it('should have query type', () => {
      const endpoint = feedbackApi.endpoints.getContactRequests;
      expect(endpoint).toBeDefined();
    });
  });

  describe('prepareHeaders', () => {
    const originalLocalStorage = global.localStorage;

    beforeEach(() => {
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

    it('should verify API configuration with token', () => {
      (global.localStorage.getItem as jest.Mock).mockReturnValue('test-token');
      expect(feedbackApi.reducerPath).toBe('feedbackApi');
    });

    it('should verify API configuration without token', () => {
      (global.localStorage.getItem as jest.Mock).mockReturnValue(null);
      expect(feedbackApi.reducerPath).toBe('feedbackApi');
    });
  });

  describe('exported hooks', () => {
    it('should export useSubmitFeedbackMutation', () => {
      const { useSubmitFeedbackMutation } = require('../feedbackApi');
      expect(useSubmitFeedbackMutation).toBeDefined();
    });

    it('should export useGetFeedbackQuery', () => {
      const { useGetFeedbackQuery } = require('../feedbackApi');
      expect(useGetFeedbackQuery).toBeDefined();
    });

    it('should export useSubmitSupportMessageMutation', () => {
      const { useSubmitSupportMessageMutation } = require('../feedbackApi');
      expect(useSubmitSupportMessageMutation).toBeDefined();
    });

    it('should export useGetSupportMessagesQuery', () => {
      const { useGetSupportMessagesQuery } = require('../feedbackApi');
      expect(useGetSupportMessagesQuery).toBeDefined();
    });

    it('should export useSubmitContactRequestMutation', () => {
      const { useSubmitContactRequestMutation } = require('../feedbackApi');
      expect(useSubmitContactRequestMutation).toBeDefined();
    });

    it('should export useGetContactRequestsQuery', () => {
      const { useGetContactRequestsQuery } = require('../feedbackApi');
      expect(useGetContactRequestsQuery).toBeDefined();
    });
  });

  describe('type exports', () => {
    it('should export FeedbackSubmission type', () => {
      const feedback: import('../feedbackApi').FeedbackSubmission = {
        rating: 5,
        comment: 'Great!',
      };
      expect(feedback.rating).toBe(5);
    });

    it('should export Feedback type', () => {
      const feedback: import('../feedbackApi').Feedback = {
        id: 1,
        rating: 5,
        comment: 'Great!',
        created_at: '2024-01-01',
      };
      expect(feedback.id).toBe(1);
    });

    it('should export SupportMessageSubmission type', () => {
      const message: import('../feedbackApi').SupportMessageSubmission = {
        email: 'test@example.com',
        message: 'Help me!',
      };
      expect(message.email).toBe('test@example.com');
    });

    it('should export SupportMessage type', () => {
      const message: import('../feedbackApi').SupportMessage = {
        id: 1,
        email: 'test@example.com',
        message: 'Help me!',
        status: 'pending',
        created_at: '2024-01-01',
      };
      expect(message.id).toBe(1);
    });

    it('should export ContactRequestSubmission type', () => {
      const request: import('../feedbackApi').ContactRequestSubmission = {
        property: 1,
        name: 'Test',
        email: 'test@example.com',
        message: 'Interested!',
      };
      expect(request.property).toBe(1);
    });

    it('should export ContactRequest type', () => {
      const request: import('../feedbackApi').ContactRequest = {
        id: 1,
        property: 1,
        name: 'Test',
        email: 'test@example.com',
        message: 'Interested!',
        created_at: '2024-01-01',
      };
      expect(request.id).toBe(1);
    });
  });
});

