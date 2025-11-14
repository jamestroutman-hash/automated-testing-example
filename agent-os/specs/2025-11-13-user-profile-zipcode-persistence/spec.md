# Specification: User Profile & Zipcode Persistence

## Goal
Create a user profile page where users can save their preferred zipcode to localStorage for persistent weather preferences across browser sessions. The zipcode will be validated for format (5 digits) and used by the home dashboard to display personalized weather data.

## User Stories
- As a weather app user, I want to save my preferred zipcode to my profile so that I don't have to enter it repeatedly
- As a user, I want clear validation feedback when entering an invalid zipcode format so that I can correct my input immediately

## Specific Requirements

**Create Profile Page Route**
- Add new route at `/app/profile/page.tsx` following Next.js App Router conventions
- Include metadata with title "User Profile - Weather App" and description "Manage your weather preferences"
- Follow page structure pattern from admin panel with title, description, and form container
- Use CSS modules with `profile.module.css` for styling consistency
- Render as server component with client component form for interactivity

**Zipcode Input Form Component**
- Create client component `ProfileForm.tsx` using "use client" directive
- Single text input field labeled "Zipcode" with type="text" and maxLength={5}
- Use controlled component pattern with React useState for form data
- Display current saved zipcode value on component mount by reading from localStorage
- Show empty state placeholder text "No zipcode saved yet" when localStorage is empty
- Implement real-time validation on blur event using existing `validateZipcode` function
- Save button labeled "Save Zipcode" that writes to localStorage on click

**LocalStorage Integration**
- Storage key: `userZipcode` for consistency
- Read from localStorage in useEffect on component mount
- Write to localStorage on successful form submission
- Handle localStorage access safely with try-catch for SSR compatibility
- Data format: plain string value (5-digit zipcode)
- No backend API calls - purely client-side persistence

**Validation Logic**
- Reuse existing `validateZipcode` function from `/lib/validation.ts`
- Trigger validation on input blur event
- Display validation errors using same error display pattern as admin form
- Prevent save when validation errors exist
- Clear validation errors when input is corrected
- Format check only: exactly 5 numeric digits, no real zipcode verification

**Success and Error Messaging**
- Use react-hot-toast library (already installed)
- Include ToastProvider component in profile page
- Success message: "Zipcode saved successfully!" on successful save
- Error message: Display validation error text from validateZipcode function
- Toast duration: 4000ms matching admin panel configuration
- Position: top-center for consistency

**Navigation Links**
- Add "Profile" link to main navigation in `/app/layout.tsx`
- Position between existing "Home" and "Admin Panel" links
- Use Next.js Link component with href="/profile"
- Apply existing `.navLink` CSS class for consistent styling
- Ensure keyboard navigation and focus indicators work properly

**Form Styling and Layout**
- Replicate admin panel form styling from `admin.module.css`
- Use CSS module variables for colors, spacing, and responsive breakpoints
- Form field with label, input, and error display area
- Button styling matching submit button from admin panel
- Responsive design: mobile (320-768px), tablet (768-1024px), desktop (1024px+)
- Dark mode support using CSS prefers-color-scheme media query

**Empty State Handling**
- On first visit, input should be empty with placeholder
- Show helper text: "Enter your 5-digit US zipcode"
- No error state displayed initially
- Form should render cleanly without saved data

**Integration with Home Dashboard**
- Home dashboard will independently read from localStorage using same key
- No automatic refresh or event communication needed
- User navigates back to home after saving to see updated weather
- Separation of concerns: profile page only manages storage, dashboard consumes it

**Accessibility Requirements**
- Semantic HTML with proper label-input associations
- ARIA role="alert" for validation error display
- Keyboard navigation support for all interactive elements
- Visible focus indicators matching existing nav focus styles
- Minimum 44px touch targets for mobile usability
- Screen reader friendly error messages

## Visual Design

No visual mockups provided. Follow existing admin panel patterns from `/app/admin/page.tsx` and `admin.module.css`.

**Layout Pattern**
- Centered page container with max-width 600px
- Title (h1) and description (p) at top
- Form below with proper spacing
- Same grid layout structure as admin page

**Form Styling**
- Input field with border, border-radius 8px, padding matching admin inputs
- Label above input with font-weight 500
- Error display box with red background tint and border
- Save button with full-width option, primary button styling
- Consistent spacing: 1.5rem gaps between form elements

**Color Scheme**
- Use CSS custom properties: --foreground, --background, --gray-alpha-200
- Error colors: #dc2626 (light mode), #ef4444 (dark mode)
- Button hover states using --button-primary-hover variable
- Maintain consistency with existing application design tokens

**Typography**
- Font family: var(--font-geist-sans) for all text
- Title: 2rem, font-weight 600
- Description: 1rem, opacity 0.8
- Label: 0.875rem, font-weight 500
- Input: 1rem base font size

**Responsive Behavior**
- Mobile: Reduced padding, smaller title font, tighter spacing
- Tablet: Medium padding and spacing
- Desktop: Full padding and spacing per desktop breakpoints
- Touch-friendly 44px minimum height for inputs and buttons

## Existing Code to Leverage

**Admin Panel Form Structure - `/app/admin/page.tsx` and `WeatherForm.tsx`**
- Page layout pattern with title, description, form, and ToastProvider
- Controlled form component pattern with useState for form data
- Validation error state management with ValidationErrors interface
- Error display component at top of form with role="alert"
- Submit button disabled state logic when validation errors exist

**Validation Library - `/lib/validation.ts`**
- Use existing `validateZipcode` function directly
- Returns ValidationError type with field and message properties
- Already implements 5-digit numeric format check with clear error messages
- Consistent error format for easy integration with form error display

**Toast Notifications - `ToastProvider.tsx` and react-hot-toast**
- Reuse ToastProvider component configuration
- Import toast from react-hot-toast for success/error notifications
- Consistent styling and duration matching admin panel patterns

**CSS Module Patterns - `admin.module.css`**
- Replicate form field, label, input, and button styles
- Copy error display styling with red background and border
- Use same responsive breakpoint patterns and media queries
- Maintain dark mode support with prefers-color-scheme

**Navigation Styling - `globals.css` and `layout.tsx`**
- Add Link component to existing nav structure in layout
- Use navLink class already defined in globals.css
- Maintains focus indicators and accessibility patterns

## Out of Scope
- Multiple user profiles or user accounts - single profile per browser only
- Authentication or user login system - this is a demo app
- Zipcode history or previous entries tracking
- Autocomplete or zipcode suggestions from external API
- Real zipcode verification against database or postal service
- Additional profile fields (name, email, preferences)
- Temperature unit preferences (Fahrenheit/Celsius toggle)
- Backend API endpoint for zipcode storage - client-side only
- Server-side storage or database persistence
- Automatic dashboard refresh when zipcode is saved
- Weather forecast preview on profile page
- Zipcode search by city name
- Multiple favorite locations
- Geolocation-based zipcode detection
- Export/import profile settings
