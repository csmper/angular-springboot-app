# API Testing Guide

This document provides curl commands and Postman examples for testing the API endpoints.

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "testuser",
  "email": "testuser@example.com"
}
```

## User Management Endpoints (Protected)

### 3. Get All Users
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "testuser",
    "email": "testuser@example.com"
  },
  {
    "id": 2,
    "username": "anotheruser",
    "email": "another@example.com"
  }
]
```

### 4. Get User by ID
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Response:**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "testuser@example.com"
}
```

### 5. Delete User
```bash
curl -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Testing Workflow

1. **Register a user:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}')
```

2. **Login and save token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' | jq -r '.token')
```

3. **Use token for protected endpoints:**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN"
```

## Postman Collection

### Import these requests into Postman:

**Environment Variables:**
- `base_url`: http://localhost:8080/api
- `jwt_token`: (will be set after login)

**Collection:**

1. **Register**
   - Method: POST
   - URL: {{base_url}}/auth/register
   - Body (JSON):
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login**
   - Method: POST
   - URL: {{base_url}}/auth/login
   - Body (JSON):
   ```json
   {
     "username": "testuser",
     "password": "password123"
   }
   ```
   - Tests (to save token):
   ```javascript
   pm.environment.set("jwt_token", pm.response.json().token);
   ```

3. **Get All Users**
   - Method: GET
   - URL: {{base_url}}/users
   - Headers:
     - Authorization: Bearer {{jwt_token}}

4. **Get User by ID**
   - Method: GET
   - URL: {{base_url}}/users/1
   - Headers:
     - Authorization: Bearer {{jwt_token}}

5. **Delete User**
   - Method: DELETE
   - URL: {{base_url}}/users/1
   - Headers:
     - Authorization: Bearer {{jwt_token}}

## Common Error Responses

### 400 Bad Request
```json
{
  "message": "Username is already taken"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid username or password"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2024-01-15T10:00:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/users"
}
```

### 404 Not Found
```json
{
  "message": "User not found with id: 999"
}
```

## Testing Tips

1. **Save the JWT token** after login for subsequent requests
2. **Token expires after 24 hours** (configurable in application.properties)
3. **Use environment variables** in Postman for easier testing
4. **Check CORS settings** if testing from different origin
5. **Verify database connection** before testing endpoints
