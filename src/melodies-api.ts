import axios, {AxiosInstance} from 'axios';

export interface SearchParams {
  q?: string;
  page?: number;
  sort?: 'latest' | 'shuffle' | 'featured';
  genre?: string[];
  mood?: string[];
  instrument?: string[];
  purpose?: string[];
  minTempo?: number;
  maxTempo?: number;
  minDuration?: number;
  maxDuration?: number;
  perPage?: number;
}

export class MelodiesAPI {
  private client: AxiosInstance;
  private apiKey?: string;
  private baseURL: string;

  constructor(apiKey?: string, baseURL = 'https://api.melod.ie') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
    });

    if (this.apiKey) {
      this.setApiKey(this.apiKey);
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.client.defaults.headers.common['Authorization'] = apiKey;
  }

  private validateApiKey(): void {
    if (!this.apiKey) {
      throw new Error('API Key is required for this MCP server');
    }
  }

  private buildSearchParams(params: SearchParams): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.append('q', params.q);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.sort) searchParams.append('sort', params.sort);
    
    if (params.genre) {
      params.genre.forEach(g => searchParams.append('genre[]', g));
    }
    if (params.mood) {
      params.mood.forEach(m => searchParams.append('mood[]', m));
    }
    if (params.instrument) {
      params.instrument.forEach(i => searchParams.append('instrument[]', i));
    }
    if (params.purpose) {
      params.purpose.forEach(p => searchParams.append('purpose[]', p));
    }
    
    if (params.minTempo && params.maxTempo) {
      searchParams.append('min_tempo', params.minTempo.toString());
      searchParams.append('max_tempo', params.maxTempo.toString());
    }
    if (params.minDuration && params.maxDuration) {
      searchParams.append('min_duration', params.minDuration.toString());
      searchParams.append('max_duration', params.maxDuration.toString());
    }
    if (params.perPage) {
      searchParams.append('per_page', params.perPage.toString());
    }

    return searchParams;
  }

  async searchTracks(params: SearchParams): Promise<any> {
    this.validateApiKey();
    const searchParams = this.buildSearchParams(params);
    const response = await this.client.get('/api/v1/tracks/search', { params: searchParams });
    return response.data;
  }

  async simplifiedSearchTracks(params: SearchParams): Promise<any> {
    this.validateApiKey();
    const searchParams = this.buildSearchParams(params);
    const response = await this.client.get('/api/v1/tracks/simplified_search', { params: searchParams });
    return response.data;
  }

  async getCollections(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/collections');
    return response.data;
  }

  async getCollectionTracks(collectionSafename: string): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get(`/api/v1/collections/${collectionSafename}`);
    return response.data;
  }

  async getTrendingTracks(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/tracks/trending');
    return response.data;
  }

  async getSimplifiedTrendingTracks(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/tracks/simplified_trending');
    return response.data;
  }

  async getTrackInfo(trackId: number): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get(`/api/v1/tracks/${trackId}/info`);
    return response.data;
  }

  async getTrackAlbumArt(trackId: number): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get(`/api/v1/tracks/${trackId}/album_art`);
    return response.data;
  }

  async getTrackComposerAvatar(trackId: number): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get(`/api/v1/tracks/${trackId}/composer_avatar`);
    return response.data;
  }

  async getTrackDownloadUrl(trackVersionId: number, version: 'wav' | 'mp3' = 'mp3'): Promise<any> {
    this.validateApiKey();
    const params = new URLSearchParams({ version });
    const response = await this.client.get(`/api/v1/tracks/${trackVersionId}/download_version_url`, { params });
    return response.data;
  }

  async getGenres(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/tracks/genres');
    return response.data;
  }

  async getGenreGroups(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/tracks/genre_groups');
    return response.data;
  }

  async getMoods(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/tracks/moods');
    return response.data;
  }

  async getInstruments(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/tracks/instruments');
    return response.data;
  }

  async getPurposes(): Promise<any> {
    this.validateApiKey();
    const response = await this.client.get('/api/v1/tracks/purposes');
    return response.data;
  }

  async getCueSheetInfo(filename: string, page?: number, perPage?: number): Promise<any> {
    this.validateApiKey();
    const params = new URLSearchParams({ filename });
    if (page) params.append('page', page.toString());
    if (perPage) params.append('per_page', perPage.toString());
    
    const response = await this.client.get('/api/v1/tracks/cue_sheet_info', { params });
    return response.data;
  }
}