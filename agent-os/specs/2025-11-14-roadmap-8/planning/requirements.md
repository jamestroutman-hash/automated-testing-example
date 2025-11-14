# Spec Requirements: Roadmap 8 - Comprehensive Validation & Error Handling

## Initial Description
Roadmap 8: Implement server-side validation for all inputs (temperature range, date format, zipcode format). Add user-friendly error messages throughout the application. Handle edge cases: missing zipcode, no data available, invalid dates. Create consistent error response structure across all API endpoints.

This is the final validation phase that ensures all testable edge cases are properly handled across the application, completing the weather app's foundational feature set.

## Requirements Discussion

### First Round Questions

**Q1:** For server-side validation, I'm assuming we need temperature range limits, strict 5-digit US zipcode format validation, and ISO date format (YYYY-MM-DD) validation. Are there any other validation rules you'd like to add?

**Answer:** Yes, exactly those three validation rules. No additional ones needed at this time.

**Q2:** For client-side validation, I'm thinking we should use React Hook Form or similar with built-in validation to provide immediate feedback before API calls. Should we implement this level of client-side validation, or would you prefer simpler HTML5 validation?

**Answer:** Yes, React Hook Form with built-in validation is perfect.

**Q3:** For user-facing error messages, I assume we should display validation errors inline near the form fields (for admin panel) and use toast notifications or similar for API errors elsewhere in the app. Do you have a preferred error display library or pattern already in use?

**Answer:** The app already has a toast library. Use that for all error messages throughout the app.

**Q4:** Edge cases to handle - I'm planning to address: duplicate entries (same zipcode + date), partial data submissions (missing required fields), and graceful fallbacks when no data exists for a zipcode/date combination. Should duplicate entries update existing records or be rejected? And should we allow partial records or require all fields?

**Answer:** Duplicates should update existing records. All fields are required - no partial data allowed.

**Q5:** For testing, should we include comprehensive test cases for all validation scenarios, or would you prefer a lighter testing approach initially?

**Answer:** Normal client-side validation is fine. This is meant to be a production-ready app, not just a proof-of-concept.

**Q6:** Are there any specific validations or error cases you want to explicitly exclude from this phase (e.g., rate limiting, CSRF protection, complex multi-step validation flows)?

**Answer:** Exclude rate limiting, throttling, CSRF protection, and any advanced security features. Focus on data validation only.

### Existing Code to Reference

**Similar Features Identified:**
- Admin form validation: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/page.tsx`
- Profile zipcode validation: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/profile/page.tsx`
- API endpoints with basic error handling: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/api/`

**Note:** User indicated that existing endpoints have some error handling, but wants ALL of it updated to the new consistent format.

### Follow-up Questions

**Follow-up 1:** For temperature validation, what should the actual min/max range be? For example, -50°F to 130°F, or something else?

**Answer:** Use exact values of -100°F to 150°F. Important: Make sure the max and min values are displayed in the error message when they are hit (e.g., "Temperature must be between -100°F and 150°F")

**Follow-up 2:** For API error response structure, should we use:
- Option A: Single error message string: `{ "error": "Invalid input" }`
- Option B: Field-specific errors: `{ "errors": { "temperature": "out of range", "zipcode": "invalid format" } }`
- Option C: Array of error objects with codes: `{ "errors": [{ "field": "temperature", "code": "OUT_OF_RANGE", "message": "..." }] }`

**Answer:** Use Option B - Field-specific errors like:
```json
{ "errors": { "temperature": "out of range", "zipcode": "invalid format" } }
```

**Follow-up 3:** You mentioned existing API endpoints have some error handling. Should we update those to match the new consistent format, or only apply the new format to newly created/modified endpoints?

**Answer:** Update ALL existing error handling to the new format so that everything is consistent across all API endpoints.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
Not applicable - no visual files found in the visuals folder.

## Requirements Summary

### Functional Requirements

**Server-Side Validation Rules:**
- Temperature: Must be between -100°F and 150°F (inclusive)
  - Error message MUST include actual limits: "Temperature must be between -100°F and 150°F"
- Zipcode: Strict 5-digit US format (e.g., 12345)
- Date: ISO format YYYY-MM-DD

**Client-Side Validation:**
- Implement React Hook Form with built-in validation
- Provide immediate feedback before API calls
- Validate same rules as server-side (temperature range, zipcode format, date format)

**Error Display:**
- Use existing toast library for all error messages throughout the app
- Display validation errors via toast notifications
- Show field-specific error messages when available

**Edge Cases Handling:**
- Duplicate entries (same zipcode + date): Update existing records
- Partial data submissions: Reject - all fields are required
- Missing zipcode in user profile: Show appropriate error message
- No data available for zipcode/date: Graceful fallback display
- Invalid date requests: Return validation error

**API Error Response Structure:**
- Use field-specific error format:
```json
{
  "errors": {
    "temperature": "Temperature must be between -100°F and 150°F",
    "zipcode": "Invalid zipcode format. Must be 5 digits",
    "date": "Invalid date format. Use YYYY-MM-DD"
  }
}
```
- Update ALL existing API endpoints to use this consistent format
- Include descriptive, user-friendly error messages

### Reusability Opportunities

**Existing Features to Update:**
- Admin form: `/weather-app/apps/web/app/admin/page.tsx`
  - Already has form inputs for temperature, date, zipcode
  - Needs React Hook Form integration and validation
  - Connect to updated API error handling

- Profile page: `/weather-app/apps/web/app/profile/page.tsx`
  - Already has zipcode input with basic validation
  - Update to use consistent error handling

- API endpoints: `/weather-app/apps/web/app/api/`
  - POST /api/weather-data
  - GET /api/weather-data
  - All endpoints need consistent error response structure

**Shared Validation Logic:**
- Create reusable validation functions for:
  - Temperature range checking (-100°F to 150°F)
  - Zipcode format validation (5-digit US)
  - Date format validation (ISO YYYY-MM-DD)
- These can be shared between client and server validation

**Toast Library:**
- Existing toast notification system already in place
- Reuse for all error message display

### Scope Boundaries

**In Scope:**
- Server-side validation for temperature, zipcode, and date
- Client-side validation using React Hook Form
- User-friendly error messages with toast notifications
- Consistent API error response structure across ALL endpoints
- Edge case handling for duplicates, missing data, invalid inputs
- Temperature error messages that include actual limits
- Updating ALL existing error handling to new consistent format

**Out of Scope:**
- Rate limiting or throttling
- CSRF protection
- Advanced security features
- Multi-step validation flows
- Complex authentication/authorization validation
- Database-level constraints (using in-memory storage)
- Validation for future features not yet implemented

### Technical Considerations

**Frontend:**
- React Hook Form for form validation
- Existing toast library for error display
- TypeScript interfaces for error response types
- Client-side validation mirrors server-side rules

**Backend:**
- Next.js API routes (existing architecture)
- In-memory Map data store (no database)
- Field-specific error response format
- Consistent validation across all endpoints

**Data Validation Rules:**
- Temperature: -100°F to 150°F (exact values)
- Zipcode: Must match regex `^\d{5}$` (exactly 5 digits)
- Date: ISO 8601 format YYYY-MM-DD
- All fields required (no partial records)
- Duplicates update existing records (upsert behavior)

**Error Message Examples:**
- Temperature: "Temperature must be between -100°F and 150°F"
- Zipcode: "Invalid zipcode format. Must be 5 digits"
- Date: "Invalid date format. Use YYYY-MM-DD"
- Missing field: "Temperature is required"

**Testing Requirements:**
- Production-ready validation (not just proof-of-concept)
- Normal client-side validation approach
- Test all validation scenarios
- Test edge cases (duplicates, missing data, invalid formats)
- Verify consistent error responses across all endpoints
