# Spec Requirements: Charting Polish

## Initial Description

Charting polish for the calendar view charts in @weather-app/apps/web/. The current scale is fixed at the edges (max at top, min at bottom). We need to:
- Add 5 degrees of padding top and bottom
- Set a minimum range (max to min of 20 degrees)
- Apply this to both historical and future graphs
- Add titles to both components

## Requirements Discussion

### First Round Questions

**Q1:** For the Y-axis padding implementation, should we add 5 degrees of padding above the max temperature and 5 degrees below the min temperature? For example, if the data ranges from 50-70 degrees F, the Y-axis would display 45-75 degrees F?

**Answer:** Yes - add 5 degrees padding (e.g., 50-70°F becomes 45-75°F)

**Q2:** When the temperature range in the data is less than 20 degrees (e.g., 60-65°F = 5 degrees), should the chart display a centered 20-degree range (e.g., 52.5-72.5°F) or should it extend the range in another way (like always extending from the minimum)?

**Answer:** Centered - when data spans 60-65°F (5 degrees), display as 52.5-72.5°F (centered within 20-degree range)

**Q3:** For the chart titles, what title should we use for the historical data chart? The ForecastDataDisplay already shows "7-Day Forecast" - should the historical chart be "7-Day Historical" or "Past 7 Days" or something else?

**Answer:** The user mentioned "if it has a title, the title is not rendered on the screen" - this needs investigation. The ForecastDataDisplay has a title, but apparently it's not displaying properly.

**Investigation Finding:** After reviewing the code:
- **ForecastDataDisplay.tsx** (lines 134-136) DOES have a title element: `<h2 className={styles.heading}>7-Day Forecast</h2>` with proper CSS styling defined in ForecastDataDisplay.module.css
- **HistoricalDataDisplay.tsx** (lines 133-136) does NOT have a title element - it goes directly to the chartContainer without any heading
- The HistoricalDataDisplay.module.css does NOT have any `.heading` styles defined

**Conclusion:** The HistoricalDataDisplay component is missing a title entirely. This is what the user was referring to.

**Q4:** Should both chart titles use the same styling (font size, weight, color, spacing)?

**Answer:** Same styles for both charts

**Q5:** How should we handle the edge case where there's only a single data point with a temperature? Should we still apply the 20-degree minimum range with 5-degree padding?

**Answer:** Same rules apply (20-degree minimum range with 5-degree padding)

**Q6:** What should happen if all data points have the exact same temperature (e.g., 65°F for all 7 days)? Should we display a 20-degree range centered on that value?

**Answer:** Same rules apply (20-degree range centered on the value)

**Q7:** Are these charts only on the homepage/calendar view, or are there other places in the app where these components appear that we need to consider?

**Answer:** Homepage is the only one with these charts

**Q8:** Is there anything explicitly out of scope for this task? For example, should we avoid changing chart colors, line styles, grid patterns, tooltips, or any other visual aspects beyond the Y-axis scaling and titles?

**Answer:** None - everything is in scope

### Existing Code to Reference

**Similar Features Identified:**
- The ForecastDataDisplay component already has proper title implementation that can serve as a reference for adding the title to HistoricalDataDisplay
- Both components share nearly identical structure and styling patterns
- File paths:
  - `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.tsx`
  - `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.module.css`
  - `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.tsx`
  - `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.module.css`

### Follow-up Questions

No follow-up questions needed. The investigation clarified the title issue, and all other requirements are well-defined.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements

**Y-Axis Scaling with Padding:**
- Add 5 degrees of padding above the maximum temperature in the dataset
- Add 5 degrees of padding below the minimum temperature in the dataset
- Example: Data ranging from 50-70°F should display Y-axis from 45-75°F

**Minimum Range Enforcement:**
- Enforce a minimum range of 20 degrees between Y-axis min and max
- When data spans less than 20 degrees, center the actual range within a 20-degree display range
- Example: Data ranging from 60-65°F (5-degree span) should display as 52.5-72.5°F
- Apply 5-degree padding after establishing the minimum range

**Edge Cases:**
- Single data point: Apply 20-degree minimum range centered on the value, then add 5-degree padding
- No variation (all same temperature): Apply 20-degree minimum range centered on the value, then add 5-degree padding

**Title Implementation:**
- ForecastDataDisplay already has title "7-Day Forecast" - maintain as-is
- HistoricalDataDisplay needs title added (currently missing)
- Suggested title for historical chart: "Past 7 Days" or "7-Day History" (to be determined during implementation)
- Both titles must use identical styling:
  - Font: var(--font-geist-sans)
  - Size: 1.5rem (desktop), 1.25rem (mobile)
  - Weight: 600
  - Color: var(--foreground)
  - Margin: 0 0 1rem 0
  - Text alignment: center

**Scope:**
- Apply changes to both ForecastDataDisplay and HistoricalDataDisplay components
- These components only appear on the homepage/calendar view
- All visual aspects are in scope (nothing is explicitly excluded)

### Reusability Opportunities

- ForecastDataDisplay.tsx already has the correct title implementation pattern (lines 136) that can be replicated for HistoricalDataDisplay
- ForecastDataDisplay.module.css has the `.heading` styles (lines 13-20) that need to be added to HistoricalDataDisplay.module.css
- Both components use Recharts library with nearly identical chart configurations
- Y-axis domain calculation logic will be new but should be implemented consistently across both components

### Scope Boundaries

**In Scope:**
- Y-axis scaling with 5-degree padding above and below data range
- Minimum 20-degree range enforcement with centered data
- Adding title to HistoricalDataDisplay component
- Ensuring consistent title styling across both chart components
- Handling edge cases (single data point, no variation)
- All visual improvements deemed necessary

**Out of Scope:**
- Nothing explicitly excluded by user
- Changes should be limited to the two chart components on the homepage

### Technical Considerations

**Integration Points:**
- Both components use Recharts library for chart rendering
- YAxis component currently uses `domain={['auto', 'auto']}` which needs to be replaced with calculated domain values
- Recharts domain accepts either fixed values or functions that calculate based on data

**Existing System Constraints:**
- Components are client-side React components ("use client" directive)
- Styling uses CSS modules (*.module.css files)
- Responsive design patterns already established across three breakpoints (mobile, tablet, desktop)
- Dark mode support via CSS media queries

**Technology Stack:**
- React with TypeScript
- Recharts library for data visualization
- CSS Modules for component styling
- Next.js framework (client components)

**Similar Code Patterns to Follow:**
- Title implementation: Follow ForecastDataDisplay pattern exactly
- CSS styling: Replicate `.heading` styles from ForecastDataDisplay.module.css to HistoricalDataDisplay.module.css
- Component structure: Maintain existing patterns for consistency
- Responsive design: Follow existing media query patterns in both CSS files
