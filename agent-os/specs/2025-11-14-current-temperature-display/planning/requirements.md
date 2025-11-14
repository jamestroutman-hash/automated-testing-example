# Spec Requirements: Current Temperature Display

## Initial Description
Fetch and display current day's temperature for user's configured zipcode. Handle cases where no data exists (show placeholder). Implement date calculation logic to determine "today". Connect frontend to data store API.

**Size Estimate:** S

**Source:** Product Roadmap #5

## Requirements Discussion

### First Round Questions

**Q1: Component placement and approach**
I assume you want this as a client-side React component that will be rendered inside the .currentTempSection container on the home page (app/page.tsx), similar to how ProfileForm and WeatherForm are structured. Is that correct?

**Answer:** YES - Use client-side React component in .currentTempSection container, similar to ProfileForm and WeatherForm patterns

**Q2: Date calculation**
I'm thinking we should use client-side new Date() to get the current date in the user's local timezone, then format it as YYYY-MM-DD for the API request. Should we use this approach, or do you prefer server-side date calculation?

**Answer:** YES - Use client-side new Date() for user's local timezone

**Q3: No data placeholder**
When no temperature data exists for today, I assume we should display a friendly placeholder message (like "No temperature data available for today"). Should this be styled similar to the helper text patterns in ProfileForm and WeatherForm?

**Answer:** YES - Display friendly placeholder message styled like form helper text patterns

**Q4: Zipcode fetching**
I'm thinking the component should read the user's zipcode from localStorage.getItem('userZipcode') in a useEffect hook on mount, matching the pattern in ProfileForm.tsx. Is that correct?

**Answer:** YES - Read from localStorage.getItem('userZipcode') in useEffect hook, matching ProfileForm.tsx pattern

**Q5: API request flow**
I assume the component should make a GET request to /api/weather?zipcode={zipcode}&date={today} after retrieving the zipcode. Should we handle three states: loading, data available, and no data available?

**Answer:** YES - Make GET request to /api/weather?zipcode={zipcode}&date={today}, handle three states (loading, data available, no data)

**Q6: Temperature display format**
For displaying the temperature, I'm thinking we should show something like "Current Temperature: 72 degrees F" with clear labeling. Should we use this format, or would you prefer something more minimal like just "72°F"?

**Answer:** Just the numeric value with degree symbol (e.g., "72°F") - no additional context text

**Q7: Error handling**
I assume we should use toast notifications (react-hot-toast) for API failures, similar to ProfileForm and WeatherForm patterns. If the user hasn't configured a zipcode yet, should we show a message prompting them to visit the profile page?

**Answer:** YES - Use toast notifications (react-hot-toast) for API failures and prompt user to visit profile page if zipcode not configured

**Q8: Features to exclude**
Are there any features we should explicitly exclude from this implementation? For example, should we skip temperature unit conversion (F to C), weather condition icons, or historical comparisons?

**Answer:** Skip temperature unit conversion (F to C) and weather condition icons in initial implementation

### Existing Code to Reference

**Similar Features Identified:**
- Feature: ProfileForm - Path: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/profile/ProfileForm.tsx`
  - Components to potentially reuse: localStorage pattern, useEffect hook for data loading, helper text styling
- Feature: WeatherForm - Path: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/WeatherForm.tsx`
  - Components to potentially reuse: toast notifications, loading states, error handling patterns

### Follow-up Questions

**Follow-up 1: Placeholder message text**
You mentioned displaying a "friendly placeholder message styled like form helper text patterns" when no data exists. What specific text should be displayed? For example:
- "No temperature data available for today"
- "Temperature data not yet recorded"
- Something else?

**Answer:** "No temperature data available for today"

**Follow-up 2: Loading state display**
You confirmed we should handle three states (loading, data available, no data). What should the loading state show while the API request is in progress? For example:
- "Loading..." text
- A spinner/loading indicator
- Empty/blank state
- Something else?

**Answer:** A spinner/loading indicator

**Follow-up 3: Section heading**
Should the current temperature display include a heading/title within the .currentTempSection container (like "Current Temperature" or "Today's Temperature"), or should the temperature value be displayed without any heading?

**Answer:** Temperature value should be displayed WITHOUT any heading

## Visual Assets

### Files Provided:
No visual files found in the visuals folder.

### Visual Insights:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- Create a client-side React component for current temperature display
- Place component inside .currentTempSection container in app/page.tsx
- Use client-side new Date() to calculate today's date in user's local timezone
- Format date as YYYY-MM-DD for API request
- Read user's zipcode from localStorage.getItem('userZipcode') in useEffect on mount
- Make GET request to /api/weather?zipcode={zipcode}&date={today}
- Handle three UI states: loading, data available, no data available
- Display temperature as numeric value with degree symbol only (e.g., "72°F") - no heading, no context text
- Show placeholder message "No temperature data available for today" when no data exists, styled like form helper text
- Display spinner/loading indicator during API request
- Use toast notifications (react-hot-toast) for API failures
- Prompt user to visit profile page if zipcode not configured

### UI/UX Specifications

**Component States:**

1. **Loading State:**
   - Display: Spinner/loading indicator
   - Shown: During API request in progress
   - Duration: From request start until response received

2. **Data Available State:**
   - Display: Temperature value only (e.g., "72°F")
   - Format: Numeric value + degree symbol + "F"
   - No heading, no additional context text
   - Shown: When API returns temperature data successfully

3. **No Data State:**
   - Display: "No temperature data available for today"
   - Styling: Match form helper text patterns from ProfileForm/WeatherForm
   - Shown: When API returns successfully but temperature is null

4. **No Zipcode State:**
   - Display: Toast notification prompting user to visit profile page
   - Shown: When localStorage.getItem('userZipcode') returns null/undefined

5. **Error State:**
   - Display: Toast notification with error message
   - Shown: When API request fails (network error, server error, etc.)

**Visual Patterns to Follow:**
- Helper text styling from ProfileForm.tsx
- Loading indicator pattern from WeatherForm.tsx
- Toast notification styling from react-hot-toast (existing pattern)

### API Integration Details

**Endpoint:**
- GET /api/weather

**Query Parameters:**
- `zipcode`: String - User's zipcode from localStorage
- `date`: String - Today's date formatted as YYYY-MM-DD

**Example Request:**
```
GET /api/weather?zipcode=10001&date=2025-11-14
```

**Expected Response (Success):**
```json
{
  "temperature": 72
}
```

**Expected Response (No Data):**
```json
{
  "temperature": null
}
```

**Date Calculation Logic:**
```javascript
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const dateString = `${year}-${month}-${day}`; // YYYY-MM-DD
```

### Error Handling Approach

**Error Scenarios:**

1. **Missing Zipcode:**
   - Condition: localStorage.getItem('userZipcode') returns null/undefined
   - Action: Show toast notification prompting user to configure zipcode on profile page
   - No API request made

2. **API Request Failure:**
   - Condition: Network error, server error (4xx, 5xx)
   - Action: Show toast notification with error message
   - User can retry by refreshing the page

3. **No Temperature Data:**
   - Condition: API returns successfully but temperature is null
   - Action: Display placeholder message "No temperature data available for today"
   - Not considered an error, just empty state

**Toast Notification Pattern:**
- Use react-hot-toast library (already integrated)
- Follow error notification pattern from ProfileForm.tsx and WeatherForm.tsx
- Display at top-center or top-right of screen
- Auto-dismiss after a few seconds or allow manual dismissal

### Edge Cases

1. **Timezone Handling:**
   - Use client-side new Date() which automatically uses user's local timezone
   - No timezone conversion needed
   - Date string formatted in user's local date

2. **Component Mount Timing:**
   - useEffect hook runs after initial render
   - Component may briefly show nothing before state is determined
   - Loading state displayed immediately after zipcode is retrieved and API request starts

3. **localStorage Availability:**
   - Assume localStorage is available (browser context)
   - If not available, will throw error and be caught by toast notification

4. **API Response Timing:**
   - Show loading indicator immediately on mount (after zipcode check)
   - Keep loading indicator visible until response received
   - Handle slow network conditions gracefully

5. **Page Refresh:**
   - Component re-fetches data on every page refresh
   - No caching of temperature data
   - Always shows current server-side data

6. **Empty/Invalid Zipcode:**
   - If zipcode exists in localStorage but is empty string, treat as missing zipcode
   - Show prompt to configure zipcode

7. **Temperature Value of 0:**
   - Display "0°F" (not treated as falsy/empty)
   - Only null/undefined treated as no data

### Reusability Opportunities
- localStorage pattern from ProfileForm.tsx
- useEffect hook pattern for data loading from ProfileForm.tsx
- Toast notification pattern from ProfileForm.tsx and WeatherForm.tsx
- Helper text styling from ProfileForm.tsx
- Loading state pattern from WeatherForm.tsx
- Error handling pattern from WeatherForm.tsx

### Scope Boundaries

**In Scope:**
- Client-side component rendering current temperature
- Date calculation for "today" in user's local timezone
- Zipcode retrieval from localStorage with key 'userZipcode'
- API integration with GET /api/weather endpoint
- Three UI states: loading (spinner), data available (temperature display), no data (placeholder message)
- Temperature display format: numeric value + degree symbol + "F" (e.g., "72°F")
- No heading or title above temperature value
- Placeholder message: "No temperature data available for today"
- Toast notifications for API errors
- Toast notification prompting zipcode configuration if not set
- Component placement in .currentTempSection container in app/page.tsx

**Out of Scope:**
- Temperature unit conversion (Fahrenheit to Celsius)
- Weather condition icons (sunny, cloudy, rainy, etc.)
- Historical comparisons (warmer/cooler than yesterday)
- Multiple zipcode support
- Temperature trend indicators (arrows, graphs)
- Manual refresh/reload button
- Caching of temperature data
- Background auto-refresh
- Animation effects on temperature display
- Temperature range (high/low)
- Feels-like temperature
- Humidity, wind speed, or other weather metrics

### Technical Considerations
- Component follows "use client" directive pattern (Next.js client component)
- Uses React hooks: useState, useEffect
- Integrates with existing /api/weather GET endpoint
- Follows existing localStorage key convention ('userZipcode')
- Uses react-hot-toast library for notifications
- Date formatting: YYYY-MM-DD to match API expectations
- API response structure: { temperature: number | null }
- Three distinct UI states require conditional rendering logic
- Error handling covers: missing zipcode, API failures, no data scenarios
- Component is self-contained and can be imported/used in app/page.tsx
- No prop dependencies - all data fetched internally
- Spinner component may need to be created or imported from existing UI library

### Dependencies
- React (useState, useEffect hooks)
- react-hot-toast (toast notifications)
- Next.js (client component pattern)
- Browser localStorage API
- Fetch API for HTTP requests
- Existing /api/weather endpoint

### File Structure
- New file: `/weather-app/apps/web/app/CurrentTemperatureDisplay.tsx` (or similar)
- Modify: `/weather-app/apps/web/app/page.tsx` (to import and render component)
