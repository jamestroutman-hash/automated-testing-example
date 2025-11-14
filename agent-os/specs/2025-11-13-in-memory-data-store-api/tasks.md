# Task Breakdown: In-Memory Data Store API

## Overview
Total Tasks: 5 major task groups with 27 sub-tasks
Feature: RESTful API for storing and retrieving weather data using in-memory storage
Tech Stack: Next.js 16 App Router (TypeScript), Turborepo monorepo
Location: /weather-app/apps/web/app/api/weather/

## Context
This is a greenfield implementation for a weather app designed as an interview assessment tool. The API provides the foundational backend that other features will depend on. Focus is on simplicity, testability, and predictable behavior for reliable test case creation.

## Task List

### Task Group 1: Project Setup & Data Store Infrastructure
**Dependencies:** None

- [x] 1.0 Set up data store infrastructure
  - [x] 1.1 Create API route directory structure
    - Create directory: /weather-app/apps/web/app/api/weather/
    - Ensure proper Next.js App Router conventions are followed
  - [x] 1.2 Create in-memory data store module
    - Create file: /weather-app/apps/web/app/api/weather/dataStore.ts
    - Initialize data structure: `{ [zipcode]: { [date]: temperature } }`
    - Export functions: `storeWeatherData()`, `getWeatherData()`
    - Use TypeScript types for type safety
    - Keep module simple and focused (no persistence, no metadata)
  - [x] 1.3 Define TypeScript types and interfaces
    - Create file: /weather-app/apps/web/app/api/weather/types.ts
    - Define: WeatherData interface (zipcode, date, temperature)
    - Define: ErrorResponse interface (error, details)
    - Define: ValidationError type for field-specific errors
    - Export all types for reuse across validation and route handlers

**Acceptance Criteria:**
- Directory structure follows Next.js 16 App Router conventions
- In-memory data store module is created with proper TypeScript types
- Data structure matches specification: `{ [zipcode]: { [date]: temperature } }`
- All types and interfaces are properly defined and exported

**Implementation Notes:**
- This is a greenfield implementation - no existing code to reference
- Keep data store simple: no timestamps, IDs, or metadata
- Data will be lost on server restart (expected behavior)

---

### Task Group 2: Validation Layer
**Dependencies:** Task Group 1 (requires types.ts)

- [x] 2.0 Complete validation layer
  - [x] 2.1 Write 2-8 focused tests for validation functions
    - Create file: /weather-app/apps/web/app/api/weather/__tests__/validation.test.ts
    - Test temperature validation: valid range (-50 to 150), numeric requirement
    - Test date validation: YYYY-MM-DD format, valid calendar dates
    - Test zipcode validation: exactly 5 digits, numeric only
    - Limit to 2-8 highly focused tests maximum
    - Test only critical validation behaviors, skip exhaustive edge cases
  - [x] 2.2 Create temperature validation function
    - Create file: /weather-app/apps/web/app/api/weather/validation.ts
    - Validate numeric type (integer or decimal)
    - Validate range: -50 to 150 Fahrenheit (inclusive)
    - Return structured error object with field name and message
    - Keep validation logic simple and testable
  - [x] 2.3 Create date validation function
    - Add to validation.ts
    - Validate strict YYYY-MM-DD format using regex
    - Validate valid calendar date (reject 2025-13-01, 2025-02-30)
    - Reject other formats: MM/DD/YYYY, DD-MM-YYYY, ISO 8601 with time
    - Return structured error object with clear message
  - [x] 2.4 Create zipcode validation function
    - Add to validation.ts
    - Validate exactly 5 numeric digits
    - Reject ZIP+4 format (90210-1234)
    - Reject non-numeric characters, spaces, dashes
    - Return structured error object with field name and message
  - [x] 2.5 Create validation orchestrator function
    - Add to validation.ts: `validateWeatherData()`
    - Combine all field validations
    - Return aggregated errors in standard format: `{ error: string, details: {...} }`
    - Return null if all validations pass
    - Follow error handling best practices from standards
  - [x] 2.6 Ensure validation layer tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify critical validation behaviors work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Temperature validation enforces -50 to 150 range and numeric type
- Date validation enforces strict YYYY-MM-DD format and valid calendar dates
- Zipcode validation enforces exactly 5 numeric digits
- All validation functions return consistent error structure
- Validation orchestrator combines all validations correctly

**Implementation Notes:**
- Follow validation best practices: fail early, specific error messages, server-side enforcement
- Use allowlists over blocklists where possible
- Keep validation functions pure (no side effects)
- Error messages should be clear and actionable for API consumers

---

### Task Group 3: POST /api/weather Endpoint
**Dependencies:** Task Groups 1-2 (requires dataStore.ts, validation.ts, types.ts)

- [x] 3.0 Complete POST endpoint implementation
  - [x] 3.1 Write 2-8 focused tests for POST endpoint
    - Create file: /weather-app/apps/web/app/api/weather/__tests__/post.test.ts
    - Test successful data storage (201 status)
    - Test validation error response (400 status)
    - Test request body parsing
    - Limit to 2-8 highly focused tests maximum
    - Test only critical POST behaviors, skip exhaustive scenarios
  - [x] 3.2 Create route handler file
    - Create file: /weather-app/apps/web/app/api/weather/route.ts
    - Set up Next.js App Router structure
    - Export async POST function
    - Configure TypeScript for Next.js request/response types
  - [x] 3.3 Implement POST request body parsing
    - Use `await request.json()` to parse body
    - Handle JSON parsing errors with try-catch
    - Return 400 status for malformed JSON
    - Extract zipcode, date, temperature fields
  - [x] 3.4 Integrate validation layer
    - Call `validateWeatherData()` from validation.ts
    - If validation fails, return 400 with error response
    - Use error response format: `{ error: string, details: {...} }`
    - Include field-specific validation errors in details object
  - [x] 3.5 Implement data storage logic
    - Call `storeWeatherData()` from dataStore.ts
    - Store in nested structure: `{ [zipcode]: { [date]: temperature } }`
    - No duplicate handling - silently accept same zipcode/date
    - Return 201 status with stored data on success
  - [x] 3.6 Add error handling for unexpected failures
    - Wrap storage logic in try-catch
    - Return 500 status for unexpected errors
    - Use generic error message (do not expose internal details)
    - Follow centralized error handling patterns
  - [x] 3.7 Ensure POST endpoint tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify critical POST operations work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- POST endpoint accepts JSON with zipcode, date, temperature
- Validation errors return 400 with structured error details
- Successful storage returns 201 with stored data
- Malformed JSON returns 400 with clear error message
- Unexpected errors return 500 with generic message

**Implementation Notes:**
- Use NextResponse.json(data, { status: statusCode }) for all responses
- Follow Next.js 16 App Router conventions for route handlers
- No duplicate entry handling logic required (keep simple)
- Follow error handling best practices: fail fast, user-friendly messages

---

### Task Group 4: GET /api/weather Endpoint
**Dependencies:** Task Groups 1-3 (requires dataStore.ts, validation.ts, types.ts, route.ts)

- [x] 4.0 Complete GET endpoint implementation
  - [x] 4.1 Write 2-8 focused tests for GET endpoint
    - Create file: /weather-app/apps/web/app/api/weather/__tests__/get.test.ts
    - Test successful retrieval with zipcode and date (200 status)
    - Test retrieval with zipcode only (all dates)
    - Test empty results for non-existent data (200 status, not 404)
    - Limit to 2-8 highly focused tests maximum
    - Test only critical GET behaviors, skip exhaustive scenarios
  - [x] 4.2 Implement GET function in route handler
    - Add to existing /weather-app/apps/web/app/api/weather/route.ts
    - Export async GET function
    - Access query parameters using request.nextUrl.searchParams
    - Handle both zipcode-only and zipcode+date queries
  - [x] 4.3 Implement query parameter parsing and validation
    - Extract zipcode (required) and date (optional) from query params
    - Validate zipcode format using existing validation function
    - If date provided, validate date format using existing validation function
    - Return 400 with structured errors if validation fails
  - [x] 4.4 Implement data retrieval logic for zipcode+date
    - Call `getWeatherData()` from dataStore.ts with zipcode and date
    - Return 200 with temperature if found
    - Return 200 with empty result if zipcode exists but date not found
    - Use consistent response format
  - [x] 4.5 Implement data retrieval logic for zipcode only
    - Call `getWeatherData()` from dataStore.ts with zipcode only
    - Return 200 with all dates and temperatures for zipcode
    - Return 200 with empty result if zipcode never stored
    - Do NOT use 404 status for missing data (spec requirement)
  - [x] 4.6 Add error handling for unexpected failures
    - Wrap retrieval logic in try-catch
    - Return 500 status for unexpected errors
    - Use generic error message (do not expose internal details)
  - [x] 4.7 Ensure GET endpoint tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify critical GET operations work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- GET endpoint requires zipcode query parameter
- Date query parameter is optional
- Returns 200 with temperature when zipcode+date found
- Returns 200 with all dates when only zipcode provided
- Returns 200 with empty result for non-existent data (never 404)
- Query parameter validation returns 400 with structured errors
- Unexpected errors return 500 with generic message

**Implementation Notes:**
- IMPORTANT: Always return 200 for missing data, never 404 (spec requirement)
- Use NextResponse.json(data, { status: statusCode }) for consistency
- Empty result structure should be consistent and predictable
- Follow Next.js query parameter access pattern: request.nextUrl.searchParams

---

### Task Group 5: Integration Testing & Documentation
**Dependencies:** Task Groups 1-4 (all previous groups completed)

- [x] 5.0 Complete integration testing and documentation
  - [x] 5.1 Review existing tests and identify critical gaps
    - Review tests from Task Groups 2-4
    - Review the 2-8 tests written for validation (Task 2.1)
    - Review the 2-8 tests written for POST endpoint (Task 3.1)
    - Review the 2-8 tests written for GET endpoint (Task 4.1)
    - Total existing tests: approximately 6-24 tests
    - Identify critical end-to-end workflows that lack coverage
    - Focus ONLY on gaps related to this API feature
    - Do NOT assess entire application test coverage
  - [x] 5.2 Write up to 10 additional strategic tests maximum
    - Create file: /weather-app/apps/web/app/api/weather/__tests__/integration.test.ts
    - Focus on end-to-end workflows: POST then GET for same data
    - Test integration between validation, storage, and retrieval
    - Test error response consistency across endpoints
    - Maximum of 10 new tests to fill identified critical gaps
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests unless business-critical
  - [x] 5.3 Run all feature-specific tests
    - Run tests from validation.test.ts (Task 2.1)
    - Run tests from post.test.ts (Task 3.1)
    - Run tests from get.test.ts (Task 4.1)
    - Run tests from integration.test.ts (Task 5.2)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify all critical workflows pass
  - [x] 5.4 Create API documentation
    - Create file: /weather-app/apps/web/app/api/weather/README.md
    - Document POST /api/weather endpoint with examples
    - Document GET /api/weather endpoint with examples
    - Include validation rules and error response formats
    - Provide curl examples for both endpoints
    - Document HTTP status codes and their meanings
    - Keep documentation clear and concise for interview candidates
  - [x] 5.5 Add inline code comments for clarity
    - Add comments explaining validation logic
    - Add comments for error handling decisions
    - Add comments for data structure access patterns
    - Follow commenting best practices: explain "why" not "what"
    - Keep comments concise and meaningful
  - [x] 5.6 Verify feature completeness
    - Manually test POST endpoint with valid data
    - Manually test POST endpoint with invalid data
    - Manually test GET endpoint with zipcode only
    - Manually test GET endpoint with zipcode and date
    - Verify error responses match specification
    - Verify empty result handling returns 200 (not 404)
    - Confirm in-memory storage persists during server runtime

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- No more than 10 additional tests added when filling testing gaps
- Critical end-to-end workflows are covered by tests
- API documentation is clear and includes working examples
- Code has meaningful inline comments where helpful
- Manual testing confirms all requirements are met
- POST endpoint stores and returns data correctly (201 status)
- GET endpoint retrieves data correctly (200 status)
- Validation errors return 400 with structured details
- Empty results return 200 status (never 404)

**Implementation Notes:**
- This is designed for interview assessment - emphasize clarity and testability
- Documentation should help candidates understand expected behavior
- Tests should demonstrate predictable, reliable behavior
- Focus on simplicity - this is the foundation for other features

---

## Execution Order

Recommended implementation sequence:
1. **Task Group 1: Project Setup & Data Store Infrastructure** - Establish foundation
2. **Task Group 2: Validation Layer** - Build validation before using it
3. **Task Group 3: POST /api/weather Endpoint** - Implement storage first
4. **Task Group 4: GET /api/weather Endpoint** - Implement retrieval after storage
5. **Task Group 5: Integration Testing & Documentation** - Verify and document complete feature

## Key Technical Decisions

**Data Structure:**
- In-memory nested object: `{ [zipcode]: { [date]: temperature } }`
- No persistence, no metadata, no IDs
- Data lost on server restart (expected behavior)

**Validation Strategy:**
- Server-side only (no client in this spec)
- Fail early with clear, actionable error messages
- Consistent error response format across all endpoints
- Field-specific errors in details object

**Error Handling:**
- 200: Successful GET (including empty results)
- 201: Successful POST (data stored)
- 400: Validation errors (invalid input)
- 500: Server errors (unexpected failures)
- Never use 404 for missing data (spec requirement)

**Testing Approach:**
- Focus on critical behaviors during development (2-8 tests per group)
- Test-driven: write tests first, then implementation
- Verify only new tests during development (not entire suite)
- Add strategic integration tests at completion (max 10 tests)
- Total expected: 16-34 tests maximum

**Documentation Priority:**
- Clear API documentation with examples
- Meaningful inline comments (explain "why")
- Emphasis on simplicity for interview assessment context

## Standards Compliance

This task breakdown aligns with the following standards:

**Global Standards:**
- **Coding Style:** Small focused functions, meaningful names, DRY principle
- **Conventions:** Clear documentation, version control best practices
- **Error Handling:** User-friendly messages, fail fast, centralized handling
- **Validation:** Server-side validation, specific error messages, fail early

**Testing Standards:**
- **Test Coverage:** Minimal tests during development (2-8 per group)
- **Strategic Testing:** Focus on core user flows, defer edge cases
- **Test Organization:** Clear test names, mock external dependencies (none here)
- **Incremental Verification:** Run only new tests during development

**Tech Stack:**
- Next.js 16 App Router with TypeScript
- Turborepo monorepo structure
- No database (in-memory storage)
- No external dependencies for this feature

## Success Metrics

Feature is complete when:
- [x] All 5 task groups completed
- [x] All feature-specific tests pass (16-34 tests)
- [x] POST /api/weather stores data correctly
- [x] GET /api/weather retrieves data correctly
- [x] All validation rules enforced properly
- [x] Error responses follow specification exactly
- [x] Empty results return 200 status (never 404)
- [x] API documentation is clear with working examples
- [x] Manual testing confirms all requirements met
