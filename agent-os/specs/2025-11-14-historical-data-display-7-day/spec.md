# Specification: Historical Data Display (7-Day)

## Goal
Display a line graph visualizing temperature data for the past 7 complete days (excluding today) for the user's configured zipcode, with responsive design and clear error handling.

## User Stories
- As a weather app user, I want to see temperature trends over the past week so that I can understand recent weather patterns
- As a weather app user, I want the graph to auto-scale and show hover details so that I can easily read specific temperature values for any day

## Specific Requirements

**Component Structure and Location**
- Create new client component `HistoricalDataDisplay.tsx` in `/weather-app/apps/web/app/` directory
- Create companion CSS module `HistoricalDataDisplay.module.css` in same directory
- Use "use client" directive for client-side rendering following CurrentTemperatureDisplay pattern
- Export named function component called HistoricalDataDisplay
- Import and integrate component into page.tsx within the historicalSection div

**Data Fetching and State Management**
- Fetch data on component mount using useEffect hook with empty dependency array
- Read userZipcode from localStorage using localStorage.getItem('userZipcode')
- Make single API call to GET /api/weather?zipcode={zipcode} without date parameter
- API returns all dates and temperatures for zipcode in format: { data: { "YYYY-MM-DD": number, ... } | null }
- Use useState hooks for: isLoading (boolean), temperatureData (array of chart-ready objects), hasZipcode (boolean)
- Handle null/missing zipcode with toast.error and early return, setting hasZipcode to false
- Handle API errors with toast.error and console.error following existing pattern

**Date Range Calculation and Filtering**
- Calculate date range for past 7 complete days excluding today (days -7 through -1)
- Create array of 7 date strings in YYYY-MM-DD format for filtering
- Filter API response data to extract only temperatures for those 7 specific dates
- Transform filtered data into array of objects with structure: { date: string, temperature: number | null }
- Use JavaScript Date object for calculations: new Date(), setDate(), toISOString().split('T')[0]

**Date Formatting for Display**
- Format X-axis labels as "Mon, Nov 11" using toLocaleDateString with options: { weekday: 'short', month: 'short', day: 'numeric' }
- Apply formatting to each date string before passing to chart component
- Ensure consistent date formatting across all 7 data points

**Recharts Integration**
- Install recharts library as production dependency in package.json
- Import LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer from recharts
- Use ResponsiveContainer with width="100%" and height in pixels for responsive behavior
- Configure LineChart with data prop containing array of formatted temperature objects
- Configure XAxis with dataKey for formatted date strings
- Configure YAxis to display temperature values with domain auto-scaling
- Add CartesianGrid for visual reference lines with stroke and strokeDasharray props
- Add Line component with dataKey for temperature, stroke color, and dot enabled
- Enable Tooltip component for native hover interactions showing date and temperature

**Graph Styling and Configuration**
- Set ResponsiveContainer height to 300px for desktop, adjust for mobile breakpoints
- Use CSS custom properties for colors: var(--foreground) for line stroke, var(--gray-rgb) for grid
- Configure YAxis domain to auto-scale with padding: use domain={['auto', 'auto']} or let Recharts default
- Style Line with strokeWidth: 2, activeDot radius: 5 for hover interaction
- Configure CartesianGrid with strokeDasharray="3 3" for dashed grid lines
- Set XAxis and YAxis tick styles to match theme using existing CSS variables

**Loading and Error States**
- Display centered spinner during API request using same spinner styles from CurrentTemperatureDisplay
- Show loading state immediately after setting isLoading to true
- Clear loading state in finally block after API request completes
- Return null if zipcode is missing after showing toast error
- Show toast error for API failures with message: "Failed to load historical data. Please try again."
- Display placeholder message for no data scenario: "No historical data available for the past 7 days"

**Missing Data Handling**
- Accept null values in temperature array objects for dates with no data
- Pass null values directly to Recharts Line component
- Recharts will automatically handle null values by creating gaps in the line
- Do not interpolate or fill missing data points
- Maintain all 7 date positions on X-axis even if some temperatures are null

**CSS Module Styling**
- Create HistoricalDataDisplay.module.css following CurrentTemperatureDisplay pattern
- Define container class with flexbox centering, min-height, and padding
- Reuse spinner class and keyframe animation from CurrentTemperatureDisplay styles
- Define chartContainer class for graph wrapper with appropriate width and height constraints
- Add placeholderText class matching existing helper text styles with opacity: 0.6
- Include responsive media queries for mobile (max-width: 768px), tablet (768px-1024px), and desktop (1024px+)
- Adjust ResponsiveContainer height in mobile: 250px, tablet: 280px, desktop: 300px
- Add dark mode adjustments using @media (prefers-color-scheme: dark)

**Accessibility Considerations**
- Add role="status" and aria-label="Loading historical data" to spinner
- Ensure graph container has semantic structure for screen readers
- Recharts components provide basic keyboard navigation by default
- Color contrast for line and text must meet WCAG AA standards using existing theme colors

**Integration with Existing Page**
- Component will be placed in historicalSection div on home page (page.tsx)
- No props needed - component is self-contained and reads from localStorage
- Follows same integration pattern as CurrentTemperatureDisplay

## Visual Design

No visual mockups provided. Follow existing design system patterns from CurrentTemperatureDisplay component.

## Existing Code to Leverage

**CurrentTemperatureDisplay.tsx Component Pattern**
- Client component structure with "use client" directive and React imports
- useState hooks for loading, data, and validation state management
- useEffect pattern for data fetching on mount with empty dependency array
- localStorage.getItem('userZipcode') pattern for reading user's zipcode
- Toast notification pattern: toast.error for missing zipcode and API failures
- Conditional rendering logic: loading spinner, data display, no-data message, null return for missing zipcode
- Error handling with try-catch-finally and console.error for logging
- Date calculation pattern: new Date(), getFullYear(), getMonth() + 1, getDate(), padStart()

**API Route GET /api/weather Pattern**
- Endpoint: GET /api/weather accepts zipcode and optional date query parameters
- Without date parameter returns all dates: { data: Record<string, number> | null }
- With date parameter returns single temperature: { temperature: number | null }
- Error responses use 400 for validation errors, 500 for server errors
- Validates zipcode format (5 digits) before querying data store
- Returns null values when data not found (no 404 errors)

**CSS Module Styling Patterns**
- Module CSS files with component-specific namespacing
- Container class with flexbox centering, min-height, padding
- Use CSS custom properties: var(--font-geist-sans), var(--foreground), var(--gray-rgb)
- Responsive media queries for three breakpoints: mobile, tablet, desktop
- Loading spinner with border animation and @keyframes spin definition
- Placeholder text with font-size: 0.875rem, opacity: 0.6
- Dark mode adjustments using @media (prefers-color-scheme: dark)

**Data Store Structure**
- In-memory storage: { [zipcode]: { [date]: temperature } }
- Date keys in YYYY-MM-DD format
- Temperature values as numbers
- getWeatherData(zipcode) returns all dates or null if zipcode not found

**Type Definitions**
- WeatherData interface: { zipcode: string, date: string, temperature: number }
- API response types for error handling and data structure validation
- Use TypeScript interfaces for component props and state

## Out of Scope
- Sorting functionality for dates or temperatures
- Filtering controls or date range selectors
- Export functionality (CSV, PDF, image download)
- Zoom or pan controls on the graph
- Multiple chart types or view toggle options
- Custom tooltip implementations beyond native Recharts tooltips
- Comparison views or multi-zipcode support
- Animation customizations or transition effects
- Data caching strategies or persistent storage
- Real-time updates or polling mechanisms
- Historical data beyond 7 days
- Statistical calculations (averages, trends, predictions)
- User preferences for temperature units (Fahrenheit only)
- Print-specific styling or layouts
