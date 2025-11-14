# Spec Requirements: Historical Data Display (7-Day)

## Initial Description
Fetch and display past 7 days of temperature data for user's zipcode. Calculate date range (today minus 7 days). Render data in table or card format with dates and temperatures. Handle partial data scenarios (some days missing).

**Source:** Product Roadmap Item #6
**Size Estimate:** M (Medium)
**Dependencies:** Item #5: Current Temperature Display (completed)

## Requirements Discussion

### First Round Questions

**Q1:** What type of visualization should we use for the historical data?
**Answer:** Line graph showing temperature trends over the 7-day period

**Q2:** Should this be a separate component following the pattern of CurrentTemperatureDisplay?
**Answer:** Yes, create HistoricalDataDisplay.tsx following the same pattern

**Q3:** For the date range calculation, should "past 7 days" include today or exclude it?
**Answer:** Exclude today - show days -7 through -1 (7 complete past days)

**Q4:** Should we make multiple API calls (one per day) or a single call that returns multiple days?
**Answer:** Single API call to GET /api/weather?zipcode={zipcode} that returns all available data, then filter client-side for the needed 7 days

**Q5:** What date format should we display on the graph?
**Answer:** "Mon, Nov 11" format (day of week abbreviation, month abbreviation, day number)

**Q6:** Should we show loading states while fetching data?
**Answer:** Yes, show a single spinner while the API request is in progress

**Q7:** Are there any specific features we should exclude from this iteration?
**Answer:** Exclude sorting, filtering, export functionality, and any advanced features

### Follow-up Questions

**Follow-up 1:** Which charting library should we use for the line graph?
**Answer:** Install and use Recharts (popular, declarative React charting library)

**Follow-up 2:** What should be the size/dimensions of the graph?
**Answer:** Fill the width of its container (responsive width)

**Follow-up 3:** Should the graph be interactive (hover tooltips, zoom, etc.)?
**Answer:** Hover tooltips showing exact temperature and date, but only if supported natively by the component

**Follow-up 4:** For the Y-axis temperature range, should we use a fixed range or auto-scale?
**Answer:** Auto-scale based on the data range (e.g., if temps are 45-55°F, show 40-60°F with some padding)

**Follow-up 5:** How should missing data points be visualized on the line graph?
**Answer:** Use whatever the default visualization is for the Recharts component when there's a missing data point

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Current Temperature Display - Path: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/CurrentTemperatureDisplay.tsx`
- Component patterns to follow: Client component structure, loading states, error handling with toast notifications
- localStorage usage: Reading userZipcode from localStorage
- API calling pattern: Fetch with error handling and loading state management
- Styling pattern: Module CSS files (CurrentTemperatureDisplay.module.css)

**Key Patterns from CurrentTemperatureDisplay.tsx:**
- Uses "use client" directive for client-side rendering
- useState hooks for loading, data, and validation states
- useEffect for data fetching on mount
- localStorage.getItem('userZipcode') for user's zipcode
- Toast notifications for errors and missing zipcode
- Conditional rendering for loading, data, no-data, and error states
- CSS modules for styling with BEM-like naming

## Visual Assets

### Files Provided:
No visual files found in the visuals folder.

### Visual Insights:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- Display a line graph showing temperature data for the past 7 days (excluding today)
- Date range: Days -7 through -1 relative to current date
- Single API call to GET /api/weather?zipcode={zipcode}
- Client-side filtering to extract the required 7 days of data
- Date labels formatted as "Mon, Nov 11" (day abbreviation, month abbreviation, day number)
- Native hover tooltips showing exact temperature and date (if Recharts supports natively)
- Loading spinner displayed during API request
- Error handling with toast notifications (following CurrentTemperatureDisplay pattern)
- Missing zipcode handling with toast error message
- Missing data points use default Recharts visualization (gaps in line)
- Responsive width filling container width
- Auto-scaled Y-axis based on data range with padding

### Technical Decisions

**New Dependency:**
- Add Recharts library to package.json dependencies
- Use Recharts line chart component for visualization

**Component Structure:**
- Component name: `HistoricalDataDisplay.tsx`
- Location: `/weather-app/apps/web/app/HistoricalDataDisplay.tsx`
- Styling file: `HistoricalDataDisplay.module.css`
- Follow "use client" pattern from CurrentTemperatureDisplay

**Data Management:**
- Fetch data once on component mount using useEffect
- Single API endpoint: GET /api/weather?zipcode={zipcode}
- Client-side date filtering for days -7 through -1
- Handle null/missing temperature values gracefully

**State Management:**
- isLoading: boolean for loading state
- temperatureData: array of {date, temperature} objects
- hasZipcode: boolean for zipcode validation
- Error states handled via toast notifications

**Date Calculations:**
- Calculate date range: current date minus 7 days through current date minus 1 day
- Format dates as "Mon, Nov 11" for display
- Pass dates to API in YYYY-MM-DD format (if needed for filtering)

**Graph Configuration:**
- Chart type: Line graph (Recharts LineChart)
- Width: 100% of container (responsive)
- Y-axis: Auto-scaled with padding based on data range
- X-axis: Date labels in "Mon, Nov 11" format
- Tooltips: Native Recharts hover tooltips (if available by default)
- Missing data: Default Recharts behavior (gaps in line)

### Reusability Opportunities
- Reuse localStorage zipcode reading pattern from CurrentTemperatureDisplay
- Reuse toast notification pattern for errors
- Reuse loading spinner styles and structure
- Follow same CSS module naming conventions
- Mirror component structure and hooks pattern
- Reuse error handling approach

### Scope Boundaries

**In Scope:**
- Line graph visualization of 7-day temperature history
- Responsive width, auto-scaled Y-axis
- Basic hover tooltips (if native to Recharts)
- Loading and error states
- Missing data handling (gaps)
- Client-side date filtering
- Single API call pattern
- Module CSS styling

**Out of Scope:**
- Sorting functionality
- Filtering controls
- Export functionality (CSV, PDF, etc.)
- Zoom/pan controls
- Custom tooltip implementations beyond native Recharts
- Multiple chart types or view options
- Date range selectors
- Comparison views
- Animation customizations
- Advanced graph interactions
- Data caching strategies
- Real-time updates

### Technical Considerations
- Integration point: Existing /api/weather endpoint
- Existing system: Must read userZipcode from localStorage
- Technology preference: Recharts for charting
- Pattern compliance: Follow CurrentTemperatureDisplay.tsx structure
- Styling: CSS modules following existing conventions
- Error handling: Toast notifications via react-hot-toast
- Client-side rendering: "use client" directive required
- Date formatting: Use JavaScript Date object methods or date-fns if already in dependencies
