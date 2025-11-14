# Specification: Forecast Data Display (7-Day)

## Goal
Create a ForecastDataDisplay component that fetches and visualizes the next 7 days of temperature forecast data for the user's zipcode, using an orange line chart to visually distinguish it from historical data.

## User Stories
- As a weather app user, I want to view the 7-day temperature forecast so that I can plan ahead for upcoming weather conditions
- As a user, I want to clearly distinguish forecast data from historical data so that I understand what is predicted versus what has occurred

## Specific Requirements

**Component Creation and File Structure**
- Create ForecastDataDisplay.tsx component in weather-app/apps/web/app/
- Create ForecastDataDisplay.module.css in weather-app/apps/web/app/
- Use "use client" directive for client-side React hooks
- Export named function component ForecastDataDisplay
- Follow TypeScript interface pattern with TemperatureDataPoint type

**Date Range Calculation for Forecast**
- Calculate 7 days AFTER today (days +1 through +7)
- Use JavaScript Date object with setDate method to increment days
- Format dates to ISO string format (YYYY-MM-DD) for API filtering
- Generate array of 7 future date strings for data filtering

**API Integration and Data Fetching**
- Retrieve user's zipcode from localStorage using key "userZipcode"
- Make GET request to /api/weather?zipcode={savedZipcode} endpoint
- Parse response JSON to extract data object (Record<string, number> format)
- Filter API response to include only the 7 future dates calculated
- Transform filtered data into TemperatureDataPoint array format

**Data State Management**
- Use useState for isLoading, temperatureData, and hasZipcode state
- Use useEffect hook with empty dependency array for initial data fetch
- Set loading state before API call, clear in finally block
- Handle null temperatures in data points (API may not have all dates)
- Check if any actual data exists before displaying chart

**Error Handling and User Feedback**
- Import and use react-hot-toast for error notifications
- Show toast error "Please configure your zipcode in the profile page" if zipcode missing
- Show toast error "Failed to load forecast data. Please try again." for API failures
- Log errors to console for debugging purposes
- Return null component render if no zipcode exists

**Chart Visualization with Recharts**
- Use Recharts library components: ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
- Set ResponsiveContainer width to 100% and height to 300px
- Configure Line component with stroke color in orange (distinguish from historical blue)
- Use strokeWidth of 2, dot radius of 4, activeDot radius of 5
- Set connectNulls to false to show gaps in data
- Configure CartesianGrid with strokeDasharray "3 3" and rgba opacity
- Use var(--foreground) for axis tick colors for dark mode compatibility

**Date Formatting for Display**
- Convert ISO date strings to display format "Mon, Nov 11"
- Use toLocaleDateString with locale "en-US"
- Specify options: weekday "short", month "short", day "numeric"
- Append "T00:00:00" to ISO date string for correct timezone handling

**Loading and Placeholder States**
- Display loading spinner during data fetch with same styling as HistoricalDataDisplay
- Add aria-label "Loading forecast data" to spinner for accessibility
- Show placeholder message "No forecast data available for the next 7 days" if no data
- Use same container and text styling patterns as historical component

**Section Heading and Layout**
- Add heading element with text "7-Day Forecast" above the chart container
- Style heading consistently with component's design system
- Use CSS module class for heading styling
- Place heading inside container div before chartContainer

**CSS Module Styling**
- Mirror HistoricalDataDisplay.module.css structure and patterns
- Define container, chartContainer, placeholderText, spinner, and heading classes
- Use CSS custom properties (var(--foreground), var(--gray-rgb)) for theming
- Implement responsive breakpoints: mobile (max-width 768px), tablet (768-1024px), desktop (1024px+)
- Add dark mode support using prefers-color-scheme media query
- Use same spinner animation keyframes as historical component

**Integration with Home Page**
- Import ForecastDataDisplay component in page.tsx
- Render component inside existing forecastSection div
- Replace empty structural container comment with component
- Maintain existing section styling from home.module.css

## Visual Design
No visual mockups provided. Follow existing HistoricalDataDisplay component design patterns with these distinctions:
- Use orange color for forecast line instead of blue
- Add "7-Day Forecast" heading text
- Maintain same chart dimensions, spacing, and responsive behavior

## Existing Code to Leverage

**HistoricalDataDisplay.tsx component structure**
- Replicate overall component architecture including useState hooks for isLoading, temperatureData, hasZipcode
- Reuse useEffect pattern for data fetching on component mount
- Copy localStorage zipcode retrieval logic
- Mirror API calling pattern with fetch and response.json parsing
- Adapt date calculation loop (change from past 7 days to future 7 days)
- Reuse date formatting logic with toLocaleDateString
- Copy error handling with try-catch and toast notifications
- Use same conditional rendering for loading, no zipcode, no data, and chart states

**HistoricalDataDisplay.module.css styling patterns**
- Copy container, chartContainer, placeholderText, and spinner class definitions
- Reuse responsive breakpoint structure for mobile, tablet, desktop
- Copy dark mode media query adjustments
- Replicate spinner animation keyframes
- Add new heading class following same design token patterns

**API endpoint /api/weather GET method**
- Use existing endpoint that returns all temperature data when only zipcode provided
- Response format: {data: Record<string, number> | null} where keys are ISO date strings
- No API modifications needed - component filters response client-side
- Handle null data response gracefully

**Recharts configuration from HistoricalDataDisplay**
- Copy complete ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip setup
- Change Line stroke color to orange (#FF8C42 or similar orange value from design system)
- Keep all other configuration: strokeWidth, dot sizes, connectNulls, axis tick colors

**page.tsx integration pattern**
- Follow existing pattern of importing and rendering components
- Place ForecastDataDisplay inside forecastSection div already defined in layout
- No changes needed to section styling or home.module.css

## Out of Scope
- Modifications to existing HistoricalDataDisplay component or its styling
- Changes to /api/weather endpoint functionality or data structure
- Additional forecast visualizations beyond temperature line chart (precipitation, wind, etc)
- Forecast data beyond 7-day range (no extended forecasts)
- User-configurable forecast date ranges
- Comparison overlays between forecast and historical data
- Export or download functionality for forecast data
- Detailed forecast tooltips with additional weather metrics
- Automatic refresh or polling for updated forecast data
- Unit or integration tests (follow minimal testing approach during development)
