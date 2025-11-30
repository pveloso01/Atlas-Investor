// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock TextDecoder/TextEncoder for mapbox-gl
global.TextDecoder = class TextDecoder {
  decode() {
    return '';
  }
};

global.TextEncoder = class TextEncoder {
  encode() {
    return new Uint8Array();
  }
};

// Polyfill Request for RTK Query
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : (input && input.url ? input.url : String(input));
      this.method = (init && init.method) ? init.method : 'GET';
      this.headers = new Headers(init && init.headers ? init.headers : {});
      this.body = (init && init.body) ? init.body : null;
      this.cache = (init && init.cache) ? init.cache : 'default';
      this.credentials = (init && init.credentials) ? init.credentials : 'same-origin';
      this.integrity = (init && init.integrity) ? init.integrity : '';
      this.keepalive = (init && init.keepalive) ? init.keepalive : false;
      this.mode = (init && init.mode) ? init.mode : 'cors';
      this.redirect = (init && init.redirect) ? init.redirect : 'follow';
      this.referrer = (init && init.referrer) ? init.referrer : 'about:client';
      this.referrerPolicy = (init && init.referrerPolicy) ? init.referrerPolicy : '';
      this.signal = (init && init.signal) ? init.signal : null;
    }
    clone() {
      return new Request(this.url, {
        method: this.method,
        headers: this.headers,
        body: this.body,
      });
    }
  };
}

// Mock fetch for RTK Query
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
  })
);

