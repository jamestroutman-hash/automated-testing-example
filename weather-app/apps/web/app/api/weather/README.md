# Weather API Documentation

RESTful API for storing and retrieving weather data using in-memory storage.

## Overview

This API provides endpoints for storing temperature data by zipcode and date, and retrieving that data. All data is stored in memory and will be lost when the server restarts.

## Base URL

```
http://localhost:3000/api/weather
```

## Endpoints

### POST /api/weather

Store weather data for a specific zipcode and date.

#### Request

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "zipcode": "90210",
  "date": "2025-11-13",
  "temperature": 72
}
```

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| zipcode | string | Yes | Exactly 5 numeric digits (e.g., "90210") |
| date | string | Yes | Date in YYYY-MM-DD format (e.g., "2025-11-13") |
| temperature | number | Yes | Temperature in Fahrenheit, range -50 to 150 (inclusive) |

#### Response

**Success (201 Created):**
```json
{
  "zipcode": "90210",
  "date": "2025-11-13",
  "temperature": 72
}
```

**Validation Error (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "zipcode": "Zipcode must be exactly 5 numeric digits",
    "date": "Date must be in YYYY-MM-DD format",
    "temperature": "Temperature must be between -50 to 150 Fahrenheit"
  }
}
```

**Server Error (500 Internal Server Error):**
```json
{
  "error": "An unexpected error occurred"
}
```

#### Example using curl

```bash
# Store weather data
curl -X POST http://localhost:3000/api/weather \
  -H "Content-Type: application/json" \
  -d '{
    "zipcode": "90210",
    "date": "2025-11-13",
    "temperature": 72
  }'
```

---

### GET /api/weather

Retrieve weather data by zipcode, optionally filtered by date.

#### Request

**Method:** `GET`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| zipcode | string | Yes | Exactly 5 numeric digits (e.g., "90210") |
| date | string | No | Date in YYYY-MM-DD format (e.g., "2025-11-13") |

#### Response

**Success - Specific Date (200 OK):**

When `date` parameter is provided:
```json
{
  "temperature": 72
}
```

If date not found:
```json
{
  "temperature": null
}
```

**Success - All Dates (200 OK):**

When only `zipcode` parameter is provided:
```json
{
  "data": {
    "2025-11-13": 72,
    "2025-11-14": 75,
    "2025-11-15": 68
  }
}
```

If zipcode not found:
```json
{
  "data": null
}
```

**Validation Error (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "zipcode": "Zipcode must be exactly 5 numeric digits"
  }
}
```

**Server Error (500 Internal Server Error):**
```json
{
  "error": "An unexpected error occurred"
}
```

#### Example using curl

```bash
# Get temperature for specific zipcode and date
curl "http://localhost:3000/api/weather?zipcode=90210&date=2025-11-13"

# Get all temperatures for a zipcode
curl "http://localhost:3000/api/weather?zipcode=90210"
```

---

## Validation Rules

### Temperature
- Must be a numeric value (integer or decimal)
- Must be between -50 and 150 Fahrenheit (inclusive)
- Examples: `-50`, `0`, `72.5`, `150`

### Date
- Must be in strict YYYY-MM-DD format
- Must be a valid calendar date
- **Valid:** `2025-11-13`, `2025-01-01`, `2025-12-31`
- **Invalid:** `11/13/2025`, `2025-13-01`, `2025-02-30`, `2025-11-13T00:00:00Z`

### Zipcode
- Must be exactly 5 numeric digits
- No letters, spaces, or special characters
- **Valid:** `90210`, `02134`, `12345`
- **Invalid:** `90210-1234` (ZIP+4), `1234` (too short), `abcde` (letters)

---

## HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Successful GET request (including when data not found) |
| 201 | Created | Successful POST request (data stored) |
| 400 | Bad Request | Validation error or malformed request |
| 500 | Internal Server Error | Unexpected server error |

**Important:** This API never returns 404 (Not Found). When data doesn't exist, it returns 200 with `null` values.

---

## Error Response Format

All error responses follow this consistent structure:

```json
{
  "error": "Human-readable error message",
  "details": {
    "field_name": "Field-specific error message"
  }
}
```

The `details` object contains field-specific validation errors, with field names as keys and error messages as values.

---

## Data Storage

- **In-Memory Only:** All data is stored in memory and will be lost when the server restarts
- **Data Structure:** `{ [zipcode]: { [date]: temperature } }`
- **Duplicates:** Submitting the same zipcode/date combination multiple times will silently overwrite previous values
- **No Metadata:** Only zipcode, date, and temperature are stored (no timestamps, IDs, etc.)

---

## Testing

To run the test suite:

```bash
npm test
```

Test files are located in:
- `__tests__/validation.test.ts` - Validation layer tests
- `__tests__/post.test.ts` - POST endpoint tests
- `__tests__/get.test.ts` - GET endpoint tests
- `__tests__/integration.test.ts` - End-to-end integration tests

---

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/weather`.

---

## Notes for Interview Candidates

This API is designed for simplicity and testability:

- Predictable validation rules for easy test case creation
- Consistent error response format
- Empty results return 200 (not 404) for reliable assertions
- In-memory storage for fast test execution
- No authentication or rate limiting to focus on core functionality

When writing tests for this API, focus on:
- Happy path: successful storage and retrieval
- Validation: ensure all validation rules are enforced
- Error handling: verify error responses match specification
- Edge cases: empty results, duplicates, etc.
