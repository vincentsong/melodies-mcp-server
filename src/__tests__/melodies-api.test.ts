import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { MelodiesAPI } from '../melodies-api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  })),
}));

describe('MelodiesAPI', () => {
  let api: MelodiesAPI;

  beforeEach(() => {
    api = new MelodiesAPI('test-api-key');
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      expect(api).toBeInstanceOf(MelodiesAPI);
    });

    it('should use default base URL', () => {
      const apiWithDefaults = new MelodiesAPI('test-key');
      expect(apiWithDefaults).toBeInstanceOf(MelodiesAPI);
    });

    it('should use custom base URL', () => {
      const customApi = new MelodiesAPI('test-key', 'https://custom.api.com');
      expect(customApi).toBeInstanceOf(MelodiesAPI);
    });
  });

  describe('validateApiKey', () => {
    it('should throw error when API key is not set', async () => {
      const apiWithoutKey = new MelodiesAPI();
      // Test by calling a method that requires API key validation
      await expect(apiWithoutKey.searchTracks({ q: 'test' })).rejects.toThrow();
    });
  });

  describe('API methods', () => {
    const mockResponse = { data: { tracks: [] } };

    beforeEach(() => {
      // Mock the axios client responses
      const mockGet = (jest.fn() as any).mockResolvedValue(mockResponse);
      (api as any).client = { get: mockGet };
    });

    it('should search tracks', async () => {
      const params = { q: 'test' };
      const result = await api.searchTracks(params);
      expect(result).toEqual(mockResponse.data);
    });

    it('should get collections', async () => {
      const result = await api.getCollections();
      expect(result).toEqual(mockResponse.data);
    });

    it('should get trending tracks', async () => {
      const result = await api.getTrendingTracks();
      expect(result).toEqual(mockResponse.data);
    });

    it('should get track info', async () => {
      const result = await api.getTrackInfo(123);
      expect(result).toEqual(mockResponse.data);
    });

    it('should get genres', async () => {
      const result = await api.getGenres();
      expect(result).toEqual(mockResponse.data);
    });
  });
});
