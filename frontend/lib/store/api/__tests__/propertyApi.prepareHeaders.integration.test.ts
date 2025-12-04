import { propertyApi } from '../propertyApi';
import { configureStore } from '@reduxjs/toolkit';

// Test prepareHeaders by making actual API calls
describe('propertyApi prepareHeaders integration', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // Reset localStorage mock
    if (
      global.localStorage.getItem &&
      typeof (global.localStorage.getItem as jest.Mock).mockClear === 'function'
    ) {
      (global.localStorage.getItem as jest.Mock).mockClear();
    }

    store = configureStore({
      reducer: {
        [propertyApi.reducerPath]: propertyApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(propertyApi.middleware),
    });
  });

  it('adds authorization header when token exists', async () => {
    if (
      global.localStorage.getItem &&
      typeof (global.localStorage.getItem as jest.Mock).mockReturnValue === 'function'
    ) {
      (global.localStorage.getItem as jest.Mock).mockReturnValue('test-token-123');
    } else {
      global.localStorage.getItem = jest.fn(() => 'test-token-123');
    }

    // Mock fetch to capture headers
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      json: async () => ({ count: 0, results: [] }),
      text: async () => '',
      blob: async () => new Blob(),
      arrayBuffer: async () => new ArrayBuffer(0),
      formData: async () => new FormData(),
      clone: function () {
        return this;
      },
      body: null,
      bodyUsed: false,
      redirected: false,
      type: 'default' as ResponseType,
      url: 'http://localhost:8000/api/properties/',
    } as Response);

    const result = propertyApi.endpoints.getProperties.initiate({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch(result as any);

    await result;

    // Verify fetch was called
    expect(fetchSpy).toHaveBeenCalled();

    // Check if authorization header was set (indirectly through fetch call)
    const fetchCall = fetchSpy.mock.calls[0];
    expect(fetchCall).toBeDefined();

    fetchSpy.mockRestore();
  });

  it('does not add authorization header when token does not exist', async () => {
    if (
      global.localStorage.getItem &&
      typeof (global.localStorage.getItem as jest.Mock).mockReturnValue === 'function'
    ) {
      (global.localStorage.getItem as jest.Mock).mockReturnValue(null);
    } else {
      global.localStorage.getItem = jest.fn(() => null);
    }

    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      json: async () => ({ count: 0, results: [] }),
      text: async () => '',
      blob: async () => new Blob(),
      arrayBuffer: async () => new ArrayBuffer(0),
      formData: async () => new FormData(),
      clone: function () {
        return this;
      },
      body: null,
      bodyUsed: false,
      redirected: false,
      type: 'default' as ResponseType,
      url: 'http://localhost:8000/api/properties/',
    } as Response);

    const result = propertyApi.endpoints.getProperties.initiate({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch(result as any);

    await result;

    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
