import { DocsLayout } from "../components/DocsLayout";
import styles from "../docs.module.css";

export default function ArchitecturePage() {
  return (
    <DocsLayout>
      <div className={styles.content}>
        <h1>Architecture</h1>
        <p>
          Understanding the technical architecture and design decisions behind
          Veritas Weather helps you write better tests and evaluate candidates
          more effectively.
        </p>

        <h2>Technology Stack</h2>

        <h3>Framework & Runtime</h3>
        <ul>
          <li>
            <strong>Monorepo Manager:</strong> Turborepo - Manages multiple
            packages and applications
          </li>
          <li>
            <strong>Application Framework:</strong> Next.js 16 (App Router) -
            Modern React framework
          </li>
          <li>
            <strong>Language/Runtime:</strong> TypeScript / Node.js - Type-safe
            JavaScript
          </li>
          <li>
            <strong>Package Manager:</strong> npm - Standard Node.js package
            manager
          </li>
        </ul>

        <h3>Frontend</h3>
        <ul>
          <li>
            <strong>UI Library:</strong> React 19 - Component-based UI
          </li>
          <li>
            <strong>Styling:</strong> CSS Modules - Scoped, modular styling
          </li>
          <li>
            <strong>State Management:</strong> React useState/useEffect - Simple
            local state
          </li>
        </ul>

        <h3>Backend</h3>
        <ul>
          <li>
            <strong>API Routes:</strong> Next.js App Router route handlers -
            Serverless functions
          </li>
          <li>
            <strong>Data Format:</strong> JSON - Standard REST API format
          </li>
          <li>
            <strong>HTTP Client:</strong> Native fetch API - Modern promise-based
            HTTP
          </li>
        </ul>

        <h3>Storage</h3>
        <ul>
          <li>
            <strong>Server Data:</strong> In-memory JavaScript Map - Fast,
            ephemeral storage
          </li>
          <li>
            <strong>User Preferences:</strong> Browser localStorage - Client-side
            persistence
          </li>
        </ul>

        <h2>Application Architecture</h2>

        <h3>Monorepo Structure</h3>
        <p>
          The project uses Turborepo to manage a monorepo with shared packages:
        </p>
        <pre>
          <code>{`weather-app/
├── apps/
│   ├── web/          # Main application
│   └── docs/         # Documentation site
├── packages/
│   └── ui/           # Shared UI components
└── turbo.json        # Turborepo configuration`}</code>
        </pre>

        <h3>Next.js App Router Structure</h3>
        <p>The web application follows Next.js 13+ App Router conventions:</p>
        <pre>
          <code>{`apps/web/
├── app/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home dashboard
│   ├── globals.css               # Global styles
│   │
│   ├── admin/                    # Admin panel route
│   │   ├── page.tsx              # Admin UI
│   │   └── admin.module.css      # Scoped styles
│   │
│   ├── profile/                  # Profile route
│   │   ├── page.tsx              # Profile UI
│   │   └── profile.module.css    # Scoped styles
│   │
│   ├── api/                      # API routes
│   │   └── weather/
│   │       ├── route.ts          # GET & POST handlers
│   │       ├── dataStore.ts      # In-memory storage
│   │       ├── validation.ts     # Validation logic
│   │       ├── types.ts          # TypeScript types
│   │       └── __tests__/        # API tests
│   │
│   └── lib/                      # Shared utilities
│       └── validation.ts         # Shared validation
│
├── package.json
├── jest.config.cjs                # Jest configuration
└── jest.setup.js                  # Jest setup`}</code>
        </pre>

        <h2>Component Architecture</h2>

        <h3>Page Components</h3>
        <p>
          Each route has a dedicated page component that handles its specific
          functionality:
        </p>
        <ul>
          <li>
            <strong>Home (page.tsx):</strong> Orchestrates three display
            components
          </li>
          <li>
            <strong>Admin (admin/page.tsx):</strong> Form for data entry
          </li>
          <li>
            <strong>Profile (profile/page.tsx):</strong> Zipcode configuration
          </li>
        </ul>

        <h3>Display Components</h3>
        <p>
          The home page uses three specialized display components:
        </p>
        <ul>
          <li>
            <strong>CurrentTemperatureDisplay:</strong> Shows today's temperature
          </li>
          <li>
            <strong>HistoricalDataDisplay:</strong> Shows past 7 days
          </li>
          <li>
            <strong>ForecastDataDisplay:</strong> Shows next 7 days
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Design Pattern:</strong> Each component is self-contained
            with its own data fetching, state management, and error handling.
            This makes them independently testable.
          </p>
        </div>

        <h2>Data Flow</h2>

        <h3>Weather Data Flow</h3>
        <pre>
          <code>{`┌──────────────┐
│ Admin Panel  │ ─── POST /api/weather ───┐
└──────────────┘                          │
                                          ▼
                                   ┌──────────────┐
                                   │  In-Memory   │
                                   │  Data Store  │
                                   │  (Map)       │
                                   └──────────────┘
                                          │
                  GET /api/weather ◄──────┤
                          │               │
           ┌──────────────┴───────┬───────┴──────────┐
           ▼                      ▼                  ▼
  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
  │ Current Temp    │   │ Historical Data │   │ Forecast Data   │
  │ Display         │   │ Display         │   │ Display         │
  └─────────────────┘   └─────────────────┘   └─────────────────┘`}</code>
        </pre>

        <h3>User Preference Flow</h3>
        <pre>
          <code>{`┌──────────────┐
│ Profile Page │
└──────────────┘
       │
       │ Save zipcode
       ▼
┌────────────────┐
│  localStorage  │
└────────────────┘
       │
       │ Read zipcode
       ▼
┌────────────────┐
│ Display        │
│ Components     │
└────────────────┘`}</code>
        </pre>

        <h2>Data Storage Design</h2>

        <h3>In-Memory Weather Data Store</h3>
        <p>
          The weather data is stored in a JavaScript Map with a composite key:
        </p>
        <pre>
          <code>{`// dataStore.ts
const weatherStore = new Map<string, number>();

// Key format: "zipcode-date"
// Example: "12345-2025-11-14" → 72

function storeWeatherData(data: WeatherData) {
  const key = \`\${data.zipcode}-\${data.date}\`;
  weatherStore.set(key, data.temperature);
}

function getWeatherData(zipcode: string, date?: string) {
  if (date) {
    const key = \`\${zipcode}-\${date}\`;
    return weatherStore.get(key) ?? null;
  }

  // Return all dates for zipcode
  const result: Record<string, number> = {};
  for (const [key, temp] of weatherStore.entries()) {
    if (key.startsWith(\`\${zipcode}-\`)) {
      const date = key.split('-').slice(1).join('-');
      result[date] = temp;
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}`}</code>
        </pre>

        <h3>Design Benefits</h3>
        <ul>
          <li>
            <strong>Fast:</strong> O(1) lookups by composite key
          </li>
          <li>
            <strong>Simple:</strong> No database setup or configuration
          </li>
          <li>
            <strong>Ephemeral:</strong> Resets on server restart
          </li>
          <li>
            <strong>Testable:</strong> Easy to seed with known data
          </li>
        </ul>

        <h3>Browser localStorage</h3>
        <p>User preferences are stored in browser localStorage:</p>
        <pre>
          <code>{`// Save zipcode
localStorage.setItem('userZipcode', zipcode);

// Retrieve zipcode
const zipcode = localStorage.getItem('userZipcode');`}</code>
        </pre>

        <h2>Validation Architecture</h2>

        <h3>Validation Layers</h3>
        <p>The application implements validation at multiple layers:</p>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h4>1. Client-Side Validation</h4>
            <p>
              Immediate feedback in forms using the same validation functions as
              the server
            </p>
          </div>

          <div className={styles.card}>
            <h4>2. Server-Side Validation</h4>
            <p>
              Comprehensive validation in API routes prevents invalid data
              storage
            </p>
          </div>

          <div className={styles.card}>
            <h4>3. TypeScript Types</h4>
            <p>Compile-time type checking ensures data structure consistency</p>
          </div>
        </div>

        <h3>Shared Validation Module</h3>
        <p>
          Validation logic is centralized in <code>app/lib/validation.ts</code>{" "}
          and reused across:
        </p>
        <ul>
          <li>API routes (server-side)</li>
          <li>Client components (client-side)</li>
          <li>Test files (test assertions)</li>
        </ul>

        <pre>
          <code>{`// lib/validation.ts
export function validateZipcode(zipcode: string): ValidationError | null {
  if (!/^\\d{5}$/.test(zipcode)) {
    return {
      field: 'zipcode',
      message: 'Zipcode must be a 5-digit number',
    };
  }
  return null;
}

export function validateTemperature(temperature: number): ValidationError | null {
  if (typeof temperature !== 'number' || isNaN(temperature)) {
    return {
      field: 'temperature',
      message: 'Temperature must be a valid number',
    };
  }
  if (temperature < -150 || temperature > 150) {
    return {
      field: 'temperature',
      message: 'Temperature must be between -150 and 150°F',
    };
  }
  return null;
}

export function validateDate(date: string): ValidationError | null {
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
    return {
      field: 'date',
      message: 'Date must be in YYYY-MM-DD format',
    };
  }
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return {
      field: 'date',
      message: 'Date must be a valid date',
    };
  }
  return null;
}`}</code>
        </pre>

        <h2>API Design Principles</h2>

        <h3>REST-ful Conventions</h3>
        <ul>
          <li>
            <strong>POST:</strong> Create/update resources
          </li>
          <li>
            <strong>GET:</strong> Retrieve resources
          </li>
          <li>
            <strong>JSON:</strong> Standard data format
          </li>
          <li>
            <strong>HTTP Status Codes:</strong> Standard meanings (200, 201, 400,
            500)
          </li>
        </ul>

        <h3>Error Response Format</h3>
        <p>All errors follow a consistent structure:</p>
        <pre>
          <code>{`{
  "errors": {
    "field1": "Error message for field1",
    "field2": "Error message for field2"
  }
}`}</code>
        </pre>

        <p>Benefits:</p>
        <ul>
          <li>Easy to parse and display field-specific errors</li>
          <li>Consistent across all endpoints</li>
          <li>Supports multiple simultaneous errors</li>
        </ul>

        <h3>Upsert Behavior</h3>
        <p>The POST endpoint uses upsert semantics:</p>
        <ul>
          <li>If data exists for zipcode+date: update silently</li>
          <li>If data doesn't exist: create new entry</li>
          <li>Always returns 201 Created on success</li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Testing Consideration:</strong> Upsert behavior means you can
            safely re-run test data setup without getting errors for duplicate
            entries.
          </p>
        </div>

        <h2>Testing Architecture</h2>

        <h3>Test Organization</h3>
        <pre>
          <code>{`apps/web/
├── app/
│   ├── __tests__/                    # Page component tests
│   │   ├── admin.test.tsx
│   │   ├── profile.test.tsx
│   │   └── home.test.tsx
│   │
│   └── api/weather/__tests__/        # API tests
│       ├── get.test.ts               # GET endpoint tests
│       ├── post.test.ts              # POST endpoint tests
│       ├── validation.test.ts        # Validation tests
│       ├── integration.test.ts       # Integration tests
│       └── api-error-handling.test.ts
│
├── jest.config.cjs                    # Jest configuration
└── jest.setup.js                      # Global test setup`}</code>
        </pre>

        <h3>Testing Layers</h3>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h4>Unit Tests</h4>
            <ul>
              <li>Validation functions</li>
              <li>Utility functions</li>
              <li>Data transformations</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h4>Integration Tests</h4>
            <ul>
              <li>API route handlers</li>
              <li>Data store operations</li>
              <li>Component + API interactions</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h4>Component Tests</h4>
            <ul>
              <li>React components</li>
              <li>User interactions</li>
              <li>UI state changes</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h4>E2E Tests</h4>
            <ul>
              <li>Complete user workflows</li>
              <li>Multi-page interactions</li>
              <li>Data persistence flows</li>
            </ul>
          </div>
        </div>

        <h2>Design Decisions & Rationale</h2>

        <h3>Why In-Memory Storage?</h3>
        <ul>
          <li>
            <strong>Assessment Focus:</strong> Removes database setup complexity
          </li>
          <li>
            <strong>Deterministic Tests:</strong> Predictable, fast test execution
          </li>
          <li>
            <strong>Easy Reset:</strong> Restart server for clean state
          </li>
          <li>
            <strong>No External Dependencies:</strong> Self-contained application
          </li>
        </ul>

        <h3>Why No Authentication?</h3>
        <ul>
          <li>
            <strong>Scope Reduction:</strong> Focus testing on core functionality
          </li>
          <li>
            <strong>Simplicity:</strong> Reduces boilerplate in tests
          </li>
          <li>
            <strong>Time Constraint:</strong> Candidates focus on testing, not
            auth
          </li>
        </ul>

        <h3>Why localStorage for Preferences?</h3>
        <ul>
          <li>
            <strong>Simple Persistence:</strong> Browser-native storage
          </li>
          <li>
            <strong>Easy Testing:</strong> Mock localStorage in tests
          </li>
          <li>
            <strong>Realistic Pattern:</strong> Common web development technique
          </li>
        </ul>

        <h3>Why CSS Modules?</h3>
        <ul>
          <li>
            <strong>Scoped Styles:</strong> No global style conflicts
          </li>
          <li>
            <strong>TypeScript Integration:</strong> Type-safe className
            references
          </li>
          <li>
            <strong>Testing:</strong> Easy to target elements by className
          </li>
        </ul>

        <h2>Performance Considerations</h2>

        <h3>In-Memory Store Performance</h3>
        <ul>
          <li>
            <strong>Lookups:</strong> O(1) - instant access by key
          </li>
          <li>
            <strong>Range Queries:</strong> O(n) - iterate all entries, filter by
            zipcode
          </li>
          <li>
            <strong>Memory:</strong> Grows with data, resets on server restart
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Note:</strong> For this assessment application, performance is
            not a concern. The data store is designed for simplicity and testability,
            not production-scale performance.
          </p>
        </div>

        <h2>Extensibility</h2>
        <p>
          While designed as an assessment tool, the architecture supports
          extensions:
        </p>
        <ul>
          <li>
            <strong>New API Endpoints:</strong> Add to{" "}
            <code>app/api/[resource]/route.ts</code>
          </li>
          <li>
            <strong>New Pages:</strong> Add directories under <code>app/</code>
          </li>
          <li>
            <strong>Shared Components:</strong> Create in{" "}
            <code>packages/ui/</code>
          </li>
          <li>
            <strong>Additional Validations:</strong> Extend{" "}
            <code>lib/validation.ts</code>
          </li>
        </ul>
      </div>
    </DocsLayout>
  );
}
