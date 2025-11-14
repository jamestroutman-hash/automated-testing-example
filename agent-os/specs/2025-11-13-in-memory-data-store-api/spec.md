# Specification: In-Memory Data Store API

## Goal
Create a RESTful API for storing and retrieving weather data (temperature, date, zipcode) using in-memory storage, designed as the foundational backend for a weather app used in interview assessments for testing automation skills.

## User Stories
- As a weather app client, I want to store weather data for a specific zipcode and date so that I can later retrieve historical temperature information
- As a weather app client, I want to retrieve temperature data by zipcode and optional date so that I can display weather information to users

## Specific Requirements

**POST /api/weather Endpoint**
- Accept JSON request body with three required fields: zipcode, date, temperature
- Store temperature value in in-memory data structure using nested object pattern: { [zipcode]: { [date]: temperature } }
- Return 201 status code with stored data on successful storage
- Validate all three fields before storing and return 400 with structured error details if validation fails
- No duplicate entry handling - if same zipcode/date combination is submitted, silently accept (no update or overwrite logic needed)

**GET /api/weather Endpoint**
- Accept query parameters: zipcode (required), date (optional)
- When date is provided: return temperature for that specific zipcode and date
- When date is omitted: return all dates and their temperatures for the given zipcode
- Return 200 status with empty result structure when zipcode exists but has no data for specified date
- Return 200 status with empty result structure when zipcode has never been stored (do not use 404)
- Validate zipcode format and return 400 with error details if invalid

**Temperature Validation Rules**
- Must be a numeric value (integer or decimal)
- Must fall within range of -50 to 150 Fahrenheit (inclusive)
- Store in Fahrenheit only (no conversion on storage)
- Return 400 status with field-specific error message if validation fails

**Date Format Validation**
- Must strictly match YYYY-MM-DD format (e.g., 2025-11-13)
- Reject any other date formats including MM/DD/YYYY, DD-MM-YYYY, ISO 8601 with time
- Validate that date components form valid calendar date (e.g., reject 2025-13-01 or 2025-02-30)
- Return 400 status with clear error message indicating required format if validation fails

**Zipcode Validation**
- Must be exactly 5 numeric digits (e.g., 90210, 02134)
- Reject ZIP+4 format (e.g., 90210-1234)
- Reject any non-numeric characters including spaces or dashes
- Return 400 status with error message if validation fails

**Error Response Structure**
- Use consistent JSON format: { error: "Human-readable error message", details: {...} }
- Include field-specific validation errors in details object with field names as keys
- Return 400 status for all validation errors
- Return 500 status for unexpected server errors with generic error message (do not expose internal details)
- Ensure error messages are clear and actionable for API consumers

**In-Memory Data Structure**
- Use nested JavaScript object: { [zipcode]: { [date]: temperature } }
- No additional metadata fields (no timestamps, IDs, user tracking, etc.)
- Data persists only while server is running (lost on restart - this is expected behavior)
- Initialize as empty object on server start
- Access data structure directly without database queries or ORM

**HTTP Status Code Standards**
- 200: Successful GET request (including empty results)
- 201: Successful POST request (data stored)
- 400: Validation error (invalid zipcode, date, or temperature)
- 500: Server error (unexpected failures)

## Visual Design

No visual assets provided for this backend API feature.

## Existing Code to Leverage

**Next.js 16 App Router Pattern**
- Use Next.js App Router API route structure: create route.ts file in app/api/weather directory
- Export named functions GET and POST for handling respective HTTP methods
- Return NextResponse objects with appropriate status codes and JSON bodies
- Use TypeScript for type safety on request/response objects

**Next.js Request/Response Objects**
- Access request body using await request.json() in POST handler
- Access query parameters using request.nextUrl.searchParams in GET handler
- Return responses using NextResponse.json(data, { status: statusCode })
- Handle async operations with async/await pattern

## Out of Scope
- Bulk data insertion (only single entry per POST request)
- Data deletion endpoints (no DELETE method)
- Data update or overwrite endpoints (no PUT or PATCH methods)
- Pagination of results (return all dates for a zipcode without limits)
- Date range filtering (only exact date match or all dates)
- Temperature display in Celsius (store and return Fahrenheit only)
- Data persistence beyond memory (no database, no file storage)
- Authentication or authorization
- Rate limiting or throttling
- Data export or import features
