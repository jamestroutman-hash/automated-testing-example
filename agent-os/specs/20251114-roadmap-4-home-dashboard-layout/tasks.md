# Task Breakdown: Home Dashboard Layout

## Overview
Total Tasks: 14 core tasks organized into 3 main task groups
Feature Type: Frontend UI Layout Implementation
Tech Stack: Next.js App Router, TypeScript, CSS Modules, React Testing Library

## Task List

### Frontend: Page Structure & Layout

#### Task Group 1: Home Page Component & Basic Structure
**Dependencies:** None

- [x] 1.0 Complete home page component structure
  - [x] 1.1 Write 2-8 focused tests for home page structure
    - Test home page renders without errors
    - Test page displays "Veritas Weather" h1 title
    - Test page displays correct metadata (title and description)
    - Test three dashboard sections are present with semantic class names
    - Test sections have appropriate semantic structure (section elements or divs with role)
    - Limit to 5-6 highly focused tests maximum
    - Skip exhaustive coverage of styling details and responsive behavior
    - File location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/home-page.test.tsx`
  - [x] 1.2 Replace existing placeholder page.tsx with new dashboard structure
    - File location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/page.tsx`
    - Remove existing Turborepo placeholder content (ThemeImage, Button, footer)
    - Follow component structure pattern from `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/page.tsx` and `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/profile/page.tsx`
    - Use Next.js Metadata export for page title: "Veritas Weather - Home Dashboard"
    - Use page description: "View current weather, historical data, and forecasts"
    - Structure: `div.page` > `main.main` > `h1.title` + three section containers
  - [x] 1.3 Create main container with page-level grid layout
    - Use CSS Grid with `grid-template-rows: 20px 1fr 20px` pattern
    - Set `grid-row-start: 2` for main content positioning
    - Set `min-height: 100svh` for full viewport height
    - Apply consistent padding: 2rem (desktop default)
    - Set `align-items: center` and `justify-items: center`
  - [x] 1.4 Add h1 page title "Veritas Weather"
    - Use semantic h1 element with appropriate className for styling
    - Position at top of main content area
    - Center-aligned text
    - Apply title styling class (defined in CSS module)
  - [x] 1.5 Create three empty structural section containers
    - Section 1: Current temperature section (empty container)
    - Section 2: 7-day historical section (empty container)
    - Section 3: 7-day forecast section (empty container)
    - Use semantic classNames: `.currentTempSection`, `.historicalSection`, `.forecastSection`
    - Stack vertically within main content area using flexbox
    - Apply consistent `.section` base styling class to each
  - [x] 1.6 Ensure home page structure tests pass
    - Run ONLY the 5-6 tests written in 1.1
    - Verify page renders correctly with title and three sections
    - Do NOT run the entire test suite at this stage
    - Command: `cd /home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web && npm test -- app/__tests__/home-page.test.tsx`

**Acceptance Criteria:**
- The 5-6 tests written in 1.1 pass
- Page displays "Veritas Weather" as h1 title
- Three distinct section containers are present and identifiable
- Component follows admin/profile page structure pattern
- TypeScript types are properly defined
- Metadata exports correct title and description

### Frontend: CSS Module Styling

#### Task Group 2: CSS Module & Visual Styling
**Dependencies:** Task Group 1

- [x] 2.0 Complete CSS module styling for home page
  - [x] 2.1 Write 2-8 focused tests for visual styling
    - Test sections have visual distinction (border or background styling applied)
    - Test main content area has correct max-width constraint (600px)
    - Test sections are vertically stacked (flex column layout)
    - Test page has appropriate spacing between sections
    - Limit to 4-5 highly focused tests maximum
    - Skip testing every CSS property and responsive breakpoint
    - Add tests to existing file: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/home-page.test.tsx`
  - [x] 2.2 Create home.module.css or page.module.css file
    - File location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/home.module.css` OR `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/page.module.css`
    - Choose naming convention based on project preference (match existing pattern if one exists)
    - Follow structure pattern from `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/admin.module.css`
    - Use CSS Modules methodology for scoped styling
  - [x] 2.3 Define .page class with CSS Grid layout
    - Copy CSS Grid pattern from admin.module.css: `grid-template-rows: 20px 1fr 20px`
    - Set CSS custom properties for colors (--gray-rgb, --gray-alpha-200, --gray-alpha-100, --button-primary-hover, --button-secondary-hover)
    - Apply `min-height: 100svh`, `padding: 2rem`, `gap: 64px`
    - Set `display: grid`, `align-items: center`, `justify-items: center`
    - Add `font-synthesis: none` for better font rendering
  - [x] 2.4 Define .main class with flexbox column layout
    - Set `display: flex`, `flex-direction: column`
    - Apply `max-width: 600px` to match admin/profile pages
    - Set `gap: 1.5rem` for consistent spacing between child elements
    - Apply `grid-row-start: 2` for grid positioning
    - Set `width: 100%` for responsive behavior
  - [x] 2.5 Define .title class for page heading
    - Use `font-family: var(--font-geist-sans)` (matches existing pages)
    - Set `font-size: 2rem`, `line-height: 1.2`, `font-weight: 600`
    - Apply `text-align: center`, `margin: 0`
    - Follow typography pattern from admin/profile pages
  - [x] 2.6 Define .section class for dashboard section containers
    - Apply `border: 1px solid var(--gray-alpha-200)` for visual distinction
    - Set `border-radius: 8px` to match existing design system
    - Apply `padding: 1.5rem` for internal spacing
    - Set `background: var(--background)` for consistent theming
    - Add `min-height: 120px` to ensure sections have visual presence even when empty
    - Use `width: 100%` for full-width sections within container
  - [x] 2.7 Add dark mode support using prefers-color-scheme
    - Copy dark mode media query pattern from admin.module.css
    - Update CSS custom properties for dark mode (--gray-rgb: 255, 255, 255)
    - Adjust --gray-alpha values for dark theme readability
    - Ensure sections remain visually distinct in dark mode
    - Follow existing dark mode color scheme from globals.css
  - [x] 2.8 Ensure CSS styling tests pass
    - Run ONLY the 4-5 styling tests added in 2.1
    - Verify sections have visual styling applied
    - Verify layout constraints (max-width, flexbox column)
    - Do NOT run the entire test suite at this stage
    - Command: `cd /home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web && npm test -- app/__tests__/home-page.test.tsx`

**Acceptance Criteria:**
- The 4-5 styling tests written in 2.1 pass
- CSS module follows existing project patterns
- Visual consistency with admin and profile pages maintained
- Sections are visually distinguishable with borders or backgrounds
- Dark mode support implemented correctly
- Typography uses Geist Sans font family
- All CSS custom properties properly defined

### Frontend: Responsive Design

#### Task Group 3: Responsive Breakpoints & Mobile Optimization
**Dependencies:** Task Group 2

- [x] 3.0 Complete responsive design implementation
  - [x] 3.1 Write 2-8 focused tests for responsive behavior
    - Test mobile viewport rendering (title is visible, sections stack vertically)
    - Test touch-friendly targets where applicable (minimum 44px)
    - Test layout maintains single-column structure at all breakpoints
    - Limit to 3-4 highly focused tests maximum
    - Skip testing every breakpoint and CSS media query
    - Use viewport simulation for key breakpoints only (mobile 375px, desktop 1024px)
    - Add tests to existing file: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/home-page.test.tsx`
  - [x] 3.2 Implement mobile breakpoint styles (max-width: 768px)
    - Reduce padding: `1rem` (from 2rem)
    - Reduce gap: `32px` (from 64px)
    - Adjust title font-size: `1.5rem` (from 2rem)
    - Adjust main gap: `1rem` (from 1.5rem)
    - Reduce section padding: `1rem` (from 1.5rem)
    - Follow responsive pattern from admin.module.css
  - [x] 3.3 Implement tablet breakpoint styles (768px - 1024px)
    - Set padding: `1.5rem`
    - Maintain single-column layout (no grid changes)
    - Adjust spacing to provide comfortable reading experience
    - Keep max-width: 600px constraint on main content
  - [x] 3.4 Implement desktop breakpoint styles (1024px+)
    - Set padding: `2rem` (default)
    - Maintain single-column centered layout
    - Max-width: 600px constraint remains
    - Ensure adequate whitespace around content
  - [x] 3.5 Verify single-column layout at all breakpoints
    - Confirm no multi-column grid layout at any screen size
    - All three sections stack vertically on mobile, tablet, and desktop
    - Main content area maintains max-width: 600px and is centered
    - Test at key breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)
  - [x] 3.6 Ensure responsive design tests pass
    - Run ONLY the 3-4 responsive tests added in 3.1
    - Verify mobile viewport renders correctly
    - Verify single-column layout maintained across breakpoints
    - Do NOT run the entire test suite at this stage
    - Command: `cd /home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web && npm test -- app/__tests__/home-page.test.tsx`

**Acceptance Criteria:**
- The 3-4 responsive tests written in 3.1 pass
- Mobile breakpoint (max-width 768px) styles applied correctly
- Tablet breakpoint (768px-1024px) styles applied correctly
- Desktop breakpoint (1024px+) styles applied correctly
- Single-column layout maintained at all screen sizes
- Touch-friendly design on mobile (44px minimum tap targets where applicable)
- Consistent with responsive patterns from admin/profile pages
- No horizontal scrolling on any screen size

### Testing & Quality Assurance

#### Task Group 4: Test Review & Integration Testing
**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review all home page tests written in previous task groups
    - Review the 5-6 structure tests from Task 1.1
    - Review the 4-5 styling tests from Task 2.1
    - Review the 3-4 responsive tests from Task 3.1
    - Total existing tests: approximately 12-15 tests
    - Verify all tests are focused and avoid duplication
  - [x] 4.2 Analyze test coverage gaps for home dashboard layout feature
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this home page layout feature
    - Do NOT assess entire application test coverage
    - Prioritize integration testing over additional unit tests
    - Key areas to consider:
      - Navigation integration (clicking "Home" link navigates to home page)
      - Metadata rendering (verify Next.js metadata appears in document head)
      - CSS module class application (verify styles are applied correctly)
      - Accessibility basics (semantic HTML, heading hierarchy)
  - [x] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Suggested tests (only add if gaps exist):
      - Navigation to home page from other pages works correctly
      - Page metadata is correctly set in document head
      - CSS classes are applied to elements as expected
      - Sections maintain semantic structure for screen readers
      - Page layout doesn't break with empty sections
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases and performance tests unless business-critical
    - File location: `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/home-page.test.tsx` or `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/home-integration.test.tsx`
  - [x] 4.4 Run feature-specific tests only
    - Run ONLY tests related to home dashboard layout feature
    - Command: `cd /home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web && npm test -- app/__tests__/home-page.test.tsx`
    - If integration tests were created: `cd /home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web && npm test -- app/__tests__/home-integration.test.tsx`
    - Expected total: approximately 12-25 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass
  - [x] 4.5 Verify home page in browser manually
    - Start dev server: `cd /home/jamestroutman/code/experiments/automated-testing-example/weather-app && npm run dev`
    - Navigate to home page (localhost:3000 or appropriate port)
    - Verify "Veritas Weather" title displays correctly
    - Verify three sections are visible and visually distinct
    - Test responsive behavior at different viewport widths
    - Verify dark mode works correctly
    - Verify navigation between Home, Profile, and Admin pages works

**Acceptance Criteria:**
- All home dashboard layout tests pass (approximately 12-25 tests total)
- Critical user workflows for home page are covered
- No more than 10 additional tests added when filling in gaps
- Testing focused exclusively on home dashboard layout feature
- Home page renders correctly in browser
- Navigation to/from home page works correctly
- Responsive design functions properly across breakpoints
- Dark mode support works as expected

## Execution Order

Recommended implementation sequence:
1. **Task Group 1: Home Page Component & Basic Structure** (Foundation)
   - Create basic component structure and tests first
   - Establishes the HTML/JSX foundation
   - Dependencies: None

2. **Task Group 2: CSS Module & Visual Styling** (Visual Design)
   - Add visual design and styling
   - Makes sections visually distinct
   - Dependencies: Task Group 1

3. **Task Group 3: Responsive Breakpoints & Mobile Optimization** (Responsive Enhancement)
   - Implement responsive design for all screen sizes
   - Ensures mobile-friendly experience
   - Dependencies: Task Group 2

4. **Task Group 4: Test Review & Integration Testing** (Quality Assurance)
   - Fill gaps and verify end-to-end functionality
   - Ensures feature works correctly in full application context
   - Dependencies: Task Groups 1-3

## Technical Notes

### Key Files & Locations
- **Home Page Component:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/page.tsx`
- **CSS Module:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/home.module.css` OR `page.module.css`
- **Tests:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/home-page.test.tsx`
- **Integration Tests (if needed):** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/__tests__/home-integration.test.tsx`

### Reference Files
- **Admin Page Structure:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/page.tsx`
- **Admin CSS Pattern:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/admin/admin.module.css`
- **Profile Page Structure:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/profile/page.tsx`
- **Profile CSS Pattern:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/profile/profile.module.css`
- **Global Styles:** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/globals.css`
- **Root Layout (Navigation):** `/home/jamestroutman/code/experiments/automated-testing-example/weather-app/apps/web/app/layout.tsx`

### Design System Constants
- **Max Width:** 600px (centered container)
- **Font Family:** var(--font-geist-sans)
- **Border Radius:** 8px
- **Spacing Scale:** 1rem, 1.5rem, 2rem
- **Breakpoints:**
  - Mobile: max-width 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- **Touch Targets:** min-height 44px

### CSS Custom Properties to Use
- `--foreground` (text color)
- `--background` (background color)
- `--gray-alpha-200` (borders, subtle backgrounds)
- `--gray-alpha-100` (very subtle backgrounds)
- `--button-primary-hover` (hover states)
- `--font-geist-sans` (typography)

### Testing Approach
- **Test Framework:** Jest with React Testing Library
- **Test Environment:** jsdom
- **Test Location Pattern:** `app/__tests__/**/*.test.tsx`
- **Focus:** Write 2-8 tests per task group, fill gaps strategically (max 10 additional)
- **Total Expected Tests:** Approximately 12-25 tests for entire feature
- **Run Command:** `npm test -- app/__tests__/home-page.test.tsx`

### Out of Scope (Do Not Implement)
- Actual weather data content within sections
- API integration or data fetching
- Charts, graphs, or weather visualizations
- Loading states, skeleton screens, or spinners
- Error handling or error state displays
- User interactions (buttons, forms) within sections
- Section expand/collapse functionality
- Data refresh or polling mechanisms
- Multi-column grid layouts
- Navigation implementation (already exists in root layout)

## Definition of Done

The Home Dashboard Layout feature is complete when:

1. Home page component exists at `/weather-app/apps/web/app/page.tsx`
2. CSS module exists with complete styling for all breakpoints
3. Page displays "Veritas Weather" as h1 title
4. Three empty section containers are present and visually distinct
5. Single-column centered layout (600px max-width) is maintained at all screen sizes
6. Responsive design works correctly on mobile, tablet, and desktop
7. Dark mode support is implemented and functional
8. Approximately 12-25 tests pass covering structure, styling, responsive behavior, and integration
9. Manual browser testing confirms correct rendering and behavior
10. Navigation to/from home page works correctly
11. Code follows existing patterns from admin and profile pages
12. No TypeScript errors or warnings
13. Consistent with design system and CSS custom properties
