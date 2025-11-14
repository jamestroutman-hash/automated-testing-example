# Task Breakdown: Forecast Data Display (7-Day)

## Overview
Total Tasks: 12 (organized into 3 strategic groups)

## Task List

### Frontend Component Implementation

#### Task Group 1: ForecastDataDisplay Component Structure
**Dependencies:** None

- [x] 1.0 Complete ForecastDataDisplay component
  - [x] 1.1 Write 2-8 focused tests for ForecastDataDisplay component
    - Limit to 2-8 highly focused tests maximum
    - Test only critical component behaviors:
      - Renders loading spinner during data fetch
      - Shows error toast when zipcode is missing
      - Displays placeholder when no forecast data exists
      - Renders chart with correct data structure
      - Formats dates correctly ("Mon, Nov 11" format)
      - Calculates future dates correctly (days +1 through +7)
    - Skip exhaustive coverage of all edge cases
    - Location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/ForecastDataDisplay.test.tsx`
  - [x] 1.2 Create ForecastDataDisplay.tsx component file
    - Location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.tsx`
    - Add "use client" directive at top of file
    - Import React hooks: useState, useEffect
    - Import toast from "react-hot-toast"
    - Import Recharts components: ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
    - Reuse pattern from: HistoricalDataDisplay.tsx
  - [x] 1.3 Define TypeScript interface for data structure
    - Create TemperatureDataPoint interface with properties:
      - date: string (formatted display date)
      - temperature: number | null (allow null for missing data)
    - Follow exact pattern from HistoricalDataDisplay.tsx
  - [x] 1.4 Implement component state management
    - useState for isLoading (boolean, initial: false)
    - useState for temperatureData (TemperatureDataPoint[], initial: [])
    - useState for hasZipcode (boolean, initial: true)
    - Mirror state structure from HistoricalDataDisplay
  - [x] 1.5 Implement date range calculation for future dates
    - Create useEffect hook with empty dependency array
    - Calculate 7 days AFTER today (days +1 through +7)
    - Use JavaScript Date object with setDate method
    - Loop from i=1 to i=7 (incrementing forward)
    - Format each date to ISO string (YYYY-MM-DD) using toISOString().split('T')[0]
    - Store in dateRange array
    - NOTE: This is opposite logic from HistoricalDataDisplay (which uses i=7 down to i=1 with subtraction)
  - [x] 1.6 Implement localStorage zipcode retrieval
    - Read zipcode from localStorage with key "userZipcode"
    - Check if zipcode is missing or empty string
    - Set hasZipcode state to false if missing
    - Show toast error: "Please configure your zipcode in the profile page"
    - Return early from useEffect if no zipcode
    - Reuse exact pattern from HistoricalDataDisplay
  - [x] 1.7 Implement API data fetching
    - Set isLoading to true before fetch
    - Make GET request to `/api/weather?zipcode=${savedZipcode}`
    - Parse response JSON to extract data object (Record<string, number> format)
    - Handle !response.ok by throwing error
    - Use try-catch block with finally to clear loading state
    - Reuse fetch pattern from HistoricalDataDisplay
  - [x] 1.8 Implement data filtering and transformation
    - Filter API response to include only the 7 future dates from dateRange
    - Map each date to TemperatureDataPoint object:
      - Get temperature from allData[dateStr] (null if undefined)
      - Format date for display using toLocaleDateString('en-US')
      - Options: weekday 'short', month 'short', day 'numeric'
      - Append 'T00:00:00' to ISO date string for correct timezone
    - Check if any temperatures exist (hasAnyData check)
    - Set temperatureData only if hasAnyData is true
    - Reuse data transformation logic from HistoricalDataDisplay
  - [x] 1.9 Implement error handling with toast notifications
    - Catch errors in try-catch block
    - Log error to console for debugging
    - Show toast error: "Failed to load forecast data. Please try again."
    - Clear loading state in finally block
    - Follow error handling pattern from HistoricalDataDisplay
  - [x] 1.10 Implement conditional rendering logic
    - Return loading spinner if isLoading is true
    - Return null if hasZipcode is false (toast already shown)
    - Return placeholder message if temperatureData.length === 0
    - Return chart container if data exists
    - Import CSS module styles for all UI elements
    - Mirror conditional rendering from HistoricalDataDisplay
  - [x] 1.11 Ensure component tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify critical component behaviors work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Component fetches data on mount
- Zipcode validation works correctly
- Error handling displays appropriate messages
- Loading state renders correctly
- Data transformation creates correct structure

### Frontend Visualization & Styling

#### Task Group 2: Chart Visualization and CSS Styling
**Dependencies:** Task Group 1

- [x] 2.0 Complete chart visualization and styling
  - [x] 2.1 Write 2-8 focused tests for chart rendering and styling
    - Limit to 2-8 highly focused tests maximum
    - Test only critical visual behaviors:
      - Chart renders with correct dimensions (300px height)
      - Orange line color is applied (distinct from blue)
      - Section heading "7-Day Forecast" displays correctly
      - Responsive behavior works on different viewport sizes
      - Dark mode styles apply correctly
    - Skip exhaustive testing of all visual states
    - Location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/ForecastDataDisplay.visual.test.tsx`
  - [x] 2.2 Implement Recharts chart configuration
    - Add ResponsiveContainer with width="100%" and height={300}
    - Configure LineChart with temperatureData
    - Add CartesianGrid with strokeDasharray="3 3" and rgba opacity
    - Configure XAxis with dataKey="date" and tick color var(--foreground)
    - Configure YAxis with domain=['auto', 'auto'] and tick color var(--foreground)
    - Add Tooltip component
    - Follow exact Recharts structure from HistoricalDataDisplay
  - [x] 2.3 Configure Line component with orange color
    - Set type="monotone" for smooth line
    - Set stroke color to orange (e.g., "#FF8C42" or similar)
    - Set strokeWidth={2}
    - Configure dot with r={4}
    - Configure activeDot with r={5}
    - Set connectNulls={false} to show gaps
    - NOTE: This is the KEY distinction from HistoricalDataDisplay (which uses blue/var(--foreground))
  - [x] 2.4 Add section heading for forecast
    - Add h2 or h3 element with text "7-Day Forecast"
    - Place heading inside container div before chartContainer
    - Apply CSS module class for heading styling
    - Follow heading pattern consistent with component design
  - [x] 2.5 Create ForecastDataDisplay.module.css file
    - Location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.module.css`
    - Copy complete structure from HistoricalDataDisplay.module.css as base
    - Define container class with flexbox layout
    - Define chartContainer class for chart wrapper
    - Define placeholderText class with opacity and font styling
    - Define spinner class with border animation
    - Add heading class for "7-Day Forecast" title
  - [x] 2.6 Implement responsive design breakpoints
    - Mobile (max-width: 768px): smaller padding, font sizes
    - Tablet (768px - 1024px): medium padding, font sizes
    - Desktop (1024px+): full padding, font sizes
    - Follow exact breakpoint structure from HistoricalDataDisplay.module.css
    - Ensure chart remains readable at all viewport sizes
  - [x] 2.7 Implement dark mode support
    - Add prefers-color-scheme: dark media query
    - Adjust spinner border colors for dark theme
    - Use CSS custom properties (var(--foreground), var(--gray-rgb))
    - Ensure text remains readable in dark mode
    - Follow dark mode pattern from HistoricalDataDisplay.module.css
  - [x] 2.8 Style loading spinner with animation
    - Define @keyframes spin animation (rotate 360deg)
    - Apply animation to spinner class (1s linear infinite)
    - Use border-radius: 50% for circular shape
    - Add aria-label="Loading forecast data" for accessibility
    - Copy spinner implementation from HistoricalDataDisplay
  - [x] 2.9 Ensure chart visualization tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify chart renders with correct styling
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Chart displays with 300px height and responsive width
- Orange line color clearly distinguishes forecast from historical data
- Section heading "7-Day Forecast" displays correctly
- Responsive design works across mobile, tablet, desktop
- Dark mode styling applies correctly
- Loading spinner animates smoothly
- CSS follows design system patterns

### Home Page Integration

#### Task Group 3: Integration and Verification
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete home page integration
  - [x] 3.1 Write 2-8 focused tests for home page integration
    - Limit to 2-8 highly focused tests maximum
    - Test only critical integration behaviors:
      - ForecastDataDisplay component renders in correct section
      - Component appears alongside CurrentTemperatureDisplay and HistoricalDataDisplay
      - Page layout maintains proper structure with all three sections
      - No conflicts with existing components
    - Skip exhaustive testing of page-level edge cases
    - Location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/page.integration.test.tsx`
  - [x] 3.2 Import ForecastDataDisplay in page.tsx
    - Add import statement: `import { ForecastDataDisplay } from "./ForecastDataDisplay";`
    - Location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/page.tsx`
    - Follow import pattern from HistoricalDataDisplay
  - [x] 3.3 Render ForecastDataDisplay in forecastSection
    - Replace comment "Empty structural container for future 7-day forecast component"
    - Add `<ForecastDataDisplay />` inside forecastSection div
    - Maintain existing className structure: `${styles.section} ${styles.forecastSection}`
    - No changes needed to home.module.css styling
  - [x] 3.4 Verify component appears on home page
    - Start development server if not running
    - Navigate to home page (/)
    - Verify ForecastDataDisplay renders in third section
    - Check that all three sections (current temp, historical, forecast) display correctly
    - Confirm no console errors appear
  - [x] 3.5 Ensure integration tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify component integrates correctly with home page
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- ForecastDataDisplay component renders in forecastSection on home page
- Component displays below HistoricalDataDisplay
- Page layout remains intact with proper spacing
- No visual conflicts with existing components
- No console errors or warnings

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review tests from Task Groups 1-3
    - Review the 2-8 tests written for component structure (Task 1.1)
    - Review the 2-8 tests written for chart visualization (Task 2.1)
    - Review the 2-8 tests written for home page integration (Task 3.1)
    - Total existing tests: approximately 6-24 tests
  - [x] 4.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage:
      - User views forecast immediately after setting zipcode in profile
      - User sees forecast update when localStorage zipcode changes
      - Forecast data displays correctly when API returns partial data
      - Error recovery when API fails then succeeds on retry
    - Focus ONLY on gaps related to forecast feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
  - [x] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows:
      - Test complete user flow: visit page -> see loading -> see forecast
      - Test date calculation accuracy (days +1 through +7)
      - Test data filtering (only future dates displayed)
      - Test orange line distinguishability in rendered output
      - Test responsive behavior at key breakpoints (320px, 768px, 1024px)
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases unless business-critical
    - Location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/ForecastDataDisplay.integration.test.tsx`
  - [x] 4.4 Run feature-specific tests only
    - Run ONLY tests related to forecast feature (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 16-34 tests maximum
    - Command: `npm test -- ForecastDataDisplay` or similar focused test command
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Critical user workflows for forecast feature are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on forecast feature requirements
- Date calculation accuracy verified
- Orange line color distinction validated
- Responsive behavior confirmed at key breakpoints

## Execution Order

Recommended implementation sequence:
1. **Frontend Component Implementation** (Task Group 1) - Build core component structure, state management, data fetching
2. **Frontend Visualization & Styling** (Task Group 2) - Add Recharts visualization with orange line, CSS styling, responsive design
3. **Home Page Integration** (Task Group 3) - Integrate component into existing page layout
4. **Test Review & Gap Analysis** (Task Group 4) - Review coverage and add strategic tests for critical workflows

## Key Technical Details

### File Paths
- Component: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.tsx`
- CSS Module: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.module.css`
- Page Integration: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/page.tsx`
- Tests: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/ForecastDataDisplay*.test.tsx`

### Reference Patterns
- Mirror component structure from: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.tsx`
- Copy CSS patterns from: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.module.css`
- Follow integration pattern in: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/page.tsx`

### Key Distinctions from HistoricalDataDisplay
1. **Date Calculation**: Future dates (+1 to +7) instead of past dates (-7 to -1)
2. **Line Color**: Orange stroke instead of blue/var(--foreground)
3. **Section Heading**: "7-Day Forecast" instead of no heading
4. **API Data Filtering**: Filter for future dates instead of past dates

### API Endpoint
- Endpoint: `/api/weather?zipcode={zipcode}`
- Method: GET
- Response: `{data: Record<string, number> | null}` where keys are ISO date strings (YYYY-MM-DD)
- No API modifications required - client-side filtering handles date range

### Color Scheme
- Historical Data: Blue line (var(--foreground))
- Forecast Data: Orange line (e.g., #FF8C42 or similar orange value)

### Responsive Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Accessibility
- Loading spinner: aria-label="Loading forecast data"
- Semantic HTML structure
- Keyboard navigation support (via Recharts)

### Browser Compatibility
- Modern browsers with ES6+ support
- CSS custom properties support
- Dark mode media query support

## Standards Compliance

This task breakdown follows:
- **Test Writing Standards**: Minimal focused tests during development (2-8 per group), defer edge cases
- **Component Best Practices**: Single responsibility, reusability, clear interface, encapsulation
- **CSS Best Practices**: CSS modules methodology, design system tokens, minimal custom CSS
- **Responsive Design**: Mobile-first approach, standard breakpoints, fluid layouts
- **Error Handling**: User-friendly messages, graceful degradation, centralized error handling
- **Coding Style**: Consistent naming, meaningful names, small focused functions, DRY principle
