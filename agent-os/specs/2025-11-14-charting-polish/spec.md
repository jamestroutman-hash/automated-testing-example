# Specification: Chart Y-Axis Scaling and Title Polish

## Goal
Improve the visual presentation of temperature charts by implementing intelligent Y-axis scaling with padding and minimum range enforcement, and add a missing title to the historical data chart for consistency.

## User Stories
- As a user viewing temperature charts, I want appropriate padding on the Y-axis so that data points are not cramped at the edges of the chart
- As a user viewing charts with small temperature variations, I want a minimum Y-axis range so that minor fluctuations are visible and the chart is not overly zoomed in

## Specific Requirements

**Y-Axis Domain Calculation with Padding**
- Calculate the minimum and maximum temperature values from the dataset by filtering out null values
- Add 5 degrees of padding above the maximum temperature value
- Add 5 degrees of padding below the minimum temperature value
- Example: if data ranges from 50-70 degrees F, the Y-axis should display 45-75 degrees F
- Apply this calculation in both HistoricalDataDisplay and ForecastDataDisplay components
- Replace the current `domain={['auto', 'auto']}` prop on the YAxis component with calculated domain values

**Minimum Range Enforcement**
- Calculate the natural range of the data (max minus min)
- If the natural range is less than 20 degrees, enforce a minimum 20-degree display range
- Center the actual data range within the 20-degree minimum range
- Example: if data spans 60-65 degrees F (5-degree range), center it to show 52.5-72.5 degrees F
- Apply the 5-degree padding after establishing the minimum range
- Final calculation: if centered range is 52.5-72.5, add padding to get 47.5-77.5 degrees F

**Domain Calculation Algorithm**
- Filter temperature data to exclude null values
- Find min and max from valid temperature values
- Calculate natural range: `max - min`
- If range is less than 20 degrees, calculate centered range: center point = `(min + max) / 2`, then set `min = center - 10` and `max = center + 10`
- Apply padding: `domainMin = min - 5` and `domainMax = max + 5`
- Return domain as array: `[domainMin, domainMax]`

**Edge Case: Single Data Point**
- If only one temperature value exists, treat it as having zero range
- Center a 20-degree range on that single value
- Add 5-degree padding to result in a 30-degree total display range
- Example: single point at 65 degrees F results in domain of 50-80 degrees F

**Edge Case: No Variation**
- If all temperature values are identical, treat as having zero range
- Apply the same logic as single data point case
- Center a 20-degree range on the value and add padding

**Edge Case: All Null Values**
- When all temperature values are null, the components already show placeholder messages
- No domain calculation needed for these cases
- Existing behavior should remain unchanged

**Historical Chart Title Addition**
- Add an h2 heading element with text "Past 7 Days" above the chart in HistoricalDataDisplay
- Place the heading between the container div and chartContainer div
- Apply the className `{styles.heading}` to match ForecastDataDisplay structure
- Ensure heading is rendered only when chart data is being displayed, not during loading or error states

**Title CSS Styling for HistoricalDataDisplay**
- Add `.heading` class to HistoricalDataDisplay.module.css
- Match the exact styling from ForecastDataDisplay.module.css
- Desktop: font-size 1.5rem, font-weight 600, margin-bottom 1rem
- Mobile: font-size 1.25rem, margin-bottom 0.75rem
- Use var(--font-geist-sans) for font family
- Use var(--foreground) for text color
- Center-align text

**Consistent Behavior Across Both Components**
- Apply identical Y-axis domain calculation logic to both HistoricalDataDisplay and ForecastDataDisplay
- Both components should calculate domain independently based on their own temperature data
- Both components should handle the same edge cases in the same way
- Maintain existing responsive design patterns and dark mode support

## Visual Design
No visual mockups provided. Implementation should maintain existing visual style and only modify Y-axis scaling behavior and add the missing title.

## Existing Code to Leverage

**ForecastDataDisplay Title Implementation**
- ForecastDataDisplay.tsx line 136 contains the title element: `<h2 className={styles.heading}>7-Day Forecast</h2>`
- This pattern should be replicated in HistoricalDataDisplay.tsx at the same relative position
- The title is placed inside the container div but before the chartContainer div
- This ensures the title appears above the chart when data is being rendered

**ForecastDataDisplay CSS Heading Styles**
- ForecastDataDisplay.module.css lines 13-20 define the `.heading` class with desktop styles
- Lines 62-65 define mobile responsive adjustments for the heading
- Lines 78-81 define tablet responsive adjustments for the heading
- Lines 94-97 define desktop responsive adjustments for the heading
- Copy these exact styles to HistoricalDataDisplay.module.css to ensure visual consistency

**Recharts YAxis Domain Configuration**
- Both components use Recharts library with YAxis component at lines 144-147
- Current implementation: `domain={['auto', 'auto']}`
- Recharts domain prop accepts an array of two values: [min, max]
- Replace with calculated domain array based on temperature data
- Domain should be calculated before the return statement, stored in a variable, then passed to the domain prop

**Temperature Data Structure**
- Both components use TemperatureDataPoint interface with temperature property that can be number or null
- Temperature data is stored in state as `temperatureData` array
- Data fetching and state management patterns are already established
- Domain calculation should filter out null values using `.filter()` and `.map()` before finding min/max

**Shared Component Structure**
- Both components follow identical patterns for loading states, error handling, and conditional rendering
- Both use CSS modules for styling with responsive breakpoints
- Both support dark mode through CSS media queries
- Changes should maintain these established patterns

## Out of Scope
- Modifying chart colors beyond what already exists
- Changing line styles, stroke width, or dot sizes
- Altering grid patterns or grid styling
- Modifying tooltip behavior or appearance
- Changing X-axis formatting or behavior
- Adding new data points or modifying data fetching logic
- Changing responsive breakpoints or container sizing
- Modifying loading states or error message text
- Adding animations or transitions
- Changing the date formatting on X-axis labels
- Modifying the connectNulls behavior for line charts
