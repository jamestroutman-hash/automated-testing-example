# Task Breakdown: Historical Data Display (7-Day)

## Overview
Total Task Groups: 5
Implementation Pattern: Frontend-focused feature with dependency installation, component creation, styling, integration, and strategic testing

## Task List

### Setup & Dependencies

#### Task Group 1: Install Required Dependencies
**Dependencies:** None

- [x] 1.0 Install Recharts charting library
  - [x] 1.1 Add recharts to package.json dependencies
    - Run: `npm install recharts` in `/weather-app/apps/web/` directory
    - Verify installation completes successfully
    - Verify recharts appears in package.json dependencies section
  - [x] 1.2 Verify TypeScript compatibility
    - Check that recharts types are available (library includes built-in types)
    - No additional @types package needed

**Acceptance Criteria:**
- Recharts is successfully installed as a production dependency
- Package.json is updated with recharts entry
- No installation errors or warnings

### Core Component Implementation

#### Task Group 2: Create HistoricalDataDisplay Component
**Dependencies:** Task Group 1

- [x] 2.0 Complete component structure and data fetching logic
  - [x] 2.1 Write 2-8 focused tests for component behavior
    - Limit to 2-8 highly focused tests maximum
    - Test only critical behaviors:
      - Component renders loading state initially
      - Component fetches and displays historical data for 7 days
      - Component handles missing zipcode with toast error
      - Component handles API errors with toast notification
      - Component displays placeholder for no data scenario
    - Skip exhaustive testing of date calculations, formatting edge cases, and all Recharts interactions
    - Create test file: `/weather-app/apps/web/app/__tests__/historical-data-display.test.tsx`
  - [x] 2.2 Create HistoricalDataDisplay.tsx component file
    - Location: `/weather-app/apps/web/app/HistoricalDataDisplay.tsx`
    - Add "use client" directive at top of file
    - Import React hooks: useState, useEffect from react
    - Import toast from react-hot-toast
    - Import CSS module styles
    - Import Recharts components: LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
    - Export named function component: `export function HistoricalDataDisplay()`
  - [x] 2.3 Set up component state with useState hooks
    - isLoading: boolean (default: false) - tracks API request state
    - temperatureData: array of { date: string, temperature: number | null } objects (default: [])
    - hasZipcode: boolean (default: true) - tracks zipcode validation
  - [x] 2.4 Implement date range calculation logic
    - Calculate 7 date strings for days -7 through -1 (excluding today)
    - Use JavaScript Date object: new Date(), setDate(), toISOString().split('T')[0]
    - Create array of 7 date strings in YYYY-MM-DD format
    - Store in local variable within useEffect for filtering
  - [x] 2.5 Implement data fetching in useEffect hook
    - Use empty dependency array to fetch on mount only
    - Read userZipcode from localStorage using localStorage.getItem('userZipcode')
    - Validate zipcode: if missing/empty, set hasZipcode to false, show toast.error, return early
    - Set isLoading to true before API call
    - Make GET request to `/api/weather?zipcode={zipcode}` without date parameter
    - Parse response: { data: Record<string, number> | null }
    - Use try-catch-finally pattern from CurrentTemperatureDisplay
  - [x] 2.6 Implement data filtering and transformation
    - Filter API response data to extract temperatures for 7 calculated dates
    - Transform into array of objects: { date: string, temperature: number | null }
    - Format date strings for display using toLocaleDateString with options: { weekday: 'short', month: 'short', day: 'numeric' }
    - Store formatted data in temperatureData state
    - Handle null temperatures (missing data) by passing null values directly
  - [x] 2.7 Implement error handling
    - Catch API errors with console.error for logging
    - Show toast.error with message: "Failed to load historical data. Please try again."
    - Clear loading state in finally block
  - [x] 2.8 Ensure component tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify critical component behaviors work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Component follows CurrentTemperatureDisplay pattern exactly
- Data fetching logic correctly calculates 7-day date range
- API call made to correct endpoint without date parameter
- Data filtered and transformed into chart-ready format
- Error handling matches existing toast notification pattern
- Missing/null data handled gracefully

### Graph Rendering & Visualization

#### Task Group 3: Implement Recharts Line Graph
**Dependencies:** Task Group 2

- [x] 3.0 Complete graph rendering logic
  - [x] 3.1 Write 2-8 focused tests for graph rendering
    - Limit to 2-8 highly focused tests maximum
    - Test only critical rendering behaviors:
      - Graph renders with correct data structure
      - Graph displays all 7 date labels on X-axis
      - Graph handles null temperature values (gaps in line)
      - Loading spinner displays during data fetch
    - Skip exhaustive testing of Recharts internals, tooltip interactions, and responsive behavior details
    - Add tests to existing file: `/weather-app/apps/web/app/__tests__/historical-data-display.test.tsx`
  - [x] 3.2 Implement conditional rendering logic
    - Return loading spinner if isLoading is true (reuse pattern from CurrentTemperatureDisplay)
    - Return null if hasZipcode is false (after showing toast)
    - Return placeholder message if temperatureData is empty after loading completes
    - Render graph container and Recharts components if data exists
  - [x] 3.3 Build Recharts graph structure
    - Wrap all chart components in ResponsiveContainer with width="100%" and height={300}
    - Configure LineChart with data prop set to temperatureData array
    - Add CartesianGrid with strokeDasharray="3 3" and stroke color using var(--gray-rgb)
    - Configure XAxis with dataKey pointing to formatted date field
    - Configure YAxis with domain set to ['auto', 'auto'] for auto-scaling
    - Add Line component with dataKey pointing to temperature field
    - Set Line stroke color to var(--foreground)
    - Set Line strokeWidth to 2
    - Set activeDot radius to 5 for hover interactions
    - Enable Tooltip component for native hover tooltips
  - [x] 3.4 Configure graph styling with CSS variables
    - Use var(--foreground) for line stroke color
    - Use var(--gray-rgb) for CartesianGrid stroke with opacity
    - Set XAxis and YAxis tick styles to match theme colors
    - Ensure color contrast meets accessibility requirements
  - [x] 3.5 Handle missing data visualization
    - Pass null values directly to Line component's data
    - Recharts automatically creates gaps for null values
    - Do NOT interpolate or fill missing data points
    - Maintain all 7 date positions on X-axis regardless of null values
  - [x] 3.6 Ensure graph rendering tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify critical rendering behaviors work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Graph renders correctly with provided data
- All 7 dates display on X-axis with correct formatting
- Y-axis auto-scales based on temperature range
- Line graph shows temperature trend
- Null values create gaps in line (not filled)
- Native Recharts tooltips work on hover
- Loading spinner displays during fetch
- Placeholder message shows for no data

### Styling & Responsive Design

#### Task Group 4: Create Component Styles
**Dependencies:** Task Group 3

- [x] 4.0 Complete CSS module styling
  - [x] 4.1 Write 2-8 focused tests for styling
    - Limit to 2-8 highly focused tests maximum
    - Test only critical style behaviors:
      - Component has correct CSS class names applied
      - Container maintains semantic structure
      - Responsive behavior adjusts graph height across breakpoints (if testable)
    - Skip exhaustive testing of all CSS properties and visual appearance details
    - Add tests to existing file: `/weather-app/apps/web/app/__tests__/historical-data-display.test.tsx`
  - [x] 4.2 Create HistoricalDataDisplay.module.css file
    - Location: `/weather-app/apps/web/app/HistoricalDataDisplay.module.css`
    - Follow CurrentTemperatureDisplay.module.css structure and pattern
  - [x] 4.3 Define container styles
    - .container class with display: flex, flex-direction: column
    - Center alignment: align-items: center, justify-content: center
    - Set min-height: 120px (consistent with CurrentTemperatureDisplay)
    - Add padding: 1rem
  - [x] 4.4 Create chartContainer wrapper class
    - Width: 100% to fill parent container
    - Height constraints managed via ResponsiveContainer component
    - Add any necessary positioning styles for graph wrapper
  - [x] 4.5 Reuse spinner styles from CurrentTemperatureDisplay
    - Copy .spinner class definition exactly
    - Copy @keyframes spin animation definition exactly
    - Maintains consistency across components
  - [x] 4.6 Define placeholderText styles
    - Font family: var(--font-geist-sans)
    - Font size: 0.875rem
    - Color: var(--foreground)
    - Opacity: 0.6
    - Text align: center
    - Match CurrentTemperatureDisplay placeholder pattern
  - [x] 4.7 Implement responsive media queries
    - Mobile (max-width: 768px):
      - Container padding: 0.75rem
      - ResponsiveContainer height: 250px
      - Adjust placeholder font size: 0.8rem
    - Tablet (768px - 1024px):
      - Container padding: 1rem
      - ResponsiveContainer height: 280px
      - Placeholder font size: 0.875rem
    - Desktop (1024px+):
      - Container padding: 1rem
      - ResponsiveContainer height: 300px
      - Placeholder font size: 0.875rem
  - [x] 4.8 Add dark mode support
    - Add @media (prefers-color-scheme: dark) query
    - Adjust spinner border colors for dark theme
    - Match CurrentTemperatureDisplay dark mode pattern
  - [x] 4.9 Ensure styling tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify CSS classes are applied correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- CSS module follows CurrentTemperatureDisplay pattern
- Container styles provide proper centering and spacing
- Responsive breakpoints match existing component standards (mobile, tablet, desktop)
- Graph height adjusts appropriately per breakpoint
- Dark mode styles applied for theme consistency
- All CSS uses existing design system variables

### Integration & Testing

#### Task Group 5: Integrate Component and Review Tests
**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete integration and test review
  - [x] 5.1 Import HistoricalDataDisplay into page.tsx
    - Add import statement: `import { HistoricalDataDisplay } from './HistoricalDataDisplay';`
    - Insert component inside historicalSection div
    - Component is self-contained with no props needed
    - Follow same integration pattern as CurrentTemperatureDisplay
  - [x] 5.2 Verify component renders in page context
    - Run development server: `npm run dev`
    - Navigate to home page
    - Verify component appears in historical section
    - Check console for errors
  - [x] 5.3 Test complete user workflow manually
    - Test with valid zipcode: component fetches and displays 7-day graph
    - Test with missing zipcode: toast error appears, component returns null
    - Test loading state: spinner displays during API request
    - Test no data scenario: placeholder message displays
    - Test hover interactions: Recharts tooltips appear on data point hover
    - Test responsive behavior: graph adjusts height on mobile, tablet, desktop viewports
  - [x] 5.4 Review all tests written in Task Groups 2-4
    - Review the 2-8 tests written for component behavior (Task 2.1)
    - Review the 2-8 tests written for graph rendering (Task 3.1)
    - Review the 2-8 tests written for styling (Task 4.1)
    - Total existing tests: approximately 6-24 tests
  - [x] 5.5 Analyze test coverage gaps for this feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to historical data display feature
    - Do NOT assess entire application test coverage
    - Prioritize integration tests and end-to-end workflows
    - Consider: date filtering logic, API error scenarios, responsive behavior validation
  - [x] 5.6 Write up to 10 additional strategic tests maximum (if needed)
    - Add tests ONLY to fill identified critical gaps from 5.5
    - Maximum 10 new tests across all test files
    - Focus on integration workflows and feature completion
    - Example critical gaps to consider:
      - Date range calculation accuracy (7 days excluding today)
      - API response filtering for specific date range
      - End-to-end workflow: zipcode → API call → data display → graph render
      - Error recovery scenarios
    - Do NOT write comprehensive edge case coverage
    - Skip performance tests, accessibility audits, and exhaustive validation tests
  - [x] 5.7 Update home-integration.test.tsx for new component
    - Add 2-4 integration tests for HistoricalDataDisplay in home page context
    - Test component renders in historicalSection div
    - Test component integrates with page layout correctly
    - Test component follows semantic structure
    - Counts toward the 10 test maximum from 5.6
  - [x] 5.8 Run feature-specific tests only
    - Run ONLY tests related to historical data display feature
    - Expected total: approximately 16-34 tests maximum
    - Command: `npm test -- --testPathPattern=historical` or similar filter
    - Do NOT run entire application test suite
    - Verify all feature tests pass
  - [x] 5.9 Verify accessibility requirements
    - Loading spinner has role="status" and aria-label="Loading historical data"
    - Graph container maintains semantic structure
    - Color contrast meets WCAG AA standards (verify with theme colors)
    - Recharts provides basic keyboard navigation by default
  - [x] 5.10 Final manual testing checklist
    - Test in Chrome, Firefox, Safari (or available browsers)
    - Test on mobile device or mobile emulator
    - Verify graph is responsive and readable at all breakpoints
    - Verify tooltip interactions work smoothly
    - Verify date labels are formatted correctly as "Mon, Nov 11"
    - Verify Y-axis auto-scales with padding
    - Verify null data creates gaps (not errors)
    - Verify no console errors or warnings

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- No more than 10 additional tests added when filling testing gaps
- Component successfully integrated into home page
- Component displays correctly in historicalSection div
- Manual testing confirms all requirements met
- Responsive design works across mobile, tablet, desktop
- Error handling works correctly for all scenarios
- Accessibility requirements satisfied
- No console errors or warnings

## Execution Order

Recommended implementation sequence:
1. Setup & Dependencies (Task Group 1) - Install Recharts library
2. Core Component Implementation (Task Group 2) - Component structure, state, data fetching, date calculations
3. Graph Rendering & Visualization (Task Group 3) - Recharts integration, conditional rendering, missing data handling
4. Styling & Responsive Design (Task Group 4) - CSS modules, responsive breakpoints, dark mode
5. Integration & Testing (Task Group 5) - Page integration, test review, gap analysis, manual testing

## Dependencies Summary

```
Task Group 1 (Setup)
    ↓
Task Group 2 (Component Implementation)
    ↓
Task Group 3 (Graph Rendering)
    ↓
Task Group 4 (Styling)
    ↓
Task Group 5 (Integration & Testing)
```

## Key Technical Notes

**Recharts Configuration:**
- ResponsiveContainer manages responsive width and height
- LineChart receives array of { date, temperature } objects
- XAxis displays formatted date strings ("Mon, Nov 11")
- YAxis auto-scales with domain: ['auto', 'auto']
- Line component handles null values by creating gaps
- Tooltip component provides native hover interactions

**Date Handling:**
- Calculate 7 dates: days -7 through -1 relative to today
- API call fetches all data, client-side filters for 7 dates
- Display format: "Mon, Nov 11" using toLocaleDateString
- API filter format: YYYY-MM-DD strings

**Reusability Patterns:**
- localStorage zipcode reading from CurrentTemperatureDisplay
- Toast error notifications from react-hot-toast
- Loading spinner styles and animation
- CSS module structure and responsive breakpoints
- Error handling with try-catch-finally

**Testing Focus:**
- Write 2-8 tests per task group during development
- Total development tests: approximately 6-24 tests
- Maximum 10 additional tests for gap filling
- Final total: approximately 16-34 tests for entire feature
- Run only feature-specific tests, NOT entire suite
- Focus on critical workflows, skip exhaustive coverage
