# Copilot Instructions for RGA Bot

## Project Overview

RGA Bot is a document Q&A system with a **Node.js/Express backend** and **React/TypeScript frontend**. It enables users to upload documents (DOCX, DOC, PDF, Excel), which are chunked, vectorized using OpenAI embeddings, and stored in MongoDB. Users can then ask questions about specific documents, with answers generated via OpenAI's chat API using RAG (Retrieval-Augmented Generation).

---

## Architecture

### Backend (Server/)

**3-layer architecture**: Routes → Controllers → Helpers

- **Routes** (`routes/`): Define endpoints, delegate to controllers

  - `api.js` - Legacy routes (ask, upload)
  - `modelConfigs.js` - Model configuration CRUD
  - `fileOptions.js` - File metadata retrieval
  - `wiki.js` - Azure DevOps wiki integration

- **Controllers** (`controllers/`): Handle request validation, orchestrate helpers, format responses

  - `askController.js` - Q&A logic (requires `question` + `collectionName`)
  - `loadDocxController.js` - File upload handling
  - `modelConfigController.js` - Model config CRUD with validation
  - `fileOptionsController.js` - Returns available documents

- **Helpers** (`helpers/`): Pure business logic, reusable functions (all **arrow functions**)
  - `getExtractedText.js` - Extracts plain text from DOCX/DOC/PDF/Excel
  - `loadDocx.js` - Document processing pipeline (sanitize → extract → chunk → vectorize → store)
  - `createVectors.js` - Creates OpenAI embeddings for text chunks
  - `getRelevantChunks.js` - Vector similarity search for Q&A
  - `textProcessing.js` - Text chunking utilities
  - `wikiApi.js` - Azure DevOps wiki API integration with rate limiting
  - `fileOperations.js` - JSON file I/O operations

### Frontend (ClientApp/src/)

**Custom hooks + components pattern**

- **Hooks** (`hooks/`): Encapsulate API calls and state management

  - `useModelAsk.ts` - Q&A submission (sends `question` + `collectionName`)
  - `useUploadFile.ts` - File upload with accept filter (.pdf, .docx, .doc, .xlsx, .xls)
  - `useFileOptions.ts` - Fetches available documents from `/api/file-options`
  - `useModelConfig.ts` - Fetches/updates model configurations
  - `useFileOptionForm.ts` - Form state for document selection (react-hook-form)

- **Components** (`components/`): UI layer with Material UI
  - `TextField.tsx` - Main question input with focus tracking
  - `Footer.tsx` - Document selector dropdown + validation tooltip
  - `ModelConfigModal.tsx` - Settings modal with RangeController + DropDownController
  - `Controllers/RangeController/` - Material UI Slider + react-hook-form Controller
  - `Controllers/DropDownController/` - react-select + react-hook-form Controller

---

## Document Processing Pipeline

### Upload Flow

1. **Client**: User selects file (filtered to .pdf, .docx, .doc, .xlsx, .xls)
2. **Middleware** (`uploadMiddleware.js`): Multer validates MIME type + extension, 50MB limit
3. **Controller** (`loadDocxController.js`): Receives file buffer + filename
4. **Helper** (`loadDocx.js`):
   - Sanitizes filename → collection name (lowercase, underscores, no special chars)
   - Calls `getExtractedText(buffer, fileName)` to extract plain text
   - Splits text into chunks using `TokenTextSplitter` (500 tokens/chunk, 50 overlap)
   - Generates embeddings via `createVectors()` (OpenAI `text-embedding-ada-002`)
   - Stores chunks in MongoDB collection named after document
   - Inserts document metadata into `fileOptions` collection

### Text Extraction (`getExtractedText.js`)

Handles multiple file types:

- **DOCX/DOC**: Uses `mammoth` library to extract plain text
- **PDF**: Uses `pdf-parse` to extract text from pages
- **Excel (.xlsx/.xls)**: Uses `xlsx` library, concatenates all sheets

Returns: Plain text string ready for chunking

### Q&A Flow

1. **Client**: User selects document (dropdown) + enters question
2. **Validation**: Frontend shows red border + tooltip if no document selected when focused
3. **Request**: POST `/api/ask` with `{ question, collectionName }`
4. **Controller** (`askController.js`):
   - Validates `question` and `collectionName`
   - Fetches all chunks from document's MongoDB collection
   - Retrieves latest model config from `modelConfigs` collection
5. **Service** (`openaiService.js`):
   - Calls `getRelevantChunks()` for vector similarity search (top 10 chunks)
   - Constructs prompt with relevant chunks
   - Sends to OpenAI Chat API with system prompt: "multilingual, respond in question's language, only use provided docs, say 'I do not know' if unsure"
6. **Response**: Returns answer + metadata (model, tokens, etc.)

---

## MongoDB Schema Conventions

### Dynamic Collections per Document

- Each uploaded document gets its own collection (e.g., `user_manual`, `technical_spec_v2`)
- Collection name = sanitized filename: lowercase, underscores, no extensions or special chars
- Uses `getChunkModel(collectionName)` factory pattern (`models/manualChunkSchema.js`)

### Schemas

- **ChunkSchema** (`manualChunkSchema.js`):

  - `pageContent` (String, required) - Text chunk
  - `embedding` ([Number]) - 1536-dimensional vector from OpenAI
  - `metadata.loc` ([Mixed]) - Source location info from text splitter
  - `timestamps: true` - Auto-adds `createdAt`, `updatedAt`

- **FileOptionsSchema** (`fileOptionsSchema.js`):

  - `name` (String, required, unique) - Collection name
  - `isDefault` (Boolean, default: false) - Only one document can be default
  - `tags` ([String]) - Future categorization
  - `order` (Number, default: 0) - Display ordering

- **ModelConfigsSchema** (`modelConfigs.js`):
  - `model` (String, enum: ['gpt-4o', 'gpt-3.5-turbo', 'gpt-4', 'gpt-5'])
  - `temperature` (Number, 0-2)
  - `top_p` (Number, 0-1)
  - `max_tokens` (Number, 1-4096)

### Error Handling

All schemas use `handleMongooseError` post-save hook for consistent error logging

---

## Form Management Patterns

### react-hook-form Integration

All form inputs use **react-hook-form** with `Controller` wrapper:

```tsx
<Controller
  name='fieldName'
  control={control}
  rules={{ required: true }}
  render={({ field }) => <CustomComponent {...field} />}
/>
```

### Custom Controllers

- **RangeController**: Material UI `Slider` with configurable min/max/step
- **DropDownController**: react-select with custom styles, error states (red border)
- Size variants: Use `ComponentSize` enum (`Small`, `Medium`, `Large`) from `types/enums/ComponentSize.ts`

### Validation Patterns

- **Required fields**: Show red border when invalid
- **Tooltips**: Display validation messages on hover/focus
- **Focus tracking**: `TextField` broadcasts focus state to `Footer` for document selector validation

---

## API Endpoints

### Core Endpoints

- **POST** `/api/ask` - Q&A

  - Body: `{ question: string, collectionName: string }`
  - Returns: `{ message: string, metadata: {...} }`

- **POST** `/api/upload` - File upload

  - Multipart form data, max 50MB
  - Accepts: .pdf, .docx, .doc, .xlsx, .xls

- **GET** `/api/file-options` - Available documents

  - Returns: `{ fileOptions: [{ name, isDefault, tags, order }] }`

- **GET** `/api/model-configs` - Model configurations

  - Returns: `{ configs: [{ model, temperature, top_p, max_tokens }] }`

- **PUT** `/api/model-configs` - Update/create model config
  - Body: `{ model, temperature, top_p, max_tokens, _id? }`
  - Validates all fields, uses upsert if `_id` provided

### Wiki Endpoints (Azure DevOps Integration)

- **GET** `/api/wiki/pages` - List wiki pages
- **POST** `/api/wiki/fetch-and-chunk` - Fetch + chunk wiki content

---

## Code Conventions

### Helpers

- **Always use arrow functions**: `export const functionName = async (params) => { ... }`
- **JSDoc comments**: Include parameter types, descriptions, return types
- **Error handling**: Use `try/catch`, log with emojis (e.g., `console.error('❌ Error...')`)
- **Configuration**: Define constants at top of file (e.g., `CHUNK_SIZE = 500`)

### Controllers

- **Validation first**: Check required fields, return 400 early
- **Use helpers**: Delegate business logic, controllers only orchestrate
- **Consistent responses**: `{ success: boolean, data?: any, message: string, error?: string }`

### Frontend Components

- **TypeScript interfaces**: Define props interfaces at top
- **Styled-components**: Use styled.ts pattern for complex styles
- **Hooks for logic**: Keep components presentational, extract logic to hooks
- **Error boundaries**: Show user-friendly error messages, avoid console.error in production

### Environment Variables

- **Never commit `.env`**: Use `.env.example` for templates
- **Key variables**:
  - `OPENAI_API_KEY` - OpenAI API key
  - `MONGODB_URI` - MongoDB connection string
  - `PORT` - Server port (default: 5002)
  - `CHUNK_SIZE` - Text chunk size (default: 500)
  - `AZURE_DEVOPS_PAT` - For wiki integration

---

## Development Workflows

### Running the Server

```bash
cd Server
npm install
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

### Running the Client

```bash
cd ClientApp
npm install
npm start      # Development server on port 3000
npm run build  # Production build
```

### Testing Endpoints

Use the **Validate Refactoring** task or run:

```bash
cd Server
npm run validate  # Runs validate-refactoring.js
```

### Updating Wiki Chunks

Use the **Update Wiki Chunks** task or run:

```bash
cd Server
npm run update-wiki  # Runs scripts/update-wiki-chunks.js
```

---

## Common Patterns

### Adding a New File Type

1. Install parser library (e.g., `npm install docx-parser`)
2. Update `getExtractedText.js`:
   ```js
   const ext = fileName.split('.').pop().toLowerCase();
   if (ext === 'newtype') {
     // Use parser library
     return extractedText;
   }
   ```
3. Update `uploadMiddleware.js` file filter:
   ```js
   if (file.mimetype === 'application/newtype' || ext === 'newtype') {
     return cb(null, true);
   }
   ```
4. Update frontend `useUploadFile.ts` accept filter:
   ```ts
   accept = '.pdf,.docx,.doc,.xlsx,.xls,.newtype';
   ```

### Adding a New Model Parameter

1. Update `ModelConfigsSchema` in `models/modelConfigs.js`
2. Add validation in `modelConfigController.js`
3. Update `IModelConfigs` interface in `ClientApp/src/types/interfaces/api/IModelConfigs.ts`
4. Add form field in `ModelConfigModal.tsx` (use `RangeController` or `DropDownController`)

### Creating a New Custom Hook

1. Create file in `ClientApp/src/hooks/useHookName.ts`
2. Export from `hooks/index.ts`
3. Use in component: `const { data, error } = useHookName();`
4. Follow existing patterns: return object with `{ data, error, loading }`

---

## Key Dependencies

### Backend

- **langchain** - Text splitting (`TokenTextSplitter`, `RecursiveCharacterTextSplitter`)
- **@langchain/openai** - Embeddings (`OpenAIEmbeddings`)
- **mammoth** - DOCX text extraction
- **pdf-parse** - PDF text extraction
- **xlsx** - Excel file parsing
- **multer** - File upload middleware
- **mongoose** - MongoDB ODM
- **axios** - HTTP client for OpenAI API

### Frontend

- **react-hook-form** - Form management
- **react-select** - Dropdown component
- **@mui/material** - UI components (Slider, TextField, Modal)
- **styled-components** - CSS-in-JS
- **axios** - API client

---

## Troubleshooting

### pdf-parse Initialization Error

**Symptom**: `Error: Cannot find module './test/data/05-versions-space.pdf'`
**Fix**: Create dummy PDF in `Server/test/data/` directory (library requires test file at startup)

### MongoDB Collection Not Found

**Symptom**: Q&A returns no results
**Cause**: `collectionName` doesn't match uploaded document's collection
**Fix**: Verify collection name in MongoDB matches sanitized filename (lowercase, underscores)

### File Upload Fails

**Checks**:

1. File size < 50MB
2. File extension in accepted list (.pdf, .docx, .doc, .xlsx, .xls)
3. MIME type matches extension
4. Multer middleware registered before route

### OpenAI Rate Limits

**Symptom**: 429 errors from OpenAI API
**Fix**: Implement exponential backoff or reduce batch size in `createVectors.js` (currently 20)

---

## Testing Strategy

### Manual Testing

1. **Upload**: Test all file types (DOCX, DOC, PDF, XLSX, XLS)
2. **Q&A**: Verify answers use only uploaded document content
3. **Model Config**: Test parameter validation (temperature 0-2, top_p 0-1, etc.)
4. **Validation**: Ensure tooltip shows when no document selected + TextField focused

### Automated Validation

Run `npm run validate` in Server directory to check:

- ES6 module syntax compliance
- Controller exports
- Route mounting
- Error handling consistency

---

## Future Enhancements

### Potential Features

- **Image extraction**: Mammoth supports images, could extract + store separately
- **Multi-document Q&A**: Search across multiple collections simultaneously
- **Document versioning**: Track updates to same document
- **User authentication**: JWT auth middleware exists but not enforced
- **Streaming responses**: OpenAI supports streaming, could improve UX for long answers

### Refactoring Opportunities

- Extract text splitter config to environment variables
- Add unit tests for helpers
- Implement caching layer for frequently asked questions
- Add Swagger/OpenAPI documentation for API endpoints

---

## Integration Points

### Azure DevOps Wiki

- Uses Personal Access Token (PAT) from environment
- Fetches pages via REST API with rate limiting (batch size 5, 1s delay)
- Chunks and stores same as uploaded documents
- See `WIKI_README.md` for detailed workflow

### OpenAI API

- **Embeddings**: `text-embedding-ada-002` model (1536 dimensions)
- **Chat**: Configurable model (gpt-4o, gpt-3.5-turbo, gpt-4)
- **Rate limiting**: Handled by OpenAI SDK retry logic
- **Token counting**: Uses `cl100k_base` encoding for chunking

### MongoDB

- **Connection**: Uses environment variable `MONGODB_URI`
- **Database**: All collections in single database
- **Indexes**: `fileOptions.name` (unique), `fileOptions.isDefault` (unique, partial)

---

## Quick Reference

### File Naming Conventions

- **Components**: PascalCase (e.g., `TextField.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useModelAsk.ts`)
- **Helpers**: camelCase (e.g., `loadDocx.js`)
- **Types/Interfaces**: PascalCase with `I` prefix (e.g., `IModelConfigs.ts`)

### Import Order

1. Core libraries (react, express, mongoose)
2. Third-party libraries
3. Local modules (controllers, helpers, models)
4. Types/interfaces
5. Styles/constants

### Error Response Format

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details (optional, dev only)"
}
```

### Success Response Format

```json
{
  "success": true,
  "data": {
    /* payload */
  },
  "message": "Operation completed successfully"
}
```

---

**Last Updated**: Based on codebase analysis (January 2025)
**Maintained By**: AI Coding Agents working on RGA Bot
