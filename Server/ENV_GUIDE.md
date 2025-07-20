# Environment Variables Guide

This document explains how to configure environment variables for the RGA Bot server.

## Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your actual values:
   ```bash
   nano .env
   # or
   code .env
   ```

## Environment Variables

### Server Configuration

- **`PORT`** (default: 5002)

  - Port number for the server to run on
  - Example: `PORT=5002`

- **`NODE_ENV`** (default: development)
  - Node.js environment mode
  - Values: `development`, `production`, `test`

### Azure DevOps Configuration

- **`AZURE_DEVOPS_PAT`** (required)

  - Personal Access Token for Azure DevOps
  - Must have read permissions for Wiki
  - Get from: Azure DevOps → User Settings → Personal Access Tokens

- **`AZURE_DEVOPS_PARENT_PATH`** (default: `/SDH: DF/Frontend`)
  - Wiki path to process for content fetching
  - Example: `/SDH: DF/Frontend`

### Wiki Processing Configuration

- **`CHUNK_SIZE`** (default: 500)

  - Maximum characters per text chunk
  - Larger values = fewer chunks but larger size
  - Example: `CHUNK_SIZE=500`

- **`BATCH_SIZE`** (default: 5)

  - Number of pages to process simultaneously
  - Lower values = slower but less API stress
  - Example: `BATCH_SIZE=5`

- **`DELAY_MS`** (default: 1000)
  - Delay in milliseconds between API request batches
  - Higher values = slower but safer for rate limits
  - Example: `DELAY_MS=1000`

### Security Configuration

- **`JWT_SECRET`** (required for auth features)
  - Secret key for JWT token signing
  - Generate a strong random string
  - Example: `JWT_SECRET=your-super-secret-key`

### CORS Configuration

- **`CORS_ORIGIN`** (default: http://localhost:3000)
  - Allowed origin for CORS requests
  - Set to your frontend URL
  - Example: `CORS_ORIGIN=http://localhost:3000`

### Rate Limiting

- **`RATE_LIMIT_WINDOW_MS`** (default: 900000)

  - Time window for rate limiting in milliseconds
  - Example: `RATE_LIMIT_WINDOW_MS=900000` (15 minutes)

- **`RATE_LIMIT_MAX_REQUESTS`** (default: 100)
  - Maximum requests per time window
  - Example: `RATE_LIMIT_MAX_REQUESTS=100`

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different values** for development and production
3. **Generate strong secrets** for JWT and other sensitive values
4. **Rotate tokens regularly** especially in production
5. **Use least-privilege access** for Azure DevOps PAT

## Environment-Specific Configurations

### Development

```bash
NODE_ENV=development
PORT=5002
AZURE_DEVOPS_PAT=your-dev-token
```

### Production

```bash
NODE_ENV=production
PORT=80
AZURE_DEVOPS_PAT=your-prod-token
JWT_SECRET=very-long-random-production-secret
```

## Validation

The application validates required environment variables on startup:

- `AZURE_DEVOPS_PAT` - Will throw error if missing
- Other variables have sensible defaults

## Troubleshooting

### Common Issues

1. **"AZURE_DEVOPS_PAT environment variable is required"**

   - Solution: Add your PAT to the `.env` file

2. **Wiki pages not fetching**

   - Check PAT permissions in Azure DevOps
   - Verify `AZURE_DEVOPS_PARENT_PATH` is correct

3. **Rate limiting errors**

   - Increase `DELAY_MS` value
   - Decrease `BATCH_SIZE` value

4. **Port already in use**
   - Change `PORT` value to an available port
   - Kill process using the current port
