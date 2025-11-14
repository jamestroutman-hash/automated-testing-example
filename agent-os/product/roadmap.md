# Product Roadmap

1. [x] In-Memory Data Store API — Create backend API endpoints (POST, GET) for storing and retrieving weather data by zipcode and date. Implement in-memory Map structure with validation. Include error responses for invalid data. `S`

2. [x] Admin Panel UI — Build admin page with form inputs for temperature, date, and zipcode. Connect to backend API for data submission. Display success/error messages after submission. Add basic client-side validation. `S`

3. [x] User Profile & Zipcode Persistence — Create user profile page with zipcode input and save functionality. Implement persistence using localStorage or session storage. Add zipcode format validation (5-digit US format). Build API endpoint for zipcode retrieval. `S`

4. [x] Home Dashboard Layout — Design and implement home page layout with three sections: current temperature, 7-day historical, and 7-day forecast. Create responsive grid structure. Add navigation between home, admin, and profile pages. `XS`

5. [x] Current Temperature Display — Fetch and display current day's temperature for user's configured zipcode. Handle cases where no data exists (show placeholder). Implement date calculation logic to determine "today". Connect frontend to data store API. `S`

6. [x] Historical Data Display (7-Day) — Fetch and display past 7 days of temperature data for user's zipcode. Calculate date range (today minus 7 days). Render data in table or card format with dates and temperatures. Handle partial data scenarios (some days missing). `M`

7. [x] Forecast Data Display (7-Day) — Fetch and display next 7 days of forecast temperatures for user's zipcode. Calculate future date range (today plus 7 days). Render forecast data with clear date labels. Ensure visual distinction between historical and forecast data. `M`

8. [x] Comprehensive Validation & Error Handling — Implement server-side validation for all inputs (temperature range, date format, zipcode format). Add user-friendly error messages throughout the application. Handle edge cases: missing zipcode, no data available, invalid dates. Create consistent error response structure across all API endpoints. `M`

> Notes
> - Order items by technical dependencies and product architecture
> - Each item should represent an end-to-end (frontend + backend) functional and testable feature
> - Features are ordered to build foundational data layer first, then admin tools for test data, followed by user-facing display features
> - Final validation phase ensures all testable edge cases are properly handled across the application
