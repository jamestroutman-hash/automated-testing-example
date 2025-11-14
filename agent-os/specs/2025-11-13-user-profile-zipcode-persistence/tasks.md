# Task Breakdown: User Profile & Zipcode Persistence

## Overview
**Total Task Groups:** 4
**Implementation Approach:** Client-side only (no API endpoint)
**Estimated Complexity:** Small (S)

This feature creates a user profile page where users can save their preferred zipcode to localStorage for persistent weather preferences. The implementation follows existing admin panel patterns and leverages established validation, styling, and notification systems.

## Task List

### Task Group 1: Foundation - Page Route & Structure
**Dependencies:** None
**Size:** XS (Extra Small)
**Focus:** Establish page route and basic structure following Next.js App Router conventions

- [x] 1.0 Create profile page foundation
  - [x] 1.1 Write 2-5 focused tests for profile page structure
    - Test metadata (title and description) renders correctly
    - Test page renders without errors on initial load
    - Test basic page structure (title, description, form container)
    - Skip testing form interactions at this stage
  - [x] 1.2 Create `/app/profile/page.tsx` server component
    - Add metadata with title: "User Profile - Weather App"
    - Add metadata description: "Manage your weather preferences"
    - Follow page layout pattern from `/app/admin/page.tsx`
    - Include page container with title "User Profile"
    - Add description text: "Save your preferred zipcode for personalized weather data"
    - Import and render placeholder for ProfileForm component (to be created in Task Group 2)
    - Import and render ToastProvider component from `/app/admin/ToastProvider.tsx`
  - [x] 1.3 Create `/app/profile/profile.module.css` stylesheet
    - Copy base structure from `/app/admin/admin.module.css`
    - Include CSS variables for colors and spacing
    - Set up page grid layout with proper alignment
    - Define responsive breakpoints (mobile: 320-768px, tablet: 768-1024px, desktop: 1024px+)
    - Add dark mode support using `prefers-color-scheme`
    - Apply title and description styles matching admin panel
    - Maximum width 600px for main content area
  - [x] 1.4 Ensure foundation tests pass
    - Run ONLY the 2-5 tests written in 1.1
    - Verify page renders correctly
    - Verify metadata is correct
    - Do NOT run entire test suite

**Acceptance Criteria:**
- Profile page route accessible at `/profile`
- Page metadata correctly set
- Basic page structure renders following admin panel pattern
- CSS module provides consistent styling foundation
- Foundation tests (2-5 tests) pass
- Dark mode support functional

---

### Task Group 2: Core Feature - ProfileForm Component
**Dependencies:** Task Group 1
**Size:** M (Medium)
**Focus:** Build client component with zipcode input, validation, and localStorage persistence

- [x] 2.0 Build ProfileForm client component
  - [x] 2.1 Write 3-8 focused tests for ProfileForm functionality
    - Test component renders with empty state on first load
    - Test zipcode input accepts and displays user input
    - Test validation triggers on blur with invalid zipcode format
    - Test successful save writes to localStorage
    - Test component loads saved zipcode from localStorage on mount
    - Test success toast appears after save
    - Skip exhaustive edge case testing (multiple saves, localStorage errors, etc.)
  - [x] 2.2 Create `/app/profile/ProfileForm.tsx` client component
    - Add "use client" directive at top
    - Import `validateZipcode` from `/lib/validation.ts`
    - Import `toast` from `react-hot-toast`
    - Import styles from `profile.module.css`
    - Define FormData interface with zipcode string field
    - Define ValidationErrors interface following admin panel pattern
  - [x] 2.3 Implement component state and localStorage logic
    - Use useState for zipcode value (controlled input)
    - Use useState for validation errors object
    - Use useState for save state (isSaving boolean)
    - Implement useEffect to read from localStorage on mount
      - Storage key: `userZipcode`
      - Wrap in try-catch for SSR safety
      - Set zipcode state if value exists
    - Handle localStorage access errors gracefully
  - [x] 2.4 Build zipcode input field
    - Label: "Zipcode" with proper htmlFor association
    - Input type: "text" with maxLength={5}
    - Placeholder: "Enter your 5-digit US zipcode"
    - Controlled component pattern (value and onChange)
    - OnBlur validation using validateZipcode function
    - Display helper text when no zipcode saved: "No zipcode saved yet"
    - Disable input during save operation
    - Apply form field styles from profile.module.css
    - Ensure 44px minimum height for touch targets
  - [x] 2.5 Implement validation error display
    - Reuse error display pattern from admin WeatherForm
    - Show error box with role="alert" for accessibility
    - Display validation message from validateZipcode function
    - Clear errors when input is corrected
    - Match error styling from admin.module.css (red background tint, border)
    - Only show errors after validation is triggered (onBlur)
  - [x] 2.6 Create save button with localStorage write logic
    - Button text: "Save Zipcode"
    - OnClick handler to write to localStorage with key `userZipcode`
    - Wrap localStorage.setItem in try-catch
    - Show success toast: "Zipcode saved successfully!" (4000ms duration)
    - Show error toast if localStorage write fails
    - Disable button when validation errors exist
    - Disable button during save operation (show "Saving..." text)
    - Apply submit button styles from profile.module.css
    - Ensure 44px minimum height for touch targets
  - [x] 2.7 Add form styling to profile.module.css
    - Copy form styles from admin.module.css as base
    - Define .form, .formField, .label, .input classes
    - Add .errorDisplay, .errorTitle, .errorList, .errorItem classes
    - Add .submitButton class with hover and disabled states
    - Include dark mode variants for all interactive elements
    - Maintain consistent spacing (1.5rem gaps between elements)
    - Apply responsive adjustments for mobile and tablet
  - [x] 2.8 Ensure ProfileForm tests pass
    - Run ONLY the 3-8 tests written in 2.1
    - Verify form renders and accepts input
    - Verify validation works correctly
    - Verify localStorage integration works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- ProfileForm component renders correctly as client component
- Zipcode input field accepts 5-digit input with maxLength enforcement
- Validation triggers on blur using existing validateZipcode function
- Validation errors display in accessible format with role="alert"
- Save button writes zipcode to localStorage with key `userZipcode`
- Component reads and displays saved zipcode on mount
- Success toast shows "Zipcode saved successfully!" after save
- Empty state shows "No zipcode saved yet" for new users
- All form interactions are keyboard accessible
- Component tests (3-8 tests) pass
- localStorage access wrapped in try-catch for safety

---

### Task Group 3: Navigation Integration
**Dependencies:** Task Group 2
**Size:** XS (Extra Small)
**Focus:** Add profile navigation link to main navigation

- [x] 3.0 Add profile link to navigation
  - [x] 3.1 Write 2-3 focused tests for navigation
    - Test Profile link renders in navigation
    - Test Profile link has correct href="/profile"
    - Skip testing navigation behavior and routing
  - [x] 3.2 Update `/app/layout.tsx` to add Profile link
    - Import Link component from `next/link` (already imported)
    - Add new Link between "Home" and "Admin Panel" links
    - Set href="/profile"
    - Link text: "Profile"
    - Apply existing `.navLink` className for consistent styling
    - Maintain keyboard navigation and focus indicators
    - Ensure proper spacing with existing navigation items
  - [x] 3.3 Verify navigation styling in globals.css
    - Confirm .navLink class includes focus-visible styles
    - Confirm 44px minimum touch target is applied
    - Confirm hover states are defined
    - No changes needed - just verification
  - [x] 3.4 Ensure navigation tests pass
    - Run ONLY the 2-3 tests written in 3.1
    - Verify Profile link appears in navigation
    - Do NOT run entire test suite

**Acceptance Criteria:**
- Profile link appears in main navigation between Home and Admin Panel
- Link correctly routes to `/profile` when clicked
- Navigation maintains consistent styling with existing links
- Keyboard navigation works properly (tab order, focus indicators)
- Touch targets meet 44px minimum for mobile usability
- Navigation tests (2-3 tests) pass

---

### Task Group 4: Testing & Quality Assurance
**Dependencies:** Task Groups 1-3
**Size:** S (Small)
**Focus:** Review existing tests and fill critical gaps for end-to-end workflows

- [x] 4.0 Review tests and fill critical gaps
  - [x] 4.1 Review existing tests from Task Groups 1-3
    - Review 2-5 tests from Task Group 1 (page foundation)
    - Review 3-8 tests from Task Group 2 (ProfileForm component)
    - Review 2-3 tests from Task Group 3 (navigation)
    - Total existing tests: approximately 7-16 tests
  - [x] 4.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows lacking coverage:
      - End-to-end: Navigate to profile → Enter zipcode → Save → Navigate to home
      - localStorage persistence: Save zipcode → Refresh page → Verify zipcode persists
      - Error recovery: Enter invalid zipcode → See error → Correct input → Save successfully
    - Focus ONLY on gaps related to profile page and zipcode persistence
    - Do NOT assess entire application test coverage
    - Prioritize integration and end-to-end workflows over additional unit tests
  - [x] 4.3 Write up to 6 additional strategic tests maximum
    - Add maximum 6 new tests for identified critical gaps
    - Test 1: End-to-end profile update workflow
    - Test 2: localStorage persistence across page refreshes
    - Test 3: Error state to success state transition
    - Test 4: Empty state for first-time users
    - Test 5: Profile navigation from home page
    - Test 6: Profile navigation from admin panel
    - Focus on integration points between components
    - Do NOT write comprehensive edge case coverage
    - Skip performance tests, extensive error scenario testing
  - [x] 4.4 Run feature-specific test suite
    - Run ONLY tests related to profile feature
    - Expected total: approximately 13-22 tests maximum
    - Verify all critical user workflows pass
    - Do NOT run entire application test suite
    - Fix any failing tests before marking complete
  - [x] 4.5 Manual accessibility verification
    - Test keyboard navigation through profile form
    - Verify screen reader announces errors correctly (role="alert")
    - Confirm all interactive elements have visible focus indicators
    - Test form with keyboard only (no mouse)
    - Verify 44px minimum touch targets on mobile viewport
    - Check color contrast for error messages in both light and dark modes

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 13-22 tests total)
- No more than 6 additional tests added when filling gaps
- Critical user workflows covered:
  - Complete profile update flow (navigate → input → save → persist)
  - localStorage persistence across sessions
  - Validation error handling and recovery
  - Navigation integration from home and admin
  - Empty state for new users
- Manual accessibility verification complete
- Keyboard navigation works for all interactions
- Focus indicators visible and properly styled
- Screen reader compatibility verified
- Touch targets meet 44px minimum
- Color contrast passes WCAG standards

---

## Execution Order

**Recommended implementation sequence:**

1. **Task Group 1: Foundation** - Establish page route and structure
   - Creates the container for the feature
   - Sets up styling foundation
   - Minimal risk, straightforward implementation

2. **Task Group 2: Core Feature** - Build ProfileForm component
   - Largest and most complex task group
   - Contains core business logic (validation, localStorage, form handling)
   - Depends on foundation being in place

3. **Task Group 3: Navigation** - Integrate profile link
   - Simple integration task
   - Requires working profile page to link to
   - Low complexity, high visibility

4. **Task Group 4: Testing & QA** - Comprehensive testing and verification
   - Validates entire feature works end-to-end
   - Requires all components to be complete
   - Ensures quality before considering feature complete

---

## Technical Notes

### localStorage Architecture
- **Storage Key:** `userZipcode` (single string value)
- **Data Format:** Plain string containing 5-digit zipcode (e.g., "10001")
- **Read Pattern:** `localStorage.getItem('userZipcode')` in useEffect on mount
- **Write Pattern:** `localStorage.setItem('userZipcode', value)` on save button click
- **Error Handling:** All localStorage access wrapped in try-catch for SSR compatibility
- **Integration:** Home dashboard will independently read same key for weather display

### Reusable Patterns
- **Page Layout:** Follow `/app/admin/page.tsx` structure exactly
- **Form Component:** Follow `/app/admin/WeatherForm.tsx` patterns for controlled inputs
- **Validation:** Reuse existing `validateZipcode` function from `/lib/validation.ts`
- **Styling:** Copy and adapt `/app/admin/admin.module.css` for consistency
- **Toasts:** Use existing `ToastProvider` and `react-hot-toast` configuration
- **Navigation:** Extend existing navigation in `/app/layout.tsx` with same patterns

### Validation Rules
- **Format:** Exactly 5 numeric digits (no letters, spaces, or special characters)
- **Trigger:** OnBlur event on input field
- **Function:** `validateZipcode(value)` returns `{ field, message }` or `null`
- **Display:** Show error in alert box above form (role="alert")
- **Prevention:** Disable save button when validation errors exist
- **No Real Verification:** Format validation only, not checking against postal database

### Accessibility Requirements
- Semantic HTML with label-input associations using htmlFor
- ARIA role="alert" on validation error display
- Keyboard navigation support (tab order, enter to submit)
- Visible focus indicators using :focus-visible pseudo-class
- Minimum 44px touch targets for all interactive elements (inputs, buttons)
- Screen reader friendly error messages with field name and description
- Color contrast meeting WCAG standards (error colors tested in light and dark modes)

### Responsive Design Breakpoints
- **Mobile (320-768px):** Reduced padding, smaller fonts, tighter spacing
- **Tablet (768-1024px):** Medium padding and spacing
- **Desktop (1024px+):** Full padding, standard fonts, comfortable spacing

### Dark Mode Support
- Use CSS `prefers-color-scheme: dark` media query
- CSS variables for colors: `--foreground`, `--background`, `--gray-alpha-200`
- Error colors: `#dc2626` (light), `#ef4444` (dark)
- Button hover states: `--button-primary-hover` variable

---

## Out of Scope Reminders

**Explicitly NOT included in this feature:**
- No API endpoint creation (client-side only)
- No backend storage or database integration
- No user authentication or accounts
- No multiple user profiles (single profile per browser)
- No zipcode history or previous entries tracking
- No zipcode autocomplete or suggestions
- No real zipcode verification (format only)
- No additional profile fields (name, email, preferences)
- No temperature unit preferences toggle
- No automatic dashboard refresh on save
- No weather preview on profile page
- No geolocation detection
- No export/import functionality

---

## Testing Strategy Summary

### Test Distribution
- **Foundation Tests (Group 1):** 2-5 tests for page structure and metadata
- **Component Tests (Group 2):** 3-8 tests for form functionality and localStorage
- **Navigation Tests (Group 3):** 2-3 tests for link rendering
- **Integration Tests (Group 4):** Up to 6 additional tests for end-to-end workflows
- **Total Expected:** Approximately 13-22 tests maximum

### Testing Focus
- Prioritize critical user workflows over comprehensive coverage
- Test behavior and integration points, not implementation details
- Mock localStorage for consistent test environment
- Limit to 2-8 tests per task group during development
- Save comprehensive testing for dedicated QA phase (Task Group 4)

### What NOT to Test During Development
- Exhaustive edge cases (empty strings, special characters, extremely long inputs)
- Performance and load testing
- Cross-browser compatibility (handle in separate QA if needed)
- Extensive error scenarios (network failures, localStorage quota exceeded)
- Visual regression testing
- Accessibility audits (manual verification only in Task Group 4)
