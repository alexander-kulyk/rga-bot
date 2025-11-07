# Cat Collection API Documentation

This document describes the Cat collection API endpoints that have been added to the RGA Bot server.

## Overview

The Cat collection provides a RESTful API for managing cat records in the MongoDB database. All endpoints follow the same patterns as other collections in the application.

## Database Schema

Each cat document contains the following fields:

- `name` (String, required) - The name of the cat
- `age` (Number, optional) - The age of the cat
- `breed` (String, optional) - The breed of the cat
- `color` (String, optional) - The color of the cat
- `createdAt` (Date, auto-generated) - Timestamp when the cat was created
- `updatedAt` (Date, auto-generated) - Timestamp when the cat was last updated

## API Endpoints

All endpoints are prefixed with `/api/cats`.

### 1. Get All Cats

**GET** `/api/cats`

Retrieves all cats from the database, sorted by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "cats": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Whiskers",
      "age": 3,
      "breed": "Persian",
      "color": "White",
      "createdAt": "2025-11-07T16:00:00.000Z",
      "updatedAt": "2025-11-07T16:00:00.000Z"
    }
  ],
  "message": "Cats retrieved successfully"
}
```

### 2. Get Cat by ID

**GET** `/api/cats/:id`

Retrieves a specific cat by its ID.

**Parameters:**
- `id` (URL parameter) - The MongoDB ObjectID of the cat

**Response (Success):**
```json
{
  "success": true,
  "cat": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Whiskers",
    "age": 3,
    "breed": "Persian",
    "color": "White",
    "createdAt": "2025-11-07T16:00:00.000Z",
    "updatedAt": "2025-11-07T16:00:00.000Z"
  },
  "message": "Cat retrieved successfully"
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Cat not found"
}
```

### 3. Create New Cat

**POST** `/api/cats`

Creates a new cat record.

**Request Body:**
```json
{
  "name": "Mittens",
  "age": 2,
  "breed": "Siamese",
  "color": "Brown"
}
```

**Required Fields:**
- `name` - Must be provided

**Response:**
```json
{
  "success": true,
  "cat": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Mittens",
    "age": 2,
    "breed": "Siamese",
    "color": "Brown",
    "createdAt": "2025-11-07T16:30:00.000Z",
    "updatedAt": "2025-11-07T16:30:00.000Z"
  },
  "message": "Cat created successfully"
}
```

### 4. Update Cat

**PUT** `/api/cats/:id`

Updates an existing cat record. Only provided fields will be updated.

**Parameters:**
- `id` (URL parameter) - The MongoDB ObjectID of the cat

**Request Body:**
```json
{
  "age": 4,
  "color": "Gray"
}
```

**Response:**
```json
{
  "success": true,
  "cat": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Whiskers",
    "age": 4,
    "breed": "Persian",
    "color": "Gray",
    "createdAt": "2025-11-07T16:00:00.000Z",
    "updatedAt": "2025-11-07T16:35:00.000Z"
  },
  "message": "Cat updated successfully"
}
```

### 5. Delete Cat

**DELETE** `/api/cats/:id`

Deletes a cat record from the database.

**Parameters:**
- `id` (URL parameter) - The MongoDB ObjectID of the cat

**Response:**
```json
{
  "success": true,
  "message": "Cat deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Cat name is required"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Cat not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Failed to retrieve/create/update/delete cat",
  "error": "Error details"
}
```

## Example Usage

### Using cURL

```bash
# Create a cat
curl -X POST http://localhost:5002/api/cats \
  -H "Content-Type: application/json" \
  -d '{"name": "Fluffy", "age": 1, "breed": "Maine Coon", "color": "Orange"}'

# Get all cats
curl http://localhost:5002/api/cats

# Get specific cat
curl http://localhost:5002/api/cats/507f1f77bcf86cd799439011

# Update a cat
curl -X PUT http://localhost:5002/api/cats/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"age": 2}'

# Delete a cat
curl -X DELETE http://localhost:5002/api/cats/507f1f77bcf86cd799439011
```

### Using JavaScript (fetch)

```javascript
// Create a cat
const response = await fetch('http://localhost:5002/api/cats', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Shadow',
    age: 5,
    breed: 'Black Cat',
    color: 'Black'
  })
});
const data = await response.json();
console.log(data);

// Get all cats
const cats = await fetch('http://localhost:5002/api/cats')
  .then(res => res.json());
console.log(cats);
```

## Implementation Details

- **Model:** `Server/models/catSchema.js`
- **Controller:** `Server/controllers/catController.js`
- **Routes:** `Server/routes/cat.js`
- **Collection Name:** `cats` (in MongoDB)
- **Model Name:** `Cat`

## Notes

- All string fields are automatically trimmed
- Timestamps (`createdAt` and `updatedAt`) are automatically managed by Mongoose
- The implementation follows the same patterns as other collections (FileOptions, ModelConfigs) in the application
- All operations include proper error handling and validation
