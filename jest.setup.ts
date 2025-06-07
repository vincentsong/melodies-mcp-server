// Test setup file for Jest
import { jest, afterEach } from '@jest/globals';

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific log levels
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.MELODIES_API_KEY = 'test-api-key';
process.env.MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/test';

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
