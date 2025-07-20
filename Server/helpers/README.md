# Helpers Documentation

This directory contains modular helper functions for the RGA Bot server, organized by functionality.

## Structure

```
helpers/
├── index.js           # Central export hub for all helpers
├── textProcessing.js  # Text chunking and processing utilities
├── wikiApi.js         # Azure DevOps Wiki API functions
└── fileOperations.js  # File system operations
```

## Helper Modules

### `textProcessing.js`

Contains functions for processing and chunking text content:

- **`createTextChunks(text, maxChunkSize)`** - Splits text into manageable chunks
- **`createWikiChunks(pageContents, chunkSize)`** - Creates wiki chunks with metadata

### `wikiApi.js`

Contains functions for interacting with Azure DevOps Wiki API:

- **`fetchAllWikiPages()`** - Fetches all wiki pages from Azure DevOps
- **`fetchPageContent(pagePath)`** - Fetches content for a specific page
- **`fetchAllPageContents(subPages)`** - Fetches content for multiple pages with rate limiting

### `fileOperations.js`

Contains functions for file system operations:

- **`saveChunksToFile(chunks, filePath)`** - Saves chunks to JSON file
- **`readChunksFromFile(filePath)`** - Reads chunks from JSON file
- **`chunksFileExists(filePath)`** - Checks if chunks file exists

## Usage

### Import Individual Functions

```javascript
import { createTextChunks, fetchAllWikiPages } from '../helpers/index.js';
```

### Import Specific Module

```javascript
import { createTextChunks } from '../helpers/textProcessing.js';
import { fetchAllWikiPages } from '../helpers/wikiApi.js';
```

## Function Characteristics

All helper functions are implemented as **arrow functions** for:

- Consistent modern ES6+ syntax
- Lexical `this` binding
- Concise syntax for simple functions
- Better readability in functional programming patterns

## Configuration

Configuration constants are defined within each helper module:

- **Text Processing**: `CHUNK_SIZE = 500`
- **Wiki API**: `PAT`, `parentPath`
- **File Operations**: `WIKI_CHUNKS_FILE` path

## Error Handling

All helper functions include comprehensive error handling:

- Detailed error logging with emojis for visual clarity
- Graceful degradation for non-critical failures
- Proper error propagation to calling functions

## Rate Limiting

Wiki API functions implement rate limiting to avoid Azure DevOps API limits:

- Batch processing (5 pages at a time)
- 1-second delays between batches
- Concurrent request limiting

## Dependencies

- **axios**: HTTP client for API requests
- **fs/promises**: File system operations
- **path**: File path utilities
