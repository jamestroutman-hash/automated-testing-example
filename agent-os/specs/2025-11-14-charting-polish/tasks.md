# Task Breakdown: Chart Y-Axis Scaling and Title Polish

## Overview
Total Tasks: 14 organized into 3 task groups
Focus: Frontend component polish for temperature chart display

## Task List

### Frontend Components: Historical Data Display

#### Task Group 1: Historical Chart Title and Styling
**Dependencies:** None

- [x] 1.0 Add title and styling to HistoricalDataDisplay component
  - [x] 1.1 Write 2-8 focused tests for title rendering
    - Limit to 2-8 highly focused tests maximum
    - Test only critical behaviors (e.g., title renders when data present, title absent during loading, title absent when no data)
    - Skip exhaustive coverage of all rendering states
  - [x] 1.2 Add heading element to HistoricalDataDisplay.tsx
    - Insert `<h2 className={styles.heading}>Past 7 Days</h2>` after container div (line 135)
    - Place before chartContainer div to match ForecastDataDisplay structure
    - Ensure heading only renders when temperatureData.length > 0 (same conditional as chart)
  - [x] 1.3 Copy heading styles to HistoricalDataDisplay.module.css
    - Copy `.heading` class from ForecastDataDisplay.module.css (lines 13-20)
    - Include all responsive breakpoint styles (mobile, tablet, desktop)
    - Verify styles use CSS variables: var(--font-geist-sans), var(--foreground)
  - [x] 1.4 Ensure title rendering tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify title displays correctly with data
    - Verify title hidden during loading and no-data states
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Title "Past 7 Days" displays above historical chart
- Title styling matches ForecastDataDisplay heading
- Title appears only when chart data is present

### Frontend Components: Y-Axis Domain Calculation

#### Task Group 2: Implement Y-Axis Scaling Logic
**Dependencies:** None (can run in parallel with Task Group 1)

- [x] 2.0 Create Y-axis domain calculation with padding and minimum range
  - [x] 2.1 Write 2-8 focused tests for domain calculation
    - Limit to 2-8 highly focused tests maximum
    - Test only critical scenarios (e.g., normal range with padding, minimum range enforcement, single data point)
    - Skip exhaustive edge case testing (defer to Task Group 3 if needed)
  - [x] 2.2 Implement domain calculation helper function in HistoricalDataDisplay.tsx
    - Create `calculateYAxisDomain(data: TemperatureDataPoint[]): [number, number]` function
    - Filter out null temperature values
    - Find min and max from valid temperatures
    - Calculate natural range (max - min)
    - If range < 20 degrees, center within 20-degree range: center = (min + max) / 2, min = center - 10, max = center + 10
    - Add 5-degree padding: domainMin = min - 5, domainMax = max + 5
    - Return [domainMin, domainMax]
  - [x] 2.3 Handle edge case: single data point or no variation
    - If only one temperature or all identical: treat as zero range
    - Center 20-degree range on value, then add 5-degree padding
    - Example: 65 degrees becomes [50, 80] (20-degree range + 5-degree padding each side)
  - [x] 2.4 Integrate domain calculation into HistoricalDataDisplay render
    - Calculate domain before return statement (around line 133)
    - Store in variable: `const yAxisDomain = calculateYAxisDomain(temperatureData);`
    - Replace YAxis `domain={['auto', 'auto']}` with `domain={yAxisDomain}` (line 145)
  - [x] 2.5 Implement domain calculation helper function in ForecastDataDisplay.tsx
    - Create identical `calculateYAxisDomain(data: TemperatureDataPoint[]): [number, number]` function
    - Apply same logic as HistoricalDataDisplay for consistency
    - Handle same edge cases (single point, no variation)
  - [x] 2.6 Integrate domain calculation into ForecastDataDisplay render
    - Calculate domain before return statement (around line 133)
    - Store in variable: `const yAxisDomain = calculateYAxisDomain(temperatureData);`
    - Replace YAxis `domain={['auto', 'auto']}` with `domain={yAxisDomain}` (line 146)
  - [x] 2.7 Ensure Y-axis domain calculation tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify padding applied correctly
    - Verify minimum range enforcement works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Y-axis shows 5-degree padding above max and below min temperatures
- Y-axis enforces 20-degree minimum range when data span is smaller
- Logic applied identically to both HistoricalDataDisplay and ForecastDataDisplay
- Edge cases handled (single point, no variation)

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [x] 3.0 Review existing tests and fill critical gaps only
  - [x] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests written for title rendering (Task 1.1)
    - Review the 2-8 tests written for domain calculation (Task 2.1)
    - Total existing tests: approximately 4-16 tests
  - [x] 3.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to chart scaling and title display
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end chart rendering over unit test gaps
  - [x] 3.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Consider scenarios like: varying temperature ranges, responsive rendering, chart rendering with calculated domains
    - Do NOT write comprehensive coverage for all scenarios
    - Skip performance tests and accessibility tests unless business-critical
  - [x] 3.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass (title displays, Y-axis scales correctly)

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 14-26 tests total)
- Critical user workflows for chart display are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's feature requirements

## Execution Order

Recommended implementation sequence:
1. Task Group 1 and Task Group 2 can be executed in parallel (independent work)
   - Task Group 1: Historical chart title and styling
   - Task Group 2: Y-axis domain calculation for both components
2. Task Group 3: Test review and gap analysis (depends on completion of Groups 1-2)

## Implementation Notes

**Files to Modify:**
- `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.tsx`
- `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/HistoricalDataDisplay.module.css`
- `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.tsx`
- `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/ForecastDataDisplay.module.css`

**Key Patterns to Follow:**
- Title implementation: Copy exact pattern from ForecastDataDisplay.tsx line 136
- CSS styling: Replicate `.heading` styles from ForecastDataDisplay.module.css
- Component structure: Maintain existing patterns for loading, error, and data display states
- Responsive design: Follow existing media query patterns

**Domain Calculation Algorithm Reference:**
```typescript
// Pseudocode for domain calculation
function calculateYAxisDomain(data: TemperatureDataPoint[]): [number, number] {
  // Filter out null temperatures
  const validTemps = data.filter(d => d.temperature !== null).map(d => d.temperature!);

  // Find min and max
  let min = Math.min(...validTemps);
  let max = Math.max(...validTemps);

  // Calculate range
  const range = max - min;

  // Enforce 20-degree minimum range (centered)
  if (range < 20) {
    const center = (min + max) / 2;
    min = center - 10;
    max = center + 10;
  }

  // Add 5-degree padding
  const domainMin = min - 5;
  const domainMax = max + 5;

  return [domainMin, domainMax];
}
```

**Edge Cases Handled:**
- Single data point: Treated as zero range, centered within 20-degree range + padding
- No variation (all same temperature): Treated as zero range, centered within 20-degree range + padding
- All null values: Components already handle with placeholder messages, no domain calculation needed

## Implementation Summary

**Completed Implementation:**

1. **Task Group 1: Historical Chart Title and Styling (5 tests)**
   - Created `/weather-app/apps/web/app/__tests__/historical-data-display-title.test.tsx` with 5 focused tests
   - Added `<h2 className={styles.heading}>Past 7 Days</h2>` to HistoricalDataDisplay.tsx
   - Added `.heading` styles to HistoricalDataDisplay.module.css with full responsive support
   - All 5 title rendering tests pass

2. **Task Group 2: Y-Axis Scaling Logic (8 tests)**
   - Created `/weather-app/apps/web/app/__tests__/y-axis-domain-calculation.test.tsx` with 8 focused tests
   - Implemented `calculateYAxisDomain()` function in both HistoricalDataDisplay.tsx and ForecastDataDisplay.tsx
   - Integrated domain calculation into both components' render methods
   - Replaced `domain={['auto', 'auto']}` with `domain={yAxisDomain}` in both components
   - Handles all edge cases: normal ranges, minimum range enforcement, single data points, no variation, null values
   - All 8 domain calculation tests pass

3. **Task Group 3: Test Review & Gap Analysis (8 additional tests)**
   - Created `/weather-app/apps/web/app/__tests__/charting-polish-integration.test.tsx` with 8 strategic integration tests
   - Tests cover: complete integration scenarios, consistency between components, edge cases (extreme/negative temperatures)
   - Total tests for feature: 21 tests (5 + 8 + 8)
   - All 21 tests pass successfully

**Test Files Created:**
- `__tests__/historical-data-display-title.test.tsx` (5 tests)
- `__tests__/y-axis-domain-calculation.test.tsx` (8 tests)
- `__tests__/charting-polish-integration.test.tsx` (8 tests)

**Total: 21 tests, all passing**
