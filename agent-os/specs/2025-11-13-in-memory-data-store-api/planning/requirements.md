# Spec Requirements: In-Memory Data Store API

## Initial Description

Backend API for weather data storage and retrieval using in-memory storage (no database).

**Context:**
- This is a weather app designed as an interview assessment tool for testing automation skills
- The app uses in-memory storage (no database) for simplicity
- Data includes: temperature, date, and zipcode
- This is the foundational feature that other features will depend on

**Core Requirements:**
- Store weather data in memory
- Retrieve weather data
- Data fields: temperature, date, zipcode

## Requirements Discussion

### First Round Questions

**Q1:** What should the API endpoint structure look like?
**Answer:** Approved - POST /api/weather for storing data and GET /api/weather for retrieval with query parameters for zipcode and optional date

**Q2:** What should the in-memory data structure be?
**Answer:** Use { [zipcode]: { [date]: temperature } } - just the core fields (zipcode, date, temperature), no metadata like timestamps

**Q3:** What are the temperature validation rules?
**Answer:**
- Save in Fahrenheit
- Range: -50 to 150 Fahrenheit
- Display Celsius via conversion if necessary (will be a separate spec later)

**Q4:** What date format should be enforced?
**Answer:** Only YYYY-MM-DD format - enforce single format and reject non-conforming requests

**Q5:** What zipcode validation rules should apply?
**Answer:** Exactly 5 numeric digits only (no ZIP+4 format)

**Q6:** How should "not found" scenarios be handled?
**Answer:** Return empty result with 200 status (not 404) for both cases:
- When zipcode exists but has no data for specific date
- When zipcode has never been stored

**Q7:** What error response format should be used?
**Answer:**
- Use { error: "Error message", details: {...} } structure
- Include field-specific validation errors in structured format
- Use appropriate HTTP status codes (400 for validation, 500 for server errors)

**Q8:** What features should be explicitly excluded from scope?
**Answer:** ALL of these are out of scope (keep it simple):
- Bulk data insertion
- Data deletion endpoints
- Data updates/overwriting
- Pagination
- Filtering by date ranges

### Existing Code to Reference

No similar existing features identified for reference. The codebase currently contains only the turbo repo example shell.

### Follow-up Questions

No follow-up questions were needed. All requirements were clearly specified in the initial round.

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

**Data Storage:**
- Store weather data in memory using nested object structure: { [zipcode]: { [date]: temperature } }
- POST /api/weather endpoint accepts: zipcode, date, temperature
- No metadata (timestamps, IDs, etc.) required
- No database persistence - pure in-memory storage

**Data Retrieval:**
- GET /api/weather endpoint with query parameters
- Required query parameter: zipcode
- Optional query parameter: date
- When date provided: return temperature for that specific date
- When date omitted: return all dates and temperatures for that zipcode

**Data Validation:**
- Temperature: Must be numeric, range -50 to 150 Fahrenheit
- Date: Must be YYYY-MM-DD format (strict enforcement, reject other formats)
- Zipcode: Must be exactly 5 numeric digits (no ZIP+4, no letters)

**Response Handling:**
- Empty results return 200 status with empty data structure (not 404)
- Validation errors return 400 status with structured error details
- Server errors return 500 status
- Error format: { error: "Error message", details: {...} }
- Field-specific validation errors included in details object

### Reusability Opportunities

None identified. This is a greenfield implementation with no existing similar features to reference.

### Scope Boundaries

**In Scope:**
- Single data entry storage via POST /api/weather
- Data retrieval for single zipcode via GET /api/weather
- Temperature storage in Fahrenheit only
- Validation of temperature, date, and zipcode
- Structured error responses
- Empty result handling with 200 status

**Out of Scope:**
- Bulk data insertion
- Data deletion endpoints
- Data updates/overwriting existing entries
- Pagination of results
- Date range filtering
- Celsius display (separate future spec)
- Data persistence beyond memory
- Authentication or authorization
- Rate limiting
- Data export features

### Technical Considerations

**Storage Approach:**
- In-memory only (no database setup required)
- Data structure: { [zipcode]: { [date]: temperature } }
- Data will be lost on server restart (expected behavior)

**API Design:**
- RESTful endpoint structure
- Standard HTTP status codes
- JSON request and response bodies

**Validation Strategy:**
- Strict format enforcement (reject non-conforming data)
- Range validation for temperature
- Format validation for date and zipcode
- Return clear, structured error messages

**Testing Priority:**
- This is for an interview assessment tool
- Simplicity and testability are key priorities
- Clear validation rules for easy test case creation
- Predictable error responses for test assertions

### Additional Context

**Interview Assessment Tool:**
- This feature is designed to be used for testing automation skills assessment
- Emphasis on simplicity to allow candidates to focus on test automation
- Predictable behavior for reliable test case creation
- Clear validation rules that can be easily tested

**Foundation for Future Features:**
- This API serves as the base layer for other weather app features
- Future features will depend on this data storage and retrieval mechanism
- Keeping scope minimal ensures quick delivery and stability for dependent features
