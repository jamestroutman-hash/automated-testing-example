# Task Breakdown: Current Temperature Display

## Overview
Total Tasks: 4 Task Groups
Feature Size: S (Small)

This feature adds a client-side React component to display the current day's temperature for the user's configured zipcode. The component will be rendered in the .currentTempSection container on the home page and will integrate with the existing /api/weather GET endpoint.

## Task List

### Frontend Component Development

#### Task Group 1: CurrentTemperatureDisplay Component
**Dependencies:** None

- [x] 1.0 Complete CurrentTemperatureDisplay component
  - [x] 1.1 Write 2-8 focused tests for CurrentTemperatureDisplay component
    - Limit to 2-8 highly focused tests maximum
    - Test only critical component behaviors:
      - Component renders loading spinner while fetching data
      - Component displays temperature value when API returns data (e.g., "72°F")
      - Component displays placeholder message when API returns null temperature
      - Component shows toast notification when zipcode is missing from localStorage
      - Component shows toast notification when API request fails
      - Component correctly handles temperature value of 0 (displays "0°F")
    - Skip exhaustive testing of all states and edge cases
    - Test file: /weather-app/apps/web/app/__tests__/current-temperature-display.test.tsx
  - [x] 1.2 Create CurrentTemperatureDisplay.tsx component
    - File location: /weather-app/apps/web/app/CurrentTemperatureDisplay.tsx
    - Use "use client" directive for Next.js client component
    - Import React hooks: useState, useEffect
    - Import toast from 'react-hot-toast' for notifications
    - Component should be self-contained with no prop dependencies
    - Follow pattern from ProfileForm.tsx and WeatherForm.tsx
  - [x] 1.3 Implement component state management
    - Use useState hooks for managing state:
      - isLoading: boolean (loading state during API request)
      - temperature: number | null (temperature data from API)
      - error: string | null (error message if API fails)
      - hasZipcode: boolean (whether zipcode exists in localStorage)
    - Manage five distinct UI states:
      - Initial/loading state (show spinner)
      - Data available state (show temperature value)
      - No data state (show placeholder message)
      - Missing zipcode state (show toast notification)
      - API error state (show toast notification)
  - [x] 1.4 Implement zipcode retrieval from localStorage
    - Use useEffect hook that runs on component mount
    - Read zipcode using localStorage.getItem('userZipcode')
    - Follow localStorage pattern from ProfileForm.tsx (lines 18-27)
    - Use try-catch block to handle localStorage access errors
    - Handle missing/empty/undefined zipcode:
      - Show toast notification: "Please configure your zipcode in the profile page"
      - Do NOT make API request if zipcode is missing
      - Set hasZipcode state to false
  - [x] 1.5 Implement date calculation logic
    - Use client-side new Date() to get current date in user's local timezone
    - Format date as YYYY-MM-DD for API request
    - Calculation logic:
      - year = today.getFullYear()
      - month = String(today.getMonth() + 1).padStart(2, '0')
      - day = String(today.getDate()).padStart(2, '0')
      - dateString = `${year}-${month}-${day}`
  - [x] 1.6 Implement API integration with /api/weather endpoint
    - Make GET request to /api/weather?zipcode={zipcode}&date={dateString}
    - Use fetch API for HTTP request (no additional libraries)
    - Set isLoading to true before request starts
    - Handle API response lifecycle:
      - Success with data: temperature is a number
      - Success with no data: temperature is null
      - Failure: network error or 4xx/5xx status code
    - Expected response format: { temperature: number | null }
    - Use try-catch-finally pattern from WeatherForm.tsx (lines 86-138)
    - Set isLoading to false in finally block
  - [x] 1.7 Implement error handling with toast notifications
    - Display toast.error() for API request failures
    - Display toast.error() when zipcode is not configured
    - Toast message for missing zipcode: "Please configure your zipcode in the profile page"
    - Toast message for API failure: "Failed to load temperature data. Please try again."
    - Follow error handling patterns from ProfileForm.tsx (lines 68-70) and WeatherForm.tsx (lines 131-134)
  - [x] 1.8 Implement conditional rendering for UI states
    - Loading state: Display spinner/loading indicator component
    - Data available state: Display temperature as "{value}°F" (e.g., "72°F")
    - No data state: Display "No temperature data available for today"
    - Handle edge case: temperature value of 0 displays as "0°F" (not treated as falsy)
    - Use conditional rendering based on isLoading, temperature, error, and hasZipcode states
  - [x] 1.9 Ensure component tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify critical component behaviors work correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Component renders correctly in all five UI states
- Zipcode is successfully retrieved from localStorage
- Date calculation produces YYYY-MM-DD format
- API request is made with correct query parameters
- Temperature displays in correct format (e.g., "72°F")
- Toast notifications appear for errors and missing zipcode
- Component follows existing code patterns from ProfileForm and WeatherForm

### CSS Styling

#### Task Group 2: Component Styling
**Dependencies:** Task Group 1

- [x] 2.0 Complete CSS styling for CurrentTemperatureDisplay
  - [x] 2.1 Create CurrentTemperatureDisplay.module.css
    - File location: /weather-app/apps/web/app/CurrentTemperatureDisplay.module.css
    - Follow CSS module pattern from home.module.css
    - Import in component using: import styles from './CurrentTemperatureDisplay.module.css'
  - [x] 2.2 Add styling for temperature display
    - Create .temperatureValue class for temperature display
    - Use prominent font size and weight for visibility
    - Font size: 2.5rem (desktop), 2rem (tablet), 1.75rem (mobile)
    - Font weight: 600 (semi-bold)
    - Text alignment: center
    - Color: use --foreground CSS variable
  - [x] 2.3 Add styling for placeholder message
    - Create .placeholderText class for "No temperature data available for today" message
    - Reuse helper text styling pattern from ProfileForm.tsx (lines 105-111)
    - Font size: 0.875rem
    - Opacity: 0.6
    - Color: muted/secondary text color
    - Text alignment: center
  - [x] 2.4 Add styling for loading spinner
    - Create .spinner class for loading indicator
    - Simple spinner animation using CSS keyframes
    - Centered positioning within container
    - Size: 40px x 40px
    - Animation: rotate 360deg over 1s, infinite loop
    - Use border styling to create spinner visual
  - [x] 2.5 Add styling for container
    - Create .container class for component wrapper
    - Display: flex, flex-direction: column
    - Align items: center
    - Justify content: center
    - Min-height: match parent .currentTempSection (120px from home.module.css)
    - Padding: 1rem
  - [x] 2.6 Implement responsive design
    - Mobile (320px - 768px):
      - Temperature font size: 1.75rem
      - Placeholder font size: 0.8rem
      - Container padding: 0.75rem
    - Tablet (768px - 1024px):
      - Temperature font size: 2rem
      - Placeholder font size: 0.875rem
      - Container padding: 1rem
    - Desktop (1024px+):
      - Temperature font size: 2.5rem
      - Placeholder font size: 0.875rem
      - Container padding: 1rem
    - Follow responsive patterns from home.module.css (lines 72-106)
  - [x] 2.7 Reuse CSS variables from home.module.css
    - Use --foreground for text color
    - Use --gray-rgb and --gray-alpha-* for muted colors
    - Use --background for background color if needed
    - Ensure consistent styling with existing components

**Acceptance Criteria:**
- Temperature displays prominently and is easy to read
- Placeholder message uses muted styling similar to helper text
- Loading spinner is visible and centered
- Component is responsive across mobile, tablet, and desktop
- Styling follows existing patterns and CSS variables
- Visual design is consistent with ProfileForm and WeatherForm components

### Integration

#### Task Group 3: Home Page Integration
**Dependencies:** Task Groups 1, 2

- [x] 3.0 Complete home page integration
  - [x] 3.1 Write 2-8 focused tests for home page integration
    - Limit to 2-8 highly focused tests maximum
    - Test only critical integration behaviors:
      - Home page renders CurrentTemperatureDisplay component in .currentTempSection
      - Component displays loading state initially
      - Component displays temperature after successful API fetch
      - Component displays placeholder when no data exists
    - Skip exhaustive testing of all integration scenarios
    - Test file: /weather-app/apps/web/app/__tests__/home-integration.test.tsx (update existing file)
  - [x] 3.2 Import CurrentTemperatureDisplay in page.tsx
    - Add import statement: import { CurrentTemperatureDisplay } from './CurrentTemperatureDisplay';
    - File to modify: /weather-app/apps/web/app/page.tsx
  - [x] 3.3 Render component in .currentTempSection container
    - Replace comment "Empty structural container for future current temperature component" (line 18)
    - Add component: <CurrentTemperatureDisplay />
    - Component should be the only child of .currentTempSection div
    - Maintain existing className structure: className={`${styles.section} ${styles.currentTempSection}`}
  - [x] 3.4 Verify component renders correctly on home page
    - Start development server to view changes
    - Navigate to home page (/)
    - Verify component renders in .currentTempSection
    - Check that component styling matches design expectations
    - Test all UI states manually:
      - Missing zipcode: navigate to home without configuring zipcode in profile
      - No data state: configure zipcode but don't add weather data for today
      - Data available state: add weather data for today via admin form
      - Loading state: observe initial load (may be brief)
  - [x] 3.5 Ensure integration tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify component renders correctly on home page
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- CurrentTemperatureDisplay renders inside .currentTempSection on home page
- Component displays correctly in browser
- All five UI states can be manually verified
- No console errors or warnings
- Component integrates seamlessly with existing home page layout

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review tests from Task Groups 1-3
    - Review the 2-8 tests written for CurrentTemperatureDisplay component (Task 1.1)
    - Review the CSS styling (no tests needed for pure CSS)
    - Review the 2-8 tests written for home page integration (Task 3.1)
    - Total existing tests: approximately 4-16 tests
  - [x] 4.2 Analyze test coverage gaps for Current Temperature Display feature only
    - Identify critical user workflows that lack test coverage:
      - End-to-end workflow: user with configured zipcode sees temperature on home page
      - Error recovery workflow: user without zipcode gets prompted to configure profile
      - Edge case: temperature value of 0 displays correctly (should be covered in 1.1)
      - Date calculation edge cases: month padding, day padding
      - localStorage access errors: handle exceptions gracefully
    - Focus ONLY on gaps related to this feature's requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
  - [x] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Suggested additional tests (only if not covered in 1.1 and 3.1):
      - Test: Date calculation correctly pads single-digit months (e.g., January = "01")
      - Test: Date calculation correctly pads single-digit days (e.g., 5th = "05")
      - Test: Component handles localStorage access errors gracefully
      - Test: Component makes API request with correctly formatted date string
      - Test: End-to-end workflow for user with zipcode seeing temperature
      - Test: End-to-end workflow for user without zipcode seeing prompt
    - Focus on integration points and end-to-end workflows
    - Do NOT write comprehensive coverage for all scenarios
    - Skip performance tests and accessibility tests unless business-critical
    - Test files: Add to existing test files or create new integration test file if needed
  - [x] 4.4 Run feature-specific tests only
    - Run ONLY tests related to Current Temperature Display feature
    - Test command: npm test -- CurrentTemperatureDisplay (or relevant test file pattern)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run the entire application test suite
    - Verify all critical workflows pass
    - Address any failing tests before moving forward

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 14-26 tests total)
- Critical user workflows for this feature are covered:
  - User with configured zipcode sees current temperature
  - User without zipcode is prompted to configure profile
  - Temperature value displays correctly including edge case of 0°F
  - Date formatting is correct for API requests
  - Error states display appropriate messages
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on Current Temperature Display feature requirements
- All tests use proper mocking patterns (localStorage, fetch API, react-hot-toast)

## Execution Order

Recommended implementation sequence:
1. Frontend Component Development (Task Group 1) - Build the core component with state management, data fetching, and rendering logic
2. CSS Styling (Task Group 2) - Style the component for responsive design and visual consistency
3. Integration (Task Group 3) - Integrate component into home page and verify it works in context
4. Test Review & Gap Analysis (Task Group 4) - Review test coverage and fill critical gaps

## Technical Notes

### Existing Code Patterns to Follow

**localStorage Pattern (ProfileForm.tsx lines 18-27):**
```typescript
useEffect(() => {
  try {
    const savedZipcode = localStorage.getItem('userZipcode');
    if (savedZipcode) {
      setZipcode(savedZipcode);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
}, []);
```

**Loading State Pattern (WeatherForm.tsx lines 31, 84, 136):**
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
// Set to true before async operation
setIsSubmitting(true);
// Set to false in finally block
finally {
  setIsSubmitting(false);
}
```

**Toast Notification Pattern (WeatherForm.tsx lines 115, 118, 126, 129, 134):**
```typescript
import toast from 'react-hot-toast';
toast.success('Success message');
toast.error('Error message');
```

**Date Calculation Logic:**
```typescript
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const dateString = `${year}-${month}-${day}`;
```

### API Endpoint Details

**Endpoint:** GET /api/weather
**Query Parameters:**
- zipcode: string (required) - User's 5-digit US zipcode
- date: string (optional) - Date in YYYY-MM-DD format

**Example Request:**
```
GET /api/weather?zipcode=10001&date=2025-11-14
```

**Response (Success with data):**
```json
{
  "temperature": 72
}
```

**Response (Success with no data):**
```json
{
  "temperature": null
}
```

**Response (Validation error):**
```json
{
  "error": "Validation failed",
  "details": {
    "zipcode": "Error message"
  }
}
```

### Component File Structure

```
/weather-app/apps/web/app/
├── CurrentTemperatureDisplay.tsx (new file)
├── CurrentTemperatureDisplay.module.css (new file)
├── page.tsx (modify to import and render component)
└── __tests__/
    ├── current-temperature-display.test.tsx (new file)
    ├── current-temperature-display-extended.test.tsx (new file)
    └── home-integration.test.tsx (update existing file)
```

### Testing Approach

- Use React Testing Library (@testing-library/react) for component tests
- Mock localStorage using jest.fn() and Object.defineProperty
- Mock react-hot-toast using jest.mock()
- Mock fetch API using jest.fn() for API request tests
- Use waitFor() for asynchronous state updates
- Follow testing patterns from profile-form.test.tsx
- Limit tests to 2-8 per task group during development
- Maximum of 10 additional tests in Task Group 4 for gap filling

### Standards Compliance

This task breakdown aligns with the user's standards:
- **Components (frontend/components.md):** Single responsibility, clear interface, local state management
- **CSS (frontend/css.md):** CSS modules methodology, design system variables, responsive design
- **Responsive (frontend/responsive.md):** Mobile-first development, standard breakpoints (mobile/tablet/desktop)
- **Error Handling (global/error-handling.md):** User-friendly messages, graceful degradation, toast notifications
- **Testing (testing/test-writing.md):** Minimal tests during development (2-8 per group), core user flows only, defer edge cases
- **Conventions (global/conventions.md):** Clear documentation, environment configuration (localStorage), dependency management

## Out of Scope

The following features are explicitly excluded from this implementation:
- Temperature unit conversion (Fahrenheit to Celsius)
- Weather condition icons (sunny, cloudy, rainy, etc.)
- Historical temperature comparisons (warmer/cooler than yesterday)
- Temperature range display (high/low temperatures)
- Feels-like temperature, humidity, wind speed, or other weather metrics
- Manual refresh button or automatic background refresh functionality
- Caching of temperature data on client side
- Animation effects when temperature value changes
- Multiple zipcode support or zipcode switching
- Heading or title text above temperature value (display value only)
