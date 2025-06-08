#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { MelodiesAPI } from './melodies-api.js';
import { parseArgs } from './utils.js';

// Load environment variables
dotenv.config();

/**
 * Melodies API MCP Server
 *
 * A Model Context Protocol server that provides access to the Melodies music API.
 */
class MelodiesMCPServer {
  private server: Server;
  private melodiesAPI: MelodiesAPI;

  constructor() {
    this.server = new Server(
      {
        name: 'melodies-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.melodiesAPI = new MelodiesAPI(
      process.env.MELODIES_API_KEY,
      process.env.MELODIES_BASE_URL
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getAvailableTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'configure_server':
            return await this.configureServer(args);
          case 'search_tracks':
            return await this.searchTracks(args);
          case 'simplified_search_tracks':
            return await this.simplifiedSearchTracks(args);
          case 'get_collections':
            return await this.getCollections(args);
          case 'get_collection_tracks':
            return await this.getCollectionTracks(args);
          case 'get_trending_tracks':
            return await this.getTrendingTracks(args);
          case 'get_simplified_trending_tracks':
            return await this.getSimplifiedTrendingTracks(args);
          case 'get_track_info':
            return await this.getTrackInfo(args);
          case 'get_track_album_art':
            return await this.getTrackAlbumArt(args);
          case 'get_track_composer_avatar':
            return await this.getTrackComposerAvatar(args);
          case 'get_track_download_url':
            return await this.getTrackDownloadUrl(args);
          case 'get_genres':
            return await this.getGenres(args);
          case 'get_genre_groups':
            return await this.getGenreGroups(args);
          case 'get_moods':
            return await this.getMoods(args);
          case 'get_instruments':
            return await this.getInstruments(args);
          case 'get_purposes':
            return await this.getPurposes(args);
          case 'get_cue_sheet_info':
            return await this.getCueSheetInfo(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        throw new Error(
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private getAvailableTools(): Tool[] {
    return [
      {
        name: 'configure_server',
        description: 'Configure the MCP server with API credentials',
        inputSchema: {
          type: 'object',
          properties: {
            apiKey: { type: 'string', description: 'Your Melodies API key' },
          },
          required: ['apiKey'],
        },
      },
      {
        name: 'search_tracks',
        description: 'Search for tracks in the Melodies API',
        inputSchema: {
          type: 'object',
          properties: {
            q: {
              type: 'string',
              description: 'General search query for all track data',
            },
            page: {
              type: 'number',
              description: 'Page of results to retrieve',
            },
            sort: {
              type: 'string',
              enum: ['latest', 'shuffle', 'featured'],
              description: 'Sorting of results',
            },
            genre: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of genres to search for',
            },
            mood: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of moods to search for',
            },
            instrument: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of instruments to search for',
            },
            purpose: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of purposes to search for',
            },
            minTempo: {
              type: 'number',
              description: 'Minimal tempo in BPM (must be used with maxTempo)',
            },
            maxTempo: {
              type: 'number',
              description: 'Maximal tempo in BPM (must be used with minTempo)',
            },
            minDuration: {
              type: 'number',
              description:
                'Minimal duration in seconds (must be used with maxDuration)',
            },
            maxDuration: {
              type: 'number',
              description:
                'Maximal duration in seconds (must be used with minDuration)',
            },
            perPage: {
              type: 'number',
              description: 'Amount of results per page (default 15, max 200)',
            },
          },
        },
      },
      {
        name: 'simplified_search_tracks',
        description: 'Perform simplified track search (main track info only)',
        inputSchema: {
          type: 'object',
          properties: {
            q: {
              type: 'string',
              description: 'General search query for all track data',
            },
            page: {
              type: 'number',
              description: 'Page of results to retrieve',
            },
            sort: {
              type: 'string',
              enum: ['latest', 'shuffle', 'featured'],
              description: 'Sorting of results',
            },
            genre: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of genres to search for',
            },
            mood: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of moods to search for',
            },
            instrument: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of instruments to search for',
            },
            purpose: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of purposes to search for',
            },
            minTempo: {
              type: 'number',
              description: 'Minimal tempo in BPM (must be used with maxTempo)',
            },
            maxTempo: {
              type: 'number',
              description: 'Maximal tempo in BPM (must be used with minTempo)',
            },
            minDuration: {
              type: 'number',
              description:
                'Minimal duration in seconds (must be used with maxDuration)',
            },
            maxDuration: {
              type: 'number',
              description:
                'Maximal duration in seconds (must be used with minDuration)',
            },
            perPage: {
              type: 'number',
              description: 'Amount of results per page (default 15, max 200)',
            },
          },
        },
      },
      {
        name: 'get_collections',
        description: 'Get list of all available collections',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_collection_tracks',
        description: 'Get tracks from a specific collection',
        inputSchema: {
          type: 'object',
          properties: {
            collectionSafename: {
              type: 'string',
              description: 'Safe name of the collection',
            },
          },
          required: ['collectionSafename'],
        },
      },
      {
        name: 'get_trending_tracks',
        description: 'Get 25 most popular tracks currently',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_simplified_trending_tracks',
        description:
          'Get 25 most popular tracks currently (simplified version)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_track_info',
        description: 'Get detailed information about a specific track',
        inputSchema: {
          type: 'object',
          properties: {
            trackId: { type: 'number', description: 'ID of the track' },
          },
          required: ['trackId'],
        },
      },
      {
        name: 'get_track_album_art',
        description: 'Get album art for a track in different image qualities',
        inputSchema: {
          type: 'object',
          properties: {
            trackId: { type: 'number', description: 'ID of the track' },
          },
          required: ['trackId'],
        },
      },
      {
        name: 'get_track_composer_avatar',
        description:
          'Get composer avatar for a track in different image qualities',
        inputSchema: {
          type: 'object',
          properties: {
            trackId: { type: 'number', description: 'ID of the track' },
          },
          required: ['trackId'],
        },
      },
      {
        name: 'get_track_download_url',
        description: 'Get temporary download URL for a track version',
        inputSchema: {
          type: 'object',
          properties: {
            trackVersionId: {
              type: 'number',
              description: 'ID of the track version',
            },
            version: {
              type: 'string',
              enum: ['wav', 'mp3'],
              description: 'Format of the track',
              default: 'mp3',
            },
          },
          required: ['trackVersionId'],
        },
      },
      {
        name: 'get_genres',
        description: 'Get list of all current genres',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_genre_groups',
        description: 'Get list of all current genre groups',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_moods',
        description: 'Get list of all current moods',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_instruments',
        description: 'Get list of all current instruments',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_purposes',
        description: 'Get list of all current purposes',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_cue_sheet_info',
        description: 'Get cue sheet info for a track version by filename',
        inputSchema: {
          type: 'object',
          properties: {
            filename: {
              type: 'string',
              description: 'The filename to search for (can be partial)',
            },
            page: {
              type: 'number',
              description: 'Page number to retrieve (default 1)',
            },
            perPage: {
              type: 'number',
              description: 'Number of items per page (max 100, default 10)',
            },
          },
          required: ['filename'],
        },
      },
    ];
  }

  // Tool implementation methods
  private async configureServer(args: any) {
    const { apiKey } = args;

    if (!apiKey) {
      throw new Error(
        'API_KEY is required, please set it in the configuration'
      );
    }

    this.melodiesAPI.setApiKey(apiKey);

    return {
      content: [
        {
          type: 'text',
          text: 'Server configured successfully',
        },
      ],
    };
  }

  private async searchTracks(args: any) {
    const data = await this.melodiesAPI.searchTracks(args);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async simplifiedSearchTracks(args: any) {
    const data = await this.melodiesAPI.simplifiedSearchTracks(args);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getCollections(args: any) {
    const data = await this.melodiesAPI.getCollections();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getCollectionTracks(args: any) {
    const { collectionSafename } = args;
    const data = await this.melodiesAPI.getCollectionTracks(collectionSafename);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getTrendingTracks(args: any) {
    const data = await this.melodiesAPI.getTrendingTracks();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getSimplifiedTrendingTracks(args: any) {
    const data = await this.melodiesAPI.getSimplifiedTrendingTracks();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getTrackInfo(args: any) {
    const { trackId } = args;
    const data = await this.melodiesAPI.getTrackInfo(trackId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getTrackAlbumArt(args: any) {
    const { trackId } = args;
    const data = await this.melodiesAPI.getTrackAlbumArt(trackId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getTrackComposerAvatar(args: any) {
    const { trackId } = args;
    const data = await this.melodiesAPI.getTrackComposerAvatar(trackId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getTrackDownloadUrl(args: any) {
    const { trackVersionId, version = 'mp3' } = args;
    const data = await this.melodiesAPI.getTrackDownloadUrl(
      trackVersionId,
      version
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getGenres(args: any) {
    const data = await this.melodiesAPI.getGenres();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getGenreGroups(args: any) {
    const data = await this.melodiesAPI.getGenreGroups();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getMoods(args: any) {
    const data = await this.melodiesAPI.getMoods();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getInstruments(args: any) {
    const data = await this.melodiesAPI.getInstruments();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getPurposes(args: any) {
    const data = await this.melodiesAPI.getPurposes();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private async getCueSheetInfo(args: any) {
    const { filename, page, perPage } = args;
    const data = await this.melodiesAPI.getCueSheetInfo(
      filename,
      page,
      perPage
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Melodies MCP Server running on stdio');
  }
}

// Main execution
async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log(`
Melodies MCP Server

Usage: melodies-mcp-server [options]

Options:
  --help         Show help
  --version      Show version
  
Environment Variables:
  MELODIES_API_KEY              Your Melodies API key (required)
`);
    process.exit(0);
  }

  if (args.version) {
    console.log('1.0.0');
    process.exit(0);
  }

  const server = new MelodiesMCPServer();
  await server.run();
}

// Check if this module is run directly (ES module equivalent of require.main === module)
const isDirectRun =
  import.meta.url.endsWith('/dist/index.js') ||
  import.meta.url.endsWith('/src/index.ts') ||
  import.meta.url === `file://${process.argv[1]}`;

if (isDirectRun) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { MelodiesMCPServer };
