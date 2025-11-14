# Spec Requirements: Forecast Data Display (7-Day)

## Initial Description
**Roadmap Item #7: Forecast Data Display (7-Day)**

Fetch and display next 7 days of forecast temperatures for user's zipcode. Calculate future date range (today plus 7 days). Render forecast data with clear date labels. Ensure visual distinction between historical and forecast data.

**Size Estimate**: M

## Requirements Discussion

### First Round Questions

**Q1:** Should we mirror the HistoricalDataDisplay pattern using the same Recharts line graph component, CSS modules approach, and error handling patterns?
**Answer:** Yes - mirror HistoricalDataDisplay pattern with same Recharts line graph, CSS modules, and error handling

**Q2:** For the date range calculation, should we fetch 7 days AFTER today (days +1 through +7), and use the same API endpoint (/api/weather?zipcode=X)?
**Answer:** Yes - calculate 7 days AFTER today (days +1 through +7), use same date calculation logic and API endpoint (/api/weather?zipcode=X)

**Q3:** For visual distinction from historical data, should we use a different color for the forecast line (e.g., orange vs blue)?
**Answer:** Blue for historical, orange for forecast

**Q4:** Should the component files follow the same naming convention: ForecastDataDisplay.tsx with ForecastDataDisplay.module.css in weather-app/apps/web/app/?
**Answer:** Yes - ForecastDataDisplay.tsx with ForecastDataDisplay.module.css in weather-app/apps/web/app/

**Q5:** For date display formatting, should we use the same format as historical data ("Mon, Nov 11")?
**Answer:** Same format as historical data ("Mon, Nov 11")

**Q6:** Should we use the same toast notification library (react-hot-toast) and error handling patterns?
**Answer:** Yes - same toast notification library (react-hot-toast) and error handling patterns

**Q7:** Should the forecast section have a heading/label to identify it as "7-Day Forecast"?
**Answer:** Yes - should have a heading/label to identify as "7-Day Forecast"

**Q8:** Is there anything you explicitly want to EXCLUDE from this initial implementation?
**Answer:** No exclusions - we are good

### Existing Code to Reference

**Similar Features Identified:**
- Feature: HistoricalDataDisplay - Path: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.tsx`
- CSS Module: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.module.css`

**Key Patterns to Reuse:**
- Component structure and TypeScript interfaces
- useState and useEffect hooks for data fetching
- localStorage access for zipcode retrieval
- API calling pattern using fetch with `/api/weather?zipcode=X`
- Date calculation and formatting logic
- Error handling with react-hot-toast notifications
- Loading spinner implementation
- Placeholder message for missing data
- Recharts configuration (ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip)
- CSS modules with responsive design breakpoints
- Dark mode support

### Follow-up Questions
No follow-up questions were needed.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual insights available.

## Requirements Summary

### Functional Requirements
- Create a ForecastDataDisplay component that fetches and displays 7 days of future temperature data
- Calculate date range for next 7 days (days +1 through +7 from today)
- Retrieve user's zipcode from localStorage (same pattern as HistoricalDataDisplay)
- Make API request to `/api/weather?zipcode={savedZipcode}` endpoint
- Filter and transform API response data for the 7-day forecast range
- Display temperature data using Recharts line graph component
- Format dates as "Mon, Nov 11" (weekday short, month short, day numeric)
- Use orange color for the forecast line (distinct from historical blue)
- Include section heading/label: "7-Day Forecast"
- Show loading spinner during data fetch
- Display placeholder message when no forecast data is available
- Handle missing zipcode with toast error notification
- Handle API errors with toast error notification
- Implement responsive design for mobile, tablet, and desktop viewports
- Support dark mode theming

### Reusability Opportunities
- Mirror HistoricalDataDisplay component structure completely
- Reuse CSS module patterns from HistoricalDataDisplay.module.css
- Reuse date calculation logic (but for future dates instead of past)
- Reuse API calling pattern and error handling
- Reuse Recharts configuration and layout
- Reuse loading and placeholder UI patterns
- Reuse TypeScript interfaces for temperature data points
- Reuse toast notification patterns for errors

### Scope Boundaries

**In Scope:**
- ForecastDataDisplay component creation
- 7-day future date range calculation (days +1 through +7)
- API integration with existing /api/weather endpoint
- Line graph visualization using Recharts
- Orange line color for visual distinction
- Date formatting matching historical display
- Error handling with toast notifications
- Loading states and placeholder messages
- Section heading/label
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- CSS module styling

**Out of Scope:**
- No exclusions specified
- No modifications to existing HistoricalDataDisplay component
- No changes to API endpoint functionality
- No additional forecast features beyond 7-day temperature display

### Technical Considerations
- Technology: Next.js (App Router), React, TypeScript, Recharts, react-hot-toast
- Component location: weather-app/apps/web/app/ForecastDataDisplay.tsx
- CSS location: weather-app/apps/web/app/ForecastDataDisplay.module.css
- API endpoint: /api/weather?zipcode={zipcode} (existing)
- Data storage: localStorage for zipcode retrieval
- Date calculation: Use JavaScript Date object, similar to HistoricalDataDisplay but for future dates
- Color scheme: Orange line stroke (distinct from historical blue)
- Error handling: react-hot-toast for user notifications
- Loading states: Spinner with aria-label for accessibility
- Responsive breakpoints: 320-768px (mobile), 768-1024px (tablet), 1024px+ (desktop)
- Dark mode: CSS media query (prefers-color-scheme: dark)
- Data structure: Array of {date: string, temperature: number | null} objects
- Null handling: connectNulls={false} in Recharts Line component
