# Specification: Roadmap 8 - Comprehensive Validation & Error Handling

## Goal
Implement production-ready server-side and client-side validation across all API endpoints and forms with consistent error handling, user-friendly error messages, and proper edge case handling to complete the weather app's testable feature set.

## User Stories
- As a weather data administrator, I want immediate feedback on invalid form inputs so that I can correct errors before submission
- As an API consumer, I want consistent, field-specific error responses so that I can programmatically handle validation failures

## Specific Requirements

**Server-Side Temperature Validation**
- Validate temperature is a numeric value (not NaN, null, undefined, or string)
- Enforce range: -100°F to 150°F (inclusive)
- Error message MUST include actual limits: "Temperature must be between -100°F and 150°F"
- Update existing validation in `/weather-app/apps/web/lib/validation.ts` from current -50°F to 150°F range to -100°F to 150°F
- Apply validation in POST /api/weather endpoint

**Server-Side Zipcode Validation**
- Validate zipcode matches regex: `^\d{5}$` (exactly 5 numeric digits)
- Reject ZIP+4 format, letters, spaces, dashes, or any non-5-digit format
- Error message: "Invalid zipcode format. Must be 5 digits"
- Apply validation in POST /api/weather and GET /api/weather endpoints
- Reuse existing validation logic from `/weather-app/apps/web/lib/validation.ts`

**Server-Side Date Validation**
- Validate date matches strict YYYY-MM-DD format using regex
- Validate date is a valid calendar date (reject dates like 2025-02-30)
- Error message: "Invalid date format. Use YYYY-MM-DD"
- Apply validation in POST /api/weather and GET /api/weather endpoints
- Reuse existing validation logic from `/weather-app/apps/web/lib/validation.ts`

**Consistent API Error Response Structure**
- Update ALL existing API endpoints to use field-specific error format: `{ "errors": { "field": "message" } }`
- Replace current error format `{ "error": "...", "details": {...} }` with new format
- Update POST /api/weather to return: `{ "errors": { "temperature": "...", "date": "...", "zipcode": "..." } }`
- Update GET /api/weather to return same error structure for validation failures
- Include 400 status code for all validation errors
- Include 500 status code for unexpected server errors

**React Hook Form Integration**
- Replace manual form handling in `/weather-app/apps/web/app/admin/WeatherForm.tsx` with React Hook Form
- Install `react-hook-form` npm package if not already present
- Implement client-side validation rules matching server-side validation (temperature range, zipcode format, date format)
- Display validation errors inline near form fields
- Disable submit button when validation errors exist
- Provide immediate feedback on blur and onChange events

**Toast Notification Error Display**
- Reuse existing `react-hot-toast` library (already present in dependencies)
- Reuse existing ToastProvider configuration from `/weather-app/apps/web/app/admin/ToastProvider.tsx`
- Display all API validation errors via toast notifications
- Show field-specific error messages when multiple fields have errors
- Display network errors with message: "Network error. Please check your connection and try again."
- Display generic server errors with message: "An unexpected error occurred"

**Edge Case: Duplicate Entry Handling**
- When same zipcode + date combination is submitted, update existing record (upsert behavior)
- Maintain existing dataStore Map structure in `/weather-app/apps/web/app/api/weather/dataStore.ts`
- Return 201 status code with updated data
- No error message needed for duplicate updates

**Edge Case: Missing Required Fields**
- Reject partial data submissions where any field is missing
- All fields required: temperature, date, zipcode
- Return field-specific error for each missing field: "[Field] is required"
- Use 400 status code with errors object

**Edge Case: Invalid Data Type Handling**
- Validate temperature is numeric before range checking
- Return error "Temperature must be a numeric value" if NaN, null, undefined, or string
- Validate date and zipcode are strings before format checking
- Handle JSON parsing errors with 400 status and message "Invalid JSON in request body"

**Profile Page Validation Consistency**
- Update `/weather-app/apps/web/app/profile/ProfileForm.tsx` to use same validation error display pattern
- Use toast notifications for save success/failure (already implemented)
- Maintain existing localStorage storage for zipcode
- Apply consistent zipcode validation using shared validation functions

## Visual Design
No visual assets provided for this specification.

## Existing Code to Leverage

**Shared Validation Functions: `/weather-app/apps/web/lib/validation.ts`**
- Contains reusable validation functions for temperature, date, and zipcode
- Used by both client-side forms and server-side API validation
- Update `validateTemperature` function to change range from -50°F to 150°F to -100°F to 150°F
- Update error message in `validateTemperature` to include actual limits
- Keep existing ValidationError type structure: `{ field: string, message: string } | null`

**Toast Library: `react-hot-toast`**
- Already installed in package.json dependencies
- ToastProvider configured in `/weather-app/apps/web/app/admin/ToastProvider.tsx` with consistent styling
- Reuse existing toast.success() and toast.error() calls throughout the app
- Configuration: top-center position, 4000ms duration, dark theme with green success and red error icons

**Admin Form Structure: `/weather-app/apps/web/app/admin/WeatherForm.tsx`**
- Has existing form inputs for temperature, date, and zipcode
- Currently uses manual state management with useState
- Replace with React Hook Form's useForm hook and register function
- Keep existing error display div structure with styles.errorDisplay and styles.errorList
- Maintain disabled state during submission to prevent double submits

**API Route Handler: `/weather-app/apps/web/app/api/weather/route.ts`**
- Contains POST and GET handlers for weather data
- Uses validateWeatherData orchestrator function from validation.ts
- Update error response format from `{ error: "...", details: {...} }` to `{ errors: {...} }`
- Keep existing 201 status for successful POST, 200 status for successful GET
- Maintain try-catch blocks for unexpected errors with 500 status

**API Types: `/weather-app/apps/web/app/api/weather/types.ts`**
- Update ErrorResponse interface from `{ error: string; details?: Record<string, string> }` to `{ errors: Record<string, string> }`
- Keep WeatherData interface unchanged: `{ zipcode: string; date: string; temperature: number }`
- Keep ValidationError type as re-export from shared validation module

## Out of Scope
- Rate limiting or request throttling mechanisms
- CSRF protection tokens
- Advanced security features like input sanitization for XSS
- Multi-step validation flows or wizard-style forms
- Complex authentication or authorization validation
- Database-level constraints or migrations (using in-memory Map storage)
- Email validation or notification on errors
- Custom error logging or monitoring integration
- Internationalization (i18n) of error messages
- Validation for future features not yet implemented in the codebase
