# Server Architecture

This document explains the refactored server architecture that separates concerns between application setup and server launching.

## File Structure

```
Server/
├── server.js          # Server launch logic only
├── App.js             # Application setup & configuration
├── .env               # Environment variables (not tracked)
├── .env.example       # Environment template (tracked)
├── routes/
│   └── wiki.js        # Route definitions (HTTP endpoints)
├── controllers/
│   ├── index.js       # Controller exports
│   └── wikiController.js # Business logic for wiki operations
├── middlewares/       # Custom middleware functions
├── helpers/           # Modular helper functions
├── scripts/           # Utility scripts
└── wikiChunks/        # Generated wiki data
```

## Architecture Layers

### 1. **Routes Layer** (`routes/`)

- **Purpose**: Define HTTP endpoints and route parameters
- **Responsibility**: URL mapping and request routing
- **Example**: `GET /api/wiki/pages` → `wikiController.getWikiPages`

### 2. **Controllers Layer** (`controllers/`)

- **Purpose**: Handle business logic and coordinate between services
- **Responsibility**: Process requests, call helpers, format responses
- **Example**: Validate input, call helper functions, handle errors

### 3. **Helpers Layer** (`helpers/`)

- **Purpose**: Reusable utility functions and external service integration
- **Responsibility**: API calls, data processing, file operations
- **Example**: Fetch data from Azure DevOps, chunk text, save files

## Components

### `server.js`

**Purpose**: Contains only server launch logic

- Imports the configured app from `App.js`
- Loads environment variables
- Starts the server on specified port
- Displays startup information and available endpoints

### `App.js`

**Purpose**: Application configuration and setup

- Creates and configures Express application
- Sets up middleware (security, CORS, logging, rate limiting)
- Defines routes and endpoints
- Handles error middleware
- Exports configured app for use in `server.js`

### `routes/wiki.js`

**Purpose**: HTTP endpoint definitions

- Maps URLs to controller functions
- Defines route parameters and middleware
- Clean separation from business logic
- Example: `router.get('/pages', getWikiPages)`

### `controllers/wikiController.js`

**Purpose**: Business logic coordination

- Handles request/response logic
- Validates input parameters
- Coordinates helper function calls
- Formats API responses
- Manages error handling

### `helpers/`

**Purpose**: Reusable utility functions

- External service integration (Azure DevOps API)
- Data processing and transformation
- File system operations
- Pure functions without Express dependencies

## Environment Configuration

The server uses environment variables for configuration:

- **`.env`** - Contains actual values (git-ignored)
- **`.env.example`** - Template with placeholder values (tracked)
- **`ENV_GUIDE.md`** - Detailed configuration documentation

### Key Environment Variables:

- `AZURE_DEVOPS_PAT` - Azure DevOps Personal Access Token
- `PORT` - Server port (default: 5002)
- `CHUNK_SIZE` - Text chunk size (default: 500)
- `BATCH_SIZE` - API batch size (default: 5)
- `DELAY_MS` - Batch delay (default: 1000ms)

## Benefits of This Architecture

1. **Separation of Concerns**:

   - `server.js` only handles server lifecycle
   - `App.js` handles application logic and configuration

2. **Testability**:

   - Can import `App.js` for testing without starting a server
   - Easier to write unit tests for application logic

3. **Reusability**:

   - App configuration can be reused in different contexts
   - Easier to implement in serverless environments

4. **Maintainability**:
   - Clear separation makes code easier to understand
   - Changes to app logic don't affect server startup logic

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start

# Update wiki chunks
npm run update-wiki

# Test wiki endpoints
npm run test-wiki
```

## Available Endpoints

- `GET /health` - Health check
- `GET /` - Welcome message with available endpoints
- `GET /api/wiki/pages` - Get wiki pages
- `POST /api/wiki/fetch-and-chunk` - Process wiki content into chunks
- `GET /api/wiki/chunks` - Get saved chunks
- `GET /api/wiki/chunks/search` - Search in chunks
