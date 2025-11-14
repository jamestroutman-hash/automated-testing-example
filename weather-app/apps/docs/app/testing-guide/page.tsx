import { DocsLayout } from "../components/DocsLayout";
import styles from "../docs.module.css";

export default function TestingGuidePage() {
  return (
    <DocsLayout>
      <div className={styles.content}>
        <h1>Testing Guide</h1>
        <p>
          This guide provides comprehensive information for candidates
          implementing automated tests for the Veritas Weather application. It
          covers testing strategies, recommended approaches, and examples.
        </p>

        <h2>Assessment Overview</h2>
        <p>
          As a candidate, you will be implementing automated tests to
          demonstrate your testing automation skills. This application is
          specifically designed to provide realistic testing scenarios without
          unnecessary complexity.
        </p>

        <h3>What You'll Be Evaluated On</h3>
        <ul>
          <li>
            <strong>Test Coverage:</strong> Comprehensive testing across
            multiple layers
          </li>
          <li>
            <strong>Test Quality:</strong> Well-structured, maintainable,
            readable tests
          </li>
          <li>
            <strong>Testing Strategy:</strong> Appropriate test types for
            different scenarios
          </li>
          <li>
            <strong>Edge Cases:</strong> Handling of boundary conditions and
            error scenarios
          </li>
          <li>
            <strong>Code Organization:</strong> Clear test structure and reusable
            patterns
          </li>
        </ul>

        <h2>Recommended Testing Stack</h2>
        <p>
          While you can choose your testing frameworks, the following are
          recommended and pre-configured:
        </p>

        <h3>Unit & Integration Testing</h3>
        <ul>
          <li>
            <strong>Jest:</strong> Test runner and assertion library (already
            configured)
          </li>
          <li>
            <strong>React Testing Library:</strong> Component testing (installed)
          </li>
        </ul>

        <h3>E2E Testing</h3>
        <ul>
          <li>
            <strong>Playwright:</strong> Modern E2E testing framework
            (recommended)
          </li>
          <li>
            <strong>Cypress:</strong> Alternative E2E framework (also supported)
          </li>
        </ul>

        <h3>API Testing</h3>
        <ul>
          <li>
            <strong>Supertest:</strong> HTTP assertions (optional)
          </li>
          <li>
            <strong>fetch API:</strong> Native HTTP client (already available)
          </li>
        </ul>

        <h2>Testing Layers</h2>

        <h3>1. Unit Tests</h3>
        <p>Test individual functions and modules in isolation.</p>

        <h4>What to Unit Test</h4>
        <ul>
          <li>Validation functions (temperature, date, zipcode)</li>
          <li>Date calculation utilities</li>
          <li>Data formatting functions</li>
          <li>Helper utilities</li>
        </ul>

        <h4>Example: Validation Function Tests</h4>
        <pre>
          <code>{`// lib/__tests__/validation.test.ts
import { validateZipcode, validateTemperature, validateDate } from '../validation';

describe('validateZipcode', () => {
  it('should return null for valid 5-digit zipcode', () => {
    expect(validateZipcode('12345')).toBeNull();
  });

  it('should return error for zipcode with less than 5 digits', () => {
    const result = validateZipcode('1234');
    expect(result).toEqual({
      field: 'zipcode',
      message: 'Zipcode must be a 5-digit number',
    });
  });

  it('should return error for zipcode with non-numeric characters', () => {
    const result = validateZipcode('abcde');
    expect(result).toEqual({
      field: 'zipcode',
      message: 'Zipcode must be a 5-digit number',
    });
  });

  it('should accept zipcode with leading zeros', () => {
    expect(validateZipcode('01234')).toBeNull();
  });
});

describe('validateTemperature', () => {
  it('should return null for valid temperature', () => {
    expect(validateTemperature(72)).toBeNull();
  });

  it('should return error for non-numeric temperature', () => {
    const result = validateTemperature(NaN);
    expect(result).toEqual({
      field: 'temperature',
      message: 'Temperature must be a valid number',
    });
  });

  it('should return error for temperature below minimum', () => {
    const result = validateTemperature(-200);
    expect(result).toEqual({
      field: 'temperature',
      message: 'Temperature must be between -150 and 150°F',
    });
  });

  it('should accept boundary temperatures', () => {
    expect(validateTemperature(-150)).toBeNull();
    expect(validateTemperature(150)).toBeNull();
  });
});`}</code>
        </pre>

        <h3>2. Integration Tests</h3>
        <p>
          Test how multiple components/modules work together, including API
          endpoints and data flow.
        </p>

        <h4>What to Integration Test</h4>
        <ul>
          <li>API endpoint request/response cycles</li>
          <li>Data store interactions</li>
          <li>Validation + storage pipeline</li>
          <li>Component + API interactions</li>
        </ul>

        <h4>Example: API Endpoint Tests</h4>
        <pre>
          <code>{`// app/api/weather/__tests__/integration.test.ts
describe('POST /api/weather', () => {
  it('should store and retrieve weather data', async () => {
    // POST data
    const postResponse = await fetch('http://localhost:3000/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temperature: 72,
        date: '2025-11-14',
        zipcode: '12345',
      }),
    });

    expect(postResponse.status).toBe(201);
    const postData = await postResponse.json();
    expect(postData.temperature).toBe(72);

    // GET data back
    const getResponse = await fetch(
      'http://localhost:3000/api/weather?zipcode=12345&date=2025-11-14'
    );
    expect(getResponse.status).toBe(200);
    const getData = await getResponse.json();
    expect(getData.temperature).toBe(72);
  });

  it('should return validation errors for invalid data', async () => {
    const response = await fetch('http://localhost:3000/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temperature: 'invalid',
        date: 'invalid-date',
        zipcode: '123',
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.errors).toBeDefined();
    expect(data.errors.temperature).toBeDefined();
    expect(data.errors.date).toBeDefined();
    expect(data.errors.zipcode).toBeDefined();
  });
});`}</code>
        </pre>

        <h3>3. Component Tests</h3>
        <p>Test React components in isolation with mocked dependencies.</p>

        <h4>What to Component Test</h4>
        <ul>
          <li>Component rendering with different props</li>
          <li>User interactions (clicks, form submissions)</li>
          <li>State changes and UI updates</li>
          <li>Error handling and loading states</li>
        </ul>

        <h4>Example: Component Test with React Testing Library</h4>
        <pre>
          <code>{`// app/__tests__/admin.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from '../admin/page';

// Mock fetch
global.fetch = jest.fn();

describe('Admin Panel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form inputs', () => {
    render(<AdminPage />);

    expect(screen.getByLabelText(/temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zipcode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should submit valid data successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        temperature: 72,
        date: '2025-11-14',
        zipcode: '12345',
      }),
    });

    render(<AdminPage />);

    fireEvent.change(screen.getByLabelText(/temperature/i), {
      target: { value: '72' },
    });
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2025-11-14' },
    });
    fireEvent.change(screen.getByLabelText(/zipcode/i), {
      target: { value: '12345' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });

  it('should display validation errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        errors: {
          zipcode: 'Zipcode must be a 5-digit number',
        },
      }),
    });

    render(<AdminPage />);

    fireEvent.change(screen.getByLabelText(/temperature/i), {
      target: { value: '72' },
    });
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2025-11-14' },
    });
    fireEvent.change(screen.getByLabelText(/zipcode/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/zipcode must be a 5-digit number/i)
      ).toBeInTheDocument();
    });
  });
});`}</code>
        </pre>

        <h3>4. End-to-End Tests</h3>
        <p>Test complete user workflows across the entire application.</p>

        <h4>What to E2E Test</h4>
        <ul>
          <li>Complete user journeys (add data → view data)</li>
          <li>Navigation between pages</li>
          <li>Data persistence across pages</li>
          <li>Real browser interactions</li>
        </ul>

        <h4>Example: Playwright E2E Test</h4>
        <pre>
          <code>{`// e2e/weather-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Weather App Workflow', () => {
  test('should add temperature data and view it on dashboard', async ({ page }) => {
    // Navigate to admin panel
    await page.goto('http://localhost:3000/admin');

    // Fill form
    await page.fill('input[name="temperature"]', '72');
    await page.fill('input[name="date"]', '2025-11-14');
    await page.fill('input[name="zipcode"]', '12345');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(page.locator('text=Success')).toBeVisible();

    // Set user zipcode
    await page.goto('http://localhost:3000/profile');
    await page.fill('input[name="zipcode"]', '12345');
    await page.click('button[type="submit"]');

    // Navigate to home
    await page.goto('http://localhost:3000');

    // Verify data appears on dashboard
    await expect(page.locator('text=72°F')).toBeVisible();
  });

  test('should handle invalid zipcode with error message', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    await page.fill('input[name="temperature"]', '72');
    await page.fill('input[name="date"]', '2025-11-14');
    await page.fill('input[name="zipcode"]', '123');

    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=Zipcode must be a 5-digit number')
    ).toBeVisible();
  });
});`}</code>
        </pre>

        <h2>Critical Testing Scenarios</h2>

        <h3>Validation Testing</h3>
        <p>Ensure all validation rules are properly enforced:</p>
        <ul>
          <li>Valid inputs accepted</li>
          <li>Invalid inputs rejected with clear messages</li>
          <li>Boundary conditions (min/max values)</li>
          <li>Type mismatches (string vs number)</li>
          <li>Missing required fields</li>
        </ul>

        <h3>Date Logic Testing</h3>
        <p>Test date calculations and ranges:</p>
        <ul>
          <li>Today's date calculation</li>
          <li>7-day historical range (today - 7)</li>
          <li>7-day forecast range (today + 7)</li>
          <li>Date boundaries (first/last day of range)</li>
          <li>Missing dates in range</li>
        </ul>

        <h3>Error Handling Testing</h3>
        <p>Test error scenarios thoroughly:</p>
        <ul>
          <li>API errors (400, 500 status codes)</li>
          <li>Network failures</li>
          <li>Empty/null responses</li>
          <li>Missing user zipcode</li>
          <li>No data available for zipcode</li>
        </ul>

        <h3>Data Persistence Testing</h3>
        <p>Verify data persists correctly:</p>
        <ul>
          <li>POST data is retrievable via GET</li>
          <li>Upsert behavior (duplicate entries update)</li>
          <li>User zipcode persists in localStorage</li>
          <li>Data available across page navigation</li>
        </ul>

        <h2>Testing Best Practices</h2>

        <h3>Test Organization</h3>
        <ul>
          <li>Group related tests with <code>describe</code> blocks</li>
          <li>Use clear, descriptive test names</li>
          <li>Follow AAA pattern (Arrange, Act, Assert)</li>
          <li>One assertion focus per test when possible</li>
        </ul>

        <h3>Test Data Management</h3>
        <ul>
          <li>Use consistent test data (e.g., zipcode "12345")</li>
          <li>Clean up after tests (reset data store)</li>
          <li>Use factories or fixtures for complex data</li>
          <li>Avoid test interdependencies</li>
        </ul>

        <h3>Mocking & Stubbing</h3>
        <ul>
          <li>Mock external dependencies (fetch, localStorage)</li>
          <li>Mock Date for consistent "today" in tests</li>
          <li>Use meaningful mock data</li>
          <li>Clear mocks between tests</li>
        </ul>

        <h3>Test Maintainability</h3>
        <ul>
          <li>Extract reusable test helpers</li>
          <li>Use page objects for E2E tests</li>
          <li>Avoid hardcoded selectors when possible</li>
          <li>Keep tests DRY (Don't Repeat Yourself)</li>
        </ul>

        <h2>Running Tests</h2>

        <h3>Jest (Unit & Integration)</h3>
        <pre>
          <code>{`# Run all tests
npm test --workspace=web

# Run tests in watch mode
npm test --workspace=web -- --watch

# Run specific test file
npm test --workspace=web -- validation.test.ts

# Run tests with coverage
npm test --workspace=web -- --coverage`}</code>
        </pre>

        <h3>Playwright (E2E)</h3>
        <pre>
          <code>{`# Install Playwright (if not already installed)
npm install -D @playwright/test
npx playwright install

# Run E2E tests
npx playwright test

# Run in UI mode
npx playwright test --ui

# Run specific test
npx playwright test weather-workflow.spec.ts`}</code>
        </pre>

        <h2>Test Coverage Goals</h2>
        <p>Aim for comprehensive coverage across these dimensions:</p>

        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Coverage Goal</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Validation Functions</td>
              <td>100%</td>
              <td>High</td>
            </tr>
            <tr>
              <td>API Endpoints</td>
              <td>100%</td>
              <td>High</td>
            </tr>
            <tr>
              <td>Critical User Paths</td>
              <td>100%</td>
              <td>High</td>
            </tr>
            <tr>
              <td>UI Components</td>
              <td>80%+</td>
              <td>Medium</td>
            </tr>
            <tr>
              <td>Edge Cases</td>
              <td>Key scenarios</td>
              <td>High</td>
            </tr>
          </tbody>
        </table>

        <h2>Common Pitfalls to Avoid</h2>
        <ul>
          <li>
            <strong>Testing Implementation Details:</strong> Test behavior, not
            internal implementation
          </li>
          <li>
            <strong>Brittle Selectors:</strong> Use semantic queries (role,
            label) over CSS selectors
          </li>
          <li>
            <strong>Interdependent Tests:</strong> Each test should run
            independently
          </li>
          <li>
            <strong>Missing Error Cases:</strong> Don't just test happy paths
          </li>
          <li>
            <strong>Slow Tests:</strong> Mock external dependencies, avoid
            unnecessary delays
          </li>
          <li>
            <strong>Unclear Test Names:</strong> Test names should describe what
            is being tested
          </li>
        </ul>

        <h2>Example Test Suite Structure</h2>
        <pre>
          <code>{`weather-app/apps/web/
├── app/
│   ├── __tests__/                        # Component tests
│   │   ├── admin.test.tsx
│   │   ├── profile.test.tsx
│   │   └── home.test.tsx
│   │
│   ├── api/weather/__tests__/            # API tests
│   │   ├── get.test.ts
│   │   ├── post.test.ts
│   │   ├── validation.test.ts
│   │   └── integration.test.ts
│   │
│   └── lib/__tests__/                    # Utility tests
│       └── validation.test.ts
│
├── e2e/                                   # E2E tests
│   ├── weather-workflow.spec.ts
│   ├── admin-panel.spec.ts
│   └── profile.spec.ts
│
├── jest.config.cjs
└── playwright.config.ts`}</code>
        </pre>

        <h2>Evaluation Criteria</h2>
        <p>Your tests will be evaluated on:</p>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>Completeness</h3>
            <ul>
              <li>All features tested</li>
              <li>Edge cases covered</li>
              <li>Error paths tested</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Quality</h3>
            <ul>
              <li>Clear test names</li>
              <li>Well-organized code</li>
              <li>Proper assertions</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Strategy</h3>
            <ul>
              <li>Right test types</li>
              <li>Appropriate mocking</li>
              <li>Efficient execution</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Maintainability</h3>
            <ul>
              <li>Reusable helpers</li>
              <li>DRY principles</li>
              <li>Clear structure</li>
            </ul>
          </div>
        </div>

        <h2>Resources</h2>
        <ul>
          <li>
            <a
              href="https://jestjs.io/docs/getting-started"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jest Documentation
            </a>
          </li>
          <li>
            <a
              href="https://testing-library.com/docs/react-testing-library/intro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Testing Library
            </a>
          </li>
          <li>
            <a
              href="https://playwright.dev/docs/intro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Playwright Documentation
            </a>
          </li>
          <li>
            <a href="/api-reference">API Reference</a> - Endpoint documentation
          </li>
          <li>
            <a href="/architecture">Architecture</a> - System design and data
            flow
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Good Luck!</strong> Remember, the goal is to demonstrate
            your testing skills through comprehensive, well-crafted tests. Focus
            on quality over quantity, and don't hesitate to test edge cases and
            error scenarios.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
}
