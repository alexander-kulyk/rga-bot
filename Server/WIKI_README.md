# Wiki Content Fetching and Chunking Service

This service fetches wiki content from Azure DevOps and creates manageable chunks for processing.

## Features

- **Fetch Wiki Pages**: Retrieves all wiki pages under a specified parent path
- **Content Extraction**: Fetches full content for each wiki page
- **Text Chunking**: Breaks down content into smaller, manageable chunks (default: 500 characters)
- **Rate Limiting**: Implements batching and delays to avoid API rate limits
- **File Storage**: Saves chunks to `wiki_chunks.json` for persistent access
- **Search Functionality**: Provides search capabilities across all chunks

## API Endpoints

### GET `/api/wiki/pages`

Fetches all wiki pages under the configured parent path.

**Response:**

```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "timestamp": "2025-07-14T..."
}
```

### POST `/api/wiki/fetch-and-chunk`

Fetches all wiki content and creates chunks. This is the main endpoint for processing wiki data.

**Response:**

```json
{
  "success": true,
  "message": "Wiki content fetched and chunked successfully",
  "statistics": {
    "totalPages": 15,
    "pagesWithContent": 12,
    "totalChunks": 45,
    "chunkSize": 500
  },
  "timestamp": "2025-07-14T..."
}
```

### GET `/api/wiki/chunks`

Returns all saved chunks from the JSON file.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "path": "/SDH: DF/Frontend/Libraries/SignalR",
      "chunkIndex": 0,
      "chunk": "SignalR content..."
    }
  ],
  "count": 45,
  "timestamp": "2025-07-14T..."
}
```

### GET `/api/wiki/chunks/search?query=SignalR&limit=10`

Searches for chunks containing the specified query.

**Parameters:**

- `query` (required): Search term
- `limit` (optional): Maximum number of results (default: 10)

**Response:**

```json
{
  "success": true,
  "query": "SignalR",
  "data": [...],
  "count": 5,
  "timestamp": "2025-07-14T..."
}
```

## Configuration

The following constants can be modified in `routes/wiki.js`:

- `PAT`: Azure DevOps Personal Access Token
- `parentPath`: The wiki path to process (default: '/SDH: DF/Frontend')
- `CHUNK_SIZE`: Maximum characters per chunk (default: 500)
- `BATCH_SIZE`: Number of pages to process simultaneously (default: 5)
- `DELAY_MS`: Delay between batches in milliseconds (default: 1000)

## How It Works

1. **Page Discovery**: Uses Azure DevOps `pagesbatch` API to get all available pages
2. **Content Filtering**: Filters pages under the specified parent path
3. **Content Fetching**: Fetches full content for each page with rate limiting
4. **Text Chunking**: Splits content into chunks using sentence boundaries
5. **File Storage**: Saves chunks to `wikiChunks/wiki_chunks.json`

## Usage

1. Start the server: `npm start`
2. Trigger the chunking process: `POST /api/wiki/fetch-and-chunk`
3. Access chunks: `GET /api/wiki/chunks`
4. Search chunks: `GET /api/wiki/chunks/search?query=your-search-term`

## Error Handling

- Implements comprehensive error handling for API failures
- Continues processing even if individual pages fail to fetch
- Provides detailed error messages and statistics
- Logs progress and errors to console

## Rate Limiting

To avoid Azure DevOps API rate limits:

- Processes pages in batches of 5
- Adds 1-second delay between batches
- Implements proper error handling for failed requests
