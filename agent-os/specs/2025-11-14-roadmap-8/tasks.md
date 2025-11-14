# Task Breakdown: Roadmap 8 - Comprehensive Validation & Error Handling

## Overview
Total Tasks: 4 Task Groups
Feature: Implement production-ready validation and consistent error handling across all API endpoints and forms

## Task List

### Foundation Layer

#### Task Group 1: Shared Validation & Type Updates
**Dependencies:** None

- [x] 1.0 Complete foundation layer updates
  - [x] 1.1 Write 2-8 focused tests for validation functions
    - Test validateTemperature with new -100°F to 150°F range
    - Test validateTemperature with edge cases (NaN, null, undefined, string values)
    - Test error message includes actual limits in message text
    - Test validateZipcode with valid and invalid formats
    - Test validateDate with valid YYYY-MM-DD and invalid formats
    - Skip exhaustive edge case coverage
  - [x] 1.2 Update validation.ts temperature range
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/lib/validation.ts`
    - Change temperature range from -50°F to 150°F to -100°F to 150°F
    - Update error message to: "Temperature must be between -100°F and 150°F"
    - Ensure message includes actual numeric limits
  - [x] 1.3 Update error message formats for all validators
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/lib/validation.ts`
    - Temperature error: "Temperature must be between -100°F and 150°F"
    - Date error: "Invalid date format. Use YYYY-MM-DD"
    - Zipcode error: "Invalid zipcode format. Must be 5 digits"
    - Keep ValidationError type structure unchanged: `{ field: string, message: string } | null`
  - [x] 1.4 Add missing field validation helper
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/lib/validation.ts`
    - Create validateRequiredFields function
    - Returns array of ValidationError for any missing required fields
    - Error format: "[Field] is required"
  - [x] 1.5 Update API types for new error format
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/types.ts`
    - Change ErrorResponse interface from `{ error: string; details?: Record<string, string> }` to `{ errors: Record<string, string> }`
    - Keep WeatherData interface unchanged
    - Keep ValidationError type re-export unchanged
  - [x] 1.6 Ensure foundation layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify new temperature range works correctly
    - Verify error messages include actual limits
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Temperature validation enforces -100°F to 150°F range
- Error messages are user-friendly and include actual limits
- All validation functions use consistent error message format
- ErrorResponse type updated to new field-specific format

### API Layer

#### Task Group 2: API Error Handling & Validation
**Dependencies:** Task Group 1

- [x] 2.0 Complete API layer updates
  - [x] 2.1 Write 2-8 focused tests for API endpoints
    - Test POST /api/weather with valid data returns 201 with new error format
    - Test POST /api/weather with invalid temperature returns 400 with field-specific errors
    - Test POST /api/weather with missing required fields returns 400 with all missing field errors
    - Test GET /api/weather with invalid zipcode returns 400 with new error format
    - Test duplicate zipcode+date updates existing record (upsert)
    - Skip exhaustive testing of all validation scenarios
  - [x] 2.2 Update POST /api/weather validation error responses
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/route.ts`
    - Replace current error format `{ error: "...", details: {...} }` with `{ errors: {...} }`
    - Use validateRequiredFields to check for missing fields
    - Return 400 with field-specific errors object: `{ errors: { "temperature": "message", ... } }`
    - Handle invalid JSON with: `{ errors: { "body": "Invalid JSON in request body" } }`
    - Keep 201 status for successful POST
    - Keep upsert behavior (duplicate zipcode+date updates existing)
  - [x] 2.3 Update GET /api/weather validation error responses
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/route.ts`
    - Replace current error format with new `{ errors: {...} }` format
    - Missing zipcode error: `{ errors: { "zipcode": "Zipcode is required" } }`
    - Invalid zipcode format: Use error from validateZipcode function
    - Invalid date format: Use error from validateDate function
    - Keep 200 status for successful GET
    - Keep graceful handling when no data found (return null)
  - [x] 2.4 Update validation.ts validateWeatherData orchestrator
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/validation.ts`
    - Update to return errors object format: `{ errors: Record<string, string> }`
    - Collect all validation errors before returning (don't fail fast)
    - Validate data type before validation (check temperature is numeric)
    - Return type safe numeric check error before range validation
  - [x] 2.5 Update server error responses
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/route.ts`
    - Keep 500 status code for unexpected errors
    - Update format to: `{ errors: { "server": "An unexpected error occurred" } }`
    - Maintain try-catch blocks in POST and GET handlers
  - [x] 2.6 Ensure API layer tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify new error response format is used consistently
    - Verify validation errors are field-specific
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- All API endpoints use consistent `{ errors: {...} }` format
- Field-specific error messages returned for all validation failures
- Missing required fields return errors for each missing field
- Duplicate entries update existing records (upsert)
- Invalid JSON parsing returns appropriate error
- 400 status for validation errors, 500 for server errors

### Frontend Layer

#### Task Group 3: React Hook Form Integration & Error Display
**Dependencies:** Task Group 2

- [x] 3.0 Complete frontend validation updates
  - [x] 3.1 Write 2-8 focused tests for form components
    - Test WeatherForm validates temperature range client-side
    - Test WeatherForm displays field-specific errors from API
    - Test WeatherForm disables submit when validation errors exist
    - Test WeatherForm shows toast notification for API errors
    - Test ProfileForm validates zipcode format client-side
    - Skip exhaustive testing of all form states and interactions
  - [x] 3.2 Install React Hook Form dependency
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/package.json`
    - Run: `npm install react-hook-form` from weather-app directory
    - Verify package added to dependencies
  - [x] 3.3 Replace WeatherForm state management with React Hook Form
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/WeatherForm.tsx`
    - Replace useState formData with useForm hook from react-hook-form
    - Replace manual handleChange with register function
    - Keep existing error display structure (styles.errorDisplay, styles.errorList)
    - Maintain disabled state during submission
  - [x] 3.4 Add client-side validation rules to WeatherForm
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/WeatherForm.tsx`
    - Temperature: required, numeric, min: -100, max: 150
    - Date: required, pattern: YYYY-MM-DD format
    - Zipcode: required, pattern: 5 digits
    - Provide immediate feedback on blur and onChange events
    - Use React Hook Form's validation mode: "onBlur"
  - [x] 3.5 Update WeatherForm API error handling
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/WeatherForm.tsx`
    - Update fetch response parsing to expect new `{ errors: {...} }` format
    - Display all field-specific errors via toast notifications
    - Map API errors to form field errors using React Hook Form's setError
    - Handle network errors: "Network error. Please check your connection and try again."
    - Handle 500 errors: "An unexpected error occurred"
    - Keep existing toast.success() for successful submission
  - [x] 3.6 Update WeatherForm error display
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/WeatherForm.tsx`
    - Display validation errors inline near form fields
    - Show both client-side and server-side errors
    - Keep existing error display area at top of form
    - Disable submit button when validation errors exist
  - [x] 3.7 Update ProfileForm validation consistency
    - File: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/profile/ProfileForm.tsx`
    - Keep existing validation pattern (already using validateZipcode)
    - Verify error messages match new format: "Invalid zipcode format. Must be 5 digits"
    - Maintain existing toast notifications for save success/failure
    - Keep localStorage storage for zipcode
  - [x] 3.8 Ensure frontend layer tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify React Hook Form integration works correctly
    - Verify client-side validation provides immediate feedback
    - Verify API errors display via toast notifications
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- WeatherForm uses React Hook Form for validation
- Client-side validation rules match server-side validation
- Validation errors display inline and via toast notifications
- Submit button disabled when validation errors exist
- API errors parsed and displayed with new format
- ProfileForm maintains consistent validation approach

### Testing & Integration

#### Task Group 4: Test Review, Gap Analysis & Integration Testing
**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review tests from Task Groups 1-3
    - Reviewed tests for validation functions (Task 1.1): 15 tests
    - Reviewed tests for API endpoints (Task 2.1): 19 tests
    - Reviewed tests for form components (Task 3.1): 11 tests
    - Total existing tests from Task Groups 1-3: 45 tests
  - [x] 4.2 Analyze test coverage gaps for THIS feature only
    - Identified critical user workflows needing test coverage
    - Focused on integration points between frontend and backend
    - Checked edge case coverage: duplicates, missing fields, invalid data types
    - Verified error message format consistency across all endpoints
    - Did NOT assess entire application test coverage
    - Prioritized validation layer integration tests
  - [x] 4.3 Write up to 10 additional strategic tests maximum
    - Edge case test: Temperature validation with boundary values (-100, 150)
    - Edge case test: Date validation with invalid calendar dates (2025-02-30, leap years)
    - Cross-component test: Profile form and Weather form use same zipcode validation
    - Error format test: Validation layer returns errors object format for all field types
    - Error format test: Error messages include specific helpful information
    - Error format test: Valid data returns null (no errors)
    - Integration test: Multiple validation errors collected in single errors object
    - Edge case test: Temperature type validation before range validation
    - Integration test: Consistent error field names match input field names
    - Integration test: Empty or whitespace-only values treated as invalid
    - Total additional tests: 10 strategic tests
  - [x] 4.4 Run feature-specific tests only
    - Ran ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, and 4.3)
    - Total tests run: 46 tests
    - All critical validation workflows pass
    - Consistent error format verified across all endpoints
    - React Hook Form integration works correctly
    - Did NOT run the entire application test suite

**Acceptance Criteria:**
- All feature-specific tests pass (46 tests total)
- Critical user workflows covered: form validation, API validation, error display
- Edge cases verified: boundary values, invalid calendar dates, type checking
- Error format consistency verified across all API endpoints and validation layer
- Integration between frontend forms and backend validation verified
- Exactly 10 additional tests added to fill critical testing gaps

## Execution Order

Recommended implementation sequence:
1. Foundation Layer (Task Group 1) - Update shared validation functions and types
2. API Layer (Task Group 2) - Update all API endpoints to new error format
3. Frontend Layer (Task Group 3) - Integrate React Hook Form and update error handling
4. Testing & Integration (Task Group 4) - Verify end-to-end workflows and fill critical gaps

## Key Technical Details

### Temperature Validation
- Range: -100°F to 150°F (inclusive)
- Error message MUST include limits: "Temperature must be between -100°F and 150°F"
- Validate data type before range check
- Reject NaN, null, undefined, string values

### Zipcode Validation
- Format: Exactly 5 numeric digits
- Regex: `^\d{5}$`
- Error message: "Invalid zipcode format. Must be 5 digits"
- Reject ZIP+4, letters, spaces, dashes

### Date Validation
- Format: YYYY-MM-DD (strict)
- Validate calendar validity (reject 2025-02-30)
- Error message: "Invalid date format. Use YYYY-MM-DD"

### Error Response Format
- New format: `{ "errors": { "field": "message", ... } }`
- Old format to replace: `{ "error": "...", "details": {...} }`
- Apply to ALL existing API endpoints
- 400 status for validation errors
- 500 status for server errors

### Edge Cases
- Duplicates: Update existing record (upsert behavior)
- Missing fields: Return error for each missing required field
- Invalid JSON: Return `{ "errors": { "body": "Invalid JSON in request body" } }`
- No data found: Graceful handling with null return

### React Hook Form Configuration
- Validation mode: "onBlur" for immediate feedback
- Display errors: Inline near fields + error summary at top
- Toast notifications: Use react-hot-toast for API errors
- Submit button: Disabled when validation errors exist

### Files Modified
1. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/lib/validation.ts`
2. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/types.ts`
3. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/route.ts`
4. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/weather/validation.ts`
5. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/WeatherForm.tsx`
6. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/profile/ProfileForm.tsx`
7. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/package.json` (add react-hook-form)
8. `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/roadmap8-integration.test.tsx` (NEW - Task Group 4)
