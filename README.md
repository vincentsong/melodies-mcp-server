# Melodies MCP Server (Nodejs)

A Model Context Protocol (MCP) server for the Melodies music API, built with TypeScript and Node.js.

## Features

- 🎵 Complete Melodies API integration
- 🔧 TypeScript for type safety
- 📦 Easy npm installation and management
- ⚡ Fast and reliable performance

## Installation

### From npm (when published)

```bash
npm install -g vincentsong/melodies-mcp-server
```

### From source

```bash
git clone https://github.com/vincentsong/melodies-mcp-server
cd melodies-mcp-server
npm install
npm run build
npm link  # For global installation
```

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
MELODIES_API_KEY=your_api_key_here
```

### 2. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### 3. Configure MCP Client

#### VS Code plugins

File: `<mcp client>/<mcp configuration>.json`

```json
{
  "mcpServers": {
    "melodies-mcp-server": {
      "disabled": false,
      "command": "npx",
      "args": ["melodies-mcp-server"],
      "env": {
        "MELODIES_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

## Available Tools

### Core API Tools

- `configure_server` - Configure API credentials and database
- `search_tracks` - Search for music tracks
- `simplified_search_tracks` - Simplified track search
- `get_trending_tracks` - Get trending tracks
- `get_track_info` - Get detailed track information

### Collection Tools

- `get_collections` - Get available collections
- `get_collection_tracks` - Get tracks from a collection

### Metadata Tools

- `get_genres` - Get available music genres
- `get_moods` - Get available moods
- `get_instruments` - Get available instruments
- `get_purposes` - Get available purposes

### Media Tools

- `get_track_album_art` - Get track album artwork
- `get_track_composer_avatar` - Get composer avatar
- `get_track_download_url` - Get track download URL

### Advanced Tools

- `get_cue_sheet_info` - Get cue sheet information

## API Reference

### Search Parameters

```typescript
interface SearchParams {
  q?: string; // General search query
  page?: number; // Page number
  sort?: 'latest' | 'shuffle' | 'featured';
  genre?: string[]; // Filter by genres
  mood?: string[]; // Filter by moods
  instrument?: string[]; // Filter by instruments
  purpose?: string[]; // Filter by purposes
  minTempo?: number; // Minimum BPM
  maxTempo?: number; // Maximum BPM
  minDuration?: number; // Minimum duration (seconds)
  maxDuration?: number; // Maximum duration (seconds)
  perPage?: number; // Results per page (max 200)
}
```

### Example Usage

```typescript
// Search for upbeat pop music
{
  "q": "upbeat",
  "genre": ["Pop"],
  "mood": ["Happy", "Energetic"],
  "minTempo": 120,
  "maxTempo": 140
}

// Get track information
{
  "trackId": 12345
}

// Download track
{
  "trackVersionId": 67890,
  "version": "mp3"
}
```

## Troubleshooting

### Common Issues

**API Key not found**

```bash
Error: API Key is required for this MCP server
```

Solution: Set `MELODIES_API_KEY` in your `.env` file or environment.

**MCP client not connecting**

```bash
Connection closed
```

Solution: Check MCP client configuration and ensure server is running.

### Debug Mode

```bash
# Enable debug logging
NODE_ENV=development npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- GitHub Issues: [Report bugs](https://github.com/your-org/melodies-mcp-server/issues)
- Documentation: [API Docs](https://api.melod.ie/docs)
