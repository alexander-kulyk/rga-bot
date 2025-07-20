# RGA Bot Server

A Node.js Express server with comprehensive middlewares for the RGA Bot application.

## Features

- ✅ Express.js server with security middlewares
- ✅ Rate limiting
- ✅ Authentication middleware
- ✅ Custom logging
- ✅ Error handling
- ✅ CORS support
- ✅ Azure DevOps Wiki API integration

## Project Structure

```
server/
├── middlewares/
│   ├── auth.js          # JWT authentication middleware
│   ├── errorHandler.js  # Global error handling
│   ├── logger.js        # Custom request logging
│   └── rateLimiter.js   # Rate limiting configuration
├── routes/
│   ├── api.js           # General API routes
│   └── wiki.js          # Azure DevOps Wiki routes
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── server.js            # Main server file
```

## Installation

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment file and configure:

   ```bash
   copy .env.example .env
   ```

4. Edit `.env` file with your configuration:
   - Set `JWT_SECRET` to a secure random string
   - Set `AZURE_PAT` to your Azure DevOps Personal Access Token
   - Configure other settings as needed

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Health & Status

- `GET /` - Welcome message and API info
- `GET /health` - Health check endpoint
- `GET /api/status` - Detailed server status

### Wiki Routes

- `GET /api/wiki/pages` - Get all wiki pages from Azure DevOps
- `GET /api/wiki/page/:id` - Get specific wiki page by ID
- `POST /api/wiki/search` - Search wiki pages

### Test Routes

- `POST /api/test` - Test endpoint for development

### Protected Routes

- `GET /api/protected` - Example protected route (requires authentication)

## Middlewares

### Built-in Express Middlewares

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging
- **JSON Parser**: Parse JSON request bodies
- **URL Encoded Parser**: Parse form data

### Custom Middlewares

- **Rate Limiter**: Prevents abuse (100 req/15min per IP)
- **Logger**: Custom request/response logging
- **Auth**: JWT token verification
- **Error Handler**: Centralized error handling

## Authentication

The server uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Include the token in the Authorization header:
   ```
   Authorization: Bearer your-jwt-token-here
   ```

## Environment Variables

| Variable      | Description                        | Default               |
| ------------- | ---------------------------------- | --------------------- |
| `PORT`        | Server port                        | 5000                  |
| `NODE_ENV`    | Environment                        | development           |
| `JWT_SECRET`  | JWT signing secret                 | Required              |
| `AZURE_PAT`   | Azure DevOps Personal Access Token | Required              |
| `CORS_ORIGIN` | Allowed CORS origin                | http://localhost:3000 |

## Error Handling

The server includes comprehensive error handling:

- Validation errors
- Authentication errors
- Rate limit errors
- Database errors (if applicable)
- Generic server errors

All errors return a consistent JSON format:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-07-14T..."
}
```

## Security Features

- **Helmet**: Sets various HTTP headers
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configurable cross-origin requests
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Prevents malicious input

## Development

### Adding New Routes

1. Create route file in `routes/` directory
2. Import and use in `server.js`

### Adding New Middlewares

1. Create middleware file in `middlewares/` directory
2. Import and use in `server.js`

### Testing

Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get wiki pages
curl http://localhost:5000/api/wiki/pages

# Test protected route
curl -H "Authorization: Bearer your-token" http://localhost:5000/api/protected
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Configure environment variables securely

## Contributing

1. Follow the existing code structure
2. Add appropriate error handling
3. Include logging where necessary
4. Test all endpoints before committing
