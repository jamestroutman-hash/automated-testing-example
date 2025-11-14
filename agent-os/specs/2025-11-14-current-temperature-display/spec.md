# Specification: Current Temperature Display

## Goal
Display the current day's temperature for the user's configured zipcode by fetching data from the existing weather API. Provide clear feedback for loading, no data, and error states.

## User Stories
- As a user, I want to see today's temperature on the home page so that I can quickly check the current weather for my location
- As a user without a configured zipcode, I want to be prompted to set up my profile so that I can start viewing weather data

## Specific Requirements

**Client-side React component rendering**
- Create a new client-side React component using "use client" directive (Next.js pattern)
- Import and render the component inside the .currentTempSection container in /weather-app/apps/web/app/page.tsx
- Component should be self-contained with no prop dependencies
- Use React hooks: useState for managing component state, useEffect for data fetching on mount
- Component file should be named CurrentTemperatureDisplay.tsx and placed in /weather-app/apps/web/app/

**Date calculation logic**
- Use client-side new Date() to get current date in user's local timezone
- Format date as YYYY-MM-DD for API request: year-month-day with zero-padding (e.g., "2025-11-14")
- Calculate date string using: year = getFullYear(), month = getMonth() + 1 padded, day = getDate() padded
- No server-side date calculation or timezone conversion required

**Zipcode retrieval from localStorage**
- Read user's zipcode from localStorage using localStorage.getItem('userZipcode') inside useEffect hook on component mount
- Follow the same pattern used in ProfileForm.tsx (lines 18-27)
- Handle missing zipcode case: if localStorage returns null, undefined, or empty string, show toast notification
- Toast notification should prompt user to visit profile page to configure zipcode
- Do not make API request if zipcode is missing

**API integration with weather endpoint**
- Make GET request to /api/weather endpoint with query parameters: zipcode and date
- Example request URL: /api/weather?zipcode=10001&date=2025-11-14
- Use fetch API for HTTP request (no additional libraries required)
- Expected response format when data exists: { temperature: number }
- Expected response format when no data: { temperature: null }
- Handle API request lifecycle: loading state before request completes, data/no-data state after success, error state on failure

**Temperature display format**
- Display only the numeric temperature value with degree symbol and "F" (e.g., "72°F")
- No heading, no label, no additional context text
- Display value should be clearly visible and properly formatted
- Handle edge case: temperature value of 0 should display as "0°F" (not treated as falsy/empty)

**Loading state with spinner**
- Show spinner/loading indicator immediately after zipcode is retrieved and API request starts
- Spinner should be visible throughout entire API request duration
- Hide spinner once API response is received (success or failure)
- Spinner component may need to be created or imported from existing patterns

**No data state with placeholder message**
- Display message: "No temperature data available for today" when API returns temperature: null
- Style placeholder message to match helper text pattern from ProfileForm.tsx (lines 105-111)
- Use .helperText CSS class or similar styling: smaller font size, reduced opacity, muted color
- This is not an error state - it's a valid empty state

**Error handling with toast notifications**
- Use react-hot-toast library for all error notifications (already integrated in project)
- Display toast notification for API request failures (network errors, 4xx/5xx status codes)
- Display toast notification when zipcode is not configured, prompting user to visit profile page
- Follow error handling patterns from ProfileForm.tsx (lines 68-70) and WeatherForm.tsx (lines 131-134)
- Toast notifications should auto-dismiss or allow manual dismissal

**Component state management**
- Manage five distinct UI states: initial/loading, data available, no data available, missing zipcode, API error
- Use conditional rendering to display appropriate UI for each state
- State transitions: initial → loading → (data available | no data | error), or initial → missing zipcode
- Keep all state local to component using useState hooks

**CSS styling approach**
- Create companion CSS module file (e.g., CurrentTemperatureDisplay.module.css) following existing patterns
- Import CSS module using: import styles from './CurrentTemperatureDisplay.module.css'
- Reuse CSS variable patterns from home.module.css for consistency (--gray-rgb, --foreground, etc.)
- Ensure responsive styling works across mobile (320px-768px), tablet (768px-1024px), and desktop (1024px+)
- Temperature value should be prominently displayed with appropriate font size and weight

## Visual Design

No visual mockups provided. Follow existing design patterns from ProfileForm and WeatherForm components.

## Existing Code to Leverage

**ProfileForm.tsx localStorage pattern (lines 18-27)**
- useEffect hook that runs on component mount to read from localStorage
- Try-catch block wrapping localStorage access to handle potential errors
- Pattern: const savedZipcode = localStorage.getItem('userZipcode')
- Use this exact pattern for retrieving zipcode in CurrentTemperatureDisplay
- Error logging to console if localStorage access fails

**ProfileForm.tsx helper text styling (lines 105-111)**
- CSS class .helperText for displaying secondary text information
- Styling: smaller font size (0.875rem), reduced opacity (0.6), muted color
- Apply this styling pattern to "No temperature data available for today" message
- Provides visual hierarchy showing this is supplementary information

**WeatherForm.tsx toast notifications (lines 115, 118, 126, 129, 134)**
- toast.success() for successful operations (not needed for this feature)
- toast.error() for failures and validation errors
- Used for API request failures and missing zipcode scenarios
- Import toast from 'react-hot-toast' and use toast.error('message') pattern

**WeatherForm.tsx loading state pattern (lines 31, 84, 136)**
- Boolean state variable isSubmitting to track loading state
- Set to true before async operation, set to false in finally block
- Use similar pattern with isLoading state variable for CurrentTemperatureDisplay
- Controls UI rendering: show spinner when loading, show data when not loading

**API route GET /api/weather (lines 62-126 in route.ts)**
- Accepts query parameters: zipcode (required) and date (optional)
- Returns { temperature: number | null } when date parameter is provided
- Returns 400 status for validation errors with error details
- Returns 200 status for successful requests even when temperature is null
- Use existing endpoint as-is, no modifications needed

## Out of Scope
- Temperature unit conversion between Fahrenheit and Celsius
- Weather condition icons or visual indicators (sunny, cloudy, rainy icons)
- Historical temperature comparisons (warmer/cooler than yesterday, trends)
- Temperature range display (high/low temperatures for the day)
- Feels-like temperature, humidity, wind speed, or other weather metrics
- Manual refresh button or automatic background refresh functionality
- Caching of temperature data on client side
- Animation effects when temperature value changes or updates
- Multiple zipcode support or zipcode switching functionality
- Heading or title text above the temperature value (display value only)
