# Specification: Home Dashboard Layout

## Goal
Replace the existing placeholder home page with a structured dashboard layout featuring three vertically stacked sections for current temperature, 7-day historical data, and 7-day forecast, maintaining consistency with the admin and profile page design patterns.

## User Stories
- As a weather app user, I want to see a clean, organized home page layout so that I can easily view weather information when sections are populated
- As a developer, I want a structural foundation for the dashboard so that future weather data components can be integrated into predefined sections

## Specific Requirements

**Page Structure and Layout**
- Replace existing placeholder page.tsx content with new dashboard layout structure
- Use centered single-column layout with max-width 600px matching admin and profile pages
- Implement CSS Grid for page-level layout with grid-template-rows: 20px 1fr 20px pattern
- Use Flexbox for main content area with flex-direction: column
- Maintain grid-row-start: 2 for main content positioning
- Create three empty structural sections as placeholders for future weather components

**Page Header and Metadata**
- Display "Veritas Weather" as the h1 page title at top of main content area
- Set page metadata title to "Veritas Weather - Home Dashboard"
- Set page metadata description to "View current weather, historical data, and forecasts"
- Navigation link already exists in root layout and is labeled "Home"

**Dashboard Sections Structure**
- Create three distinct section containers within main content area
- Section 1: Current Temperature (empty structural container)
- Section 2: 7-Day Historical (empty structural container)
- Section 3: 7-Day Forecast (empty structural container)
- Each section should have semantic className for future content integration
- Sections should be visually distinguishable with border, background, or spacing

**CSS Module Styling**
- Create home.module.css following the pattern from admin.module.css and profile.module.css
- Define .page class with CSS Grid layout, padding, gap, and min-height: 100svh
- Define .main class with flexbox column layout, gap: 1.5rem, max-width: 600px
- Define .title class with Geist Sans font, 2rem size, 600 weight, center alignment
- Define .section class for dashboard sections with consistent styling
- Use CSS custom properties from globals.css (--foreground, --background, --gray-alpha-200)
- Include dark mode support using @media (prefers-color-scheme: dark)

**Responsive Design Implementation**
- Mobile (max-width 768px): padding: 1rem, gap: 32px, title: 1.5rem, main gap: 1rem
- Tablet (768px-1024px): padding: 1.5rem
- Desktop (1024px+): padding: 2rem
- All breakpoints maintain single-column vertical stack layout
- Touch-friendly minimum tap target size of 44px where applicable

**Visual Consistency**
- Match color scheme and CSS custom properties from admin and profile pages
- Use same typography scale (Geist Sans font family)
- Apply consistent border-radius: 8px for section containers
- Use same spacing scale (1rem, 1.5rem gaps)
- Follow same padding patterns (0.75rem 1rem for elements)
- Maintain opacity: 0.8 for subtle text elements

**Code Organization**
- Create /weather-app/apps/web/app/page.tsx for home page component
- Create /weather-app/apps/web/app/home.module.css or page.module.css for styling
- Use TypeScript for type safety with Next.js Metadata type
- Follow Next.js App Router server component pattern
- Keep component structure simple and maintainable

## Visual Design

No visual assets provided. The layout should follow the established design patterns from admin and profile pages with these visual characteristics:
- Centered layout with clear visual hierarchy
- Three sections with equal visual weight stacked vertically
- Consistent spacing between sections (1.5rem gap)
- Clean, minimal aesthetic matching existing pages
- Sections should have subtle borders or background to define boundaries
- Dark mode support matching the application's existing theme

## Existing Code to Leverage

**admin.module.css and profile.module.css**
- Reuse the .page CSS Grid layout structure with grid-template-rows: 20px 1fr 20px
- Copy .main flexbox column pattern with max-width: 600px and gap: 1.5rem
- Reuse .title and .description typography styles
- Copy CSS custom properties for colors (--gray-alpha-200, --gray-alpha-100, --button-primary-hover)
- Adapt responsive breakpoints and media queries for mobile, tablet, desktop

**admin/page.tsx and profile/page.tsx component structure**
- Follow the same component structure pattern with div.page > main.main > h1.title
- Use Next.js Metadata export for page title and description
- Import and apply CSS module styles using styles object
- Follow TypeScript typing pattern for server components

**globals.css navigation and color system**
- Navigation already implemented in root layout.tsx with "Home" link
- Leverage existing CSS custom properties (--foreground, --background)
- Use established dark mode color scheme patterns
- Follow font-family pattern with var(--font-geist-sans)

**Root layout.tsx**
- Navigation structure already in place connecting Home, Profile, and Admin Panel
- Geist Sans font already configured via localFont and CSS variable
- Body styling with font variables already applied

**Responsive design patterns**
- Reuse the three-tier breakpoint system (mobile <768px, tablet 768-1024px, desktop 1024px+)
- Apply same padding reduction patterns on smaller screens
- Use min-height: 44px pattern for touch-friendly targets
- Follow font-size scaling on mobile (1.5rem for title instead of 2rem)

## Out of Scope
- Actual weather data content or placeholder text within the three sections
- API integration or data fetching for temperature, historical, or forecast data
- Charts, graphs, or weather visualizations
- Loading states, skeleton screens, or spinners
- Error handling or error state displays
- User interactions like buttons, forms, or clickable elements within sections
- Section expand/collapse functionality
- Data refresh or polling mechanisms
- User preferences or personalization features
- Multi-column grid layouts or alternative layout options
- Navigation implementation (already exists in root layout)
- Testing implementation (will be addressed after feature completion per testing standards)
