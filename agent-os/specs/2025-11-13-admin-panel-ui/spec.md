# Specification: Admin Panel UI

## Goal
Create an admin panel at /admin route with a form to submit weather data (temperature, date, zipcode) to the existing backend API, with client-side validation on blur and server-side validation, displaying validation errors at the top of the form and submission results via toast notifications.

## User Stories
- As an admin, I want to enter weather data through a form so that I can add temperature records to the system
- As an admin, I want immediate validation feedback when I leave form fields so that I can correct errors before submission

## Specific Requirements

**Admin Page Route and Navigation**
- Create new page at /admin route using Next.js 16 App Router conventions
- Add navigation link to admin page in root layout component
- Navigation should be accessible from all pages
- Use semantic HTML for navigation (nav element with links)

**Form Structure and Layout**
- Create form with three input fields: temperature, date, and zipcode
- Use native HTML input types where appropriate (number for temperature, date for date field)
- All fields are required for submission
- Include submit button with clear label (e.g., "Submit Weather Data")
- Form should be centered and responsive across mobile, tablet, and desktop breakpoints
- Use CSS modules or inline styles consistent with existing page.module.css patterns

**Temperature Input Field**
- Accept whole numbers only (integers) using number input type
- Support negative values for below-zero temperatures
- Label clearly as "Temperature (F)" to indicate Fahrenheit
- Validate on blur: must be numeric and within -50 to 150 Fahrenheit range
- Display field-specific error if validation fails

**Date Input Field**
- Use native HTML date picker (input type="date") for browser consistency
- Format must be YYYY-MM-DD
- Validate on blur: must be valid calendar date in correct format
- Display field-specific error if validation fails

**Zipcode Input Field**
- Accept text input for 5-digit US zipcode format
- Validate on blur: must be exactly 5 numeric digits
- No support for ZIP+4 format, letters, spaces, or dashes
- Display field-specific error if validation fails

**Client-Side Validation Strategy**
- Validate each field on blur (when user leaves the field)
- Reuse existing validation functions from /app/api/weather/validation.ts
- Extract validation logic into shared module accessible by both client and server
- Display all current validation errors in fixed error display area at top of form
- Clear field-specific error when user corrects the field and it passes validation
- Prevent form submission if any validation errors exist

**Error Display at Top of Form**
- Create fixed/prominent error display area at top of form
- Show all current field validation errors (from blur events)
- Use clear, user-friendly error messages matching server validation messages
- Style as alert or callout box with distinct visual treatment (border, background color)
- Automatically update when errors are added or cleared
- Should be visually distinct from toast notifications

**API Integration**
- Submit form data to POST /api/weather endpoint when validation passes
- Send data as JSON in request body with structure: {temperature: number, date: string, zipcode: string}
- Handle successful response (201 status) and error responses (400, 500)
- Include proper error handling for network failures
- Do not trust client-side validation alone - server will re-validate all data

**Toast Notifications for Submission Results**
- Implement toast notification system for post-submission feedback
- Success toast: Display when API returns 201 status with confirmation message
- Error toast: Display when API returns error status or network failure occurs
- Toast should auto-dismiss after 3-5 seconds
- Use library like react-hot-toast or sonner if not already present
- Position toasts in consistent location (top-right or top-center)

**Form Behavior After Submission**
- Clear all form field values after successful submission (201 response)
- Clear validation error display area after successful submission
- Keep form visible and ready for next entry
- On error response, keep form populated with submitted values
- Display error toast but do not clear validation errors at top of form

**Component Architecture**
- Use "use client" directive for form component (requires client-side interactivity)
- Create reusable form input components if multiple inputs share similar patterns
- Keep form state management local to the form component
- Consider using React Hook Form or similar if form complexity warrants it
- Follow single responsibility principle: separate validation logic, form rendering, and API calls

## Visual Design

No visual assets provided.

**Form Layout Guidelines**
- Center form on page with max width of 600px for readability
- Stack form fields vertically with consistent spacing (1-1.5rem between fields)
- Each field should have clear label above input
- Submit button should be full-width or right-aligned at bottom of form
- Error display area should be prominent at top with icon or visual indicator
- Use consistent padding within form container (2rem on desktop, 1rem on mobile)
- Maintain touch-friendly tap targets (minimum 44x44px) on mobile devices

## Existing Code to Leverage

**Validation Functions from /app/api/weather/validation.ts**
- validateTemperature: Validates numeric value and -50 to 150 Fahrenheit range
- validateDate: Validates YYYY-MM-DD format and valid calendar date
- validateZipcode: Validates exactly 5 numeric digits
- These functions should be extracted to shared location accessible by client components
- Reuse exact same validation logic to ensure client and server validation match

**API Error Response Structure from /app/api/weather/types.ts**
- ErrorResponse interface: {error: string, details?: Record<string, string>}
- Use same error structure for consistency across client and server
- Parse details object to display field-specific errors in error display area

**POST /api/weather Endpoint from /app/api/weather/route.ts**
- Accepts JSON body with temperature, date, zipcode fields
- Returns 201 on success with stored data
- Returns 400 on validation failure with details object
- Returns 500 on server error
- Client should handle all three response types appropriately

**Root Layout Pattern from /app/layout.tsx**
- Follow existing pattern for adding navigation to root layout
- Maintain consistent font variables (geistSans, geistMono)
- Keep metadata and HTML structure consistent
- Navigation should integrate seamlessly with existing layout structure

**Existing UI Components from @repo/ui Package**
- Button component available at @repo/ui/button (uses "use client")
- Review button component pattern for consistency when creating form submit button
- Consider creating additional form input components in ui package for reusability
- Maintain consistent styling approach with existing components

## Out of Scope
- Bulk data upload functionality
- User authentication or authorization for admin access
- Temperature unit conversion (Fahrenheit to Celsius or vice versa)
- Editing existing weather data records
- Deleting weather data records
- Displaying historical weather data in admin panel
- Advanced date picker with calendar UI (use native HTML date input)
- ZIP+4 format support (only 5-digit zipcodes)
- Real-time validation on keystroke (only on blur)
- Form field auto-complete or suggestions
