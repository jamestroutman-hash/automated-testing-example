// Global setup to polyfill Request/Response for Next.js server tests
// This runs once before all test suites

export default async function globalSetup() {
  // Node v18+ has native Request/Response, but they may not be in the global scope
  // Import them from the native module if available
  if (typeof globalThis.Request === 'undefined') {
    try {
      const { Request, Response, Headers, FormData } = await import('undici');
      globalThis.Request = Request;
      globalThis.Response = Response;
      globalThis.Headers = Headers;
      globalThis.FormData = FormData;
    } catch (error) {
      console.warn('Failed to polyfill Request/Response:', error.message);
    }
  }
}
