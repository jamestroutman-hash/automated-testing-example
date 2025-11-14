# Spec Requirements: Admin Panel UI

## Initial Description
Build admin page with form inputs for temperature, date, and zipcode. Connect to backend API for data submission. Display success/error messages after submission. Add basic client-side validation.

## Requirements Discussion

### First Round Questions

**Q1: Page Route and Navigation**
I assume we should create the admin panel at `/admin` route with a navigation link accessible from the root layout. Is that correct, or would you prefer a different route structure?

**Answer:** yes (use /admin route with navigation link in root layout)

**Q2: Form Layout and Design**
I'm thinking we should use shadcn/ui components for form inputs, buttons, and layout where available to maintain consistency. Should we follow this approach, or would you prefer custom components?

**Answer:** yes, use shadcn components where available

**Q3: Client-Side Validation Strategy**
I assume we should validate form fields on blur (when user leaves a field) rather than on every keystroke, to provide immediate feedback without being intrusive. Is that correct, or would you prefer validation on submit only?

**Answer:** blur validation, but server should never trust the ui

**Q4: Success/Error Message Display**
I'm thinking we should display success messages as toast notifications and error messages inline near the form fields. Should we use this pattern, or would you prefer a different feedback mechanism?

**Answer:** toast for success, toast for error, fixed top of form for errors

**Q5: Form Behavior After Success**
I assume after successful submission, we should clear the form fields to prepare for the next entry. Is that correct, or should we keep the values populated?

**Answer:** clear the form fields

**Q6: Date Input Type**
I'm thinking we should use a native HTML date input `<input type="date">` for simplicity and browser consistency. Should we use this approach, or would you prefer a custom date picker component?

**Answer:** native or shadcn if they have one

**Q7: Temperature Input Validation**
I assume temperature values should accept both positive and negative integers (for below-zero temperatures). Is that correct, or should we restrict the range?

**Answer:** whole numbers only

**Q8: Scope Boundaries**
Are there any features we should explicitly exclude from this initial implementation? For example: bulk data upload, user authentication/authorization, temperature unit conversion?

**Answer:** no bulk upload, no auth, no conversions (F only)

### Existing Code to Reference

**Similar Features Identified:**
User confirmed no existing similar features to reference. Implementation should follow best practices.

### Follow-up Questions

**Follow-up 1:** Regarding error message display (from Q4), you mentioned "toast for error, fixed top of form for errors" - this suggests two error display locations. Could you clarify:
- Should validation errors (e.g., invalid zipcode format) display at the fixed top of the form?
- Should API/server errors (e.g., failed submission) display as toast notifications?
- Or should all errors use both methods simultaneously?

**Answer:** Validation errors (on blur): display at the top of the form. Submission result (after clicking submit): display toast for both success and failure.

## Visual Assets

### Files Provided:
No visual files found in the visuals folder.

### Visual Insights:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- Admin page accessible at `/admin` route with navigation link in root layout
- Form with three input fields: temperature (whole numbers), date, and zipcode
- Submit button to send data to backend API (POST endpoint)
- Client-side validation on blur for immediate feedback
- Validation errors display at the top of the form (fixed position)
- Server-side validation (server never trusts client input)
- Success feedback via toast notification after form submission
- Failure feedback via toast notification after form submission
- Clear form fields after successful submission
- Use shadcn/ui components where available
- Date input using native HTML date picker or shadcn date component
- Temperature restricted to whole numbers (integers only)
- Zipcode validation (5-digit US format based on product requirements)

### Error Display Strategy (Clarified)
**Validation Errors (on blur):**
- Display at the top of the form in a fixed/prominent location
- Triggered when user leaves a field with invalid input
- Examples: invalid zipcode format, missing required field, non-numeric temperature

**Submission Result (after submit button clicked):**
- Display toast notification for success
- Display toast notification for failure (API errors, server errors, network issues)
- Form remains visible with error messages at top if validation fails

### Reusability Opportunities
No similar existing features identified. Implementation will establish patterns for future forms.

### Scope Boundaries

**In Scope:**
- Single temperature entry form with three fields
- Form validation (client and server)
- Success/error messaging (top-of-form for validation, toast for submission)
- Connection to existing backend API
- Navigation integration

**Out of Scope:**
- Bulk data upload functionality
- User authentication or authorization
- Temperature unit conversion (Fahrenheit only)
- Data editing or deletion from admin panel
- Historical data display in admin panel

### Technical Considerations
- Integration with existing In-Memory Data Store API (backend already implemented per roadmap item #1)
- Use Next.js 16 App Router conventions for `/admin` route
- Apply shadcn/ui component library for consistent UI
- Client-side validation using blur events
- Validation error display area at top of form (fixed/prominent position)
- Form state management (potentially React Hook Form if available)
- Toast notification system for submission results (need to implement or use library)
- Server-side validation must duplicate all client-side validation rules
- Temperature field should accept negative integers (for below-zero temps)
- Date field should use native or shadcn date picker component
- Zipcode must validate 5-digit US format (per product validation requirements)
