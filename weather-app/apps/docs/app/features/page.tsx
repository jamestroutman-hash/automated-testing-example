import { DocsLayout } from "../components/DocsLayout";
import styles from "../docs.module.css";

export default function FeaturesPage() {
  return (
    <DocsLayout>
      <div className={styles.content}>
        <h1>Features</h1>
        <p>
          Veritas Weather includes a comprehensive set of features designed to
          provide realistic testing scenarios without unnecessary complexity.
        </p>

        <h2>Core Features</h2>

        <h3>Home Dashboard</h3>
        <p>
          The home dashboard serves as the main interface for viewing weather
          data. It is divided into three primary sections:
        </p>
        <ul>
          <li>
            <strong>Current Temperature:</strong> Displays today's temperature
            for the user's configured zipcode
          </li>
          <li>
            <strong>7-Day Historical Data:</strong> Shows temperature readings
            for the past 7 days
          </li>
          <li>
            <strong>7-Day Forecast:</strong> Displays predicted temperatures for
            the next 7 days
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Testing Opportunities:</strong> The dashboard provides
            excellent scenarios for testing data rendering, empty states, error
            handling, and date range calculations.
          </p>
        </div>

        <h3>Admin Temperature Panel</h3>
        <p>
          The admin panel allows controlled injection of test data, eliminating
          the need for external weather APIs. This feature is crucial for
          creating deterministic, repeatable tests.
        </p>

        <h4>Key Capabilities</h4>
        <ul>
          <li>Add temperature data for any zipcode and date</li>
          <li>Input validation for temperature values, dates, and zipcodes</li>
          <li>Success and error message display</li>
          <li>Form state management and submission handling</li>
        </ul>

        <h4>Validation Rules</h4>
        <ul>
          <li>
            <strong>Temperature:</strong> Must be a valid number within
            reasonable range (-150°F to 150°F)
          </li>
          <li>
            <strong>Date:</strong> Must be in YYYY-MM-DD format
          </li>
          <li>
            <strong>Zipcode:</strong> Must be a 5-digit US zipcode
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Testing Opportunities:</strong> Form validation, error
            handling, API integration testing, and data persistence verification.
          </p>
        </div>

        <h3>User Profile & Zipcode Configuration</h3>
        <p>
          The profile page enables users to configure their preferred zipcode,
          which is used across the application to fetch and display relevant
          weather data.
        </p>

        <h4>Key Capabilities</h4>
        <ul>
          <li>Set and update user zipcode preference</li>
          <li>Zipcode format validation (5-digit US format)</li>
          <li>Persistence using browser localStorage</li>
          <li>Immediate feedback on save success or validation errors</li>
        </ul>

        <h4>Persistence Mechanism</h4>
        <p>
          User preferences are stored in browser localStorage under the key{" "}
          <code>userZipcode</code>. This simple persistence mechanism:
        </p>
        <ul>
          <li>Eliminates database complexity</li>
          <li>Enables easy test data reset</li>
          <li>Provides a realistic preference management pattern</li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Testing Opportunities:</strong> Input validation, localStorage
            interaction, state management, and user preference persistence.
          </p>
        </div>

        <h2>Data Management Features</h2>

        <h3>In-Memory Weather Data Store</h3>
        <p>
          The application uses an in-memory Map structure to store weather data.
          This design choice provides several benefits for testing:
        </p>
        <ul>
          <li>
            <strong>Fast Access:</strong> No database queries or network latency
          </li>
          <li>
            <strong>Deterministic:</strong> Predictable data state for tests
          </li>
          <li>
            <strong>Easy Reset:</strong> Clear state between test runs
          </li>
          <li>
            <strong>No Setup:</strong> No database installation or configuration
          </li>
        </ul>

        <h4>Data Structure</h4>
        <p>
          Weather data is stored with a composite key of{" "}
          <code>zipcode-date</code> and a temperature value:
        </p>
        <pre>
          <code>{`Map<string, number>

Key format: "12345-2025-11-14"
Value: 72 (temperature in °F)`}</code>
        </pre>

        <h3>Date Range Logic</h3>
        <p>
          The application handles three distinct temporal categories:
        </p>
        <ul>
          <li>
            <strong>Historical Data:</strong> Past dates (today minus 7 days)
          </li>
          <li>
            <strong>Current Temperature:</strong> Today's date
          </li>
          <li>
            <strong>Forecast Data:</strong> Future dates (today plus 7 days)
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Testing Opportunities:</strong> Date calculations, boundary
            conditions (today, yesterday, tomorrow), timezone handling, and edge
            cases around date transitions.
          </p>
        </div>

        <h2>Validation Features</h2>

        <h3>Zipcode Validation</h3>
        <p>Enforces 5-digit US zipcode format across the application:</p>
        <ul>
          <li>Must be exactly 5 digits</li>
          <li>Must contain only numeric characters</li>
          <li>Applied in both profile and admin panel</li>
          <li>Provides immediate user feedback on invalid input</li>
        </ul>

        <h3>Temperature Data Validation</h3>
        <p>Ensures data integrity for temperature entries:</p>
        <ul>
          <li>Must be a valid numeric value</li>
          <li>Must be within reasonable temperature range</li>
          <li>Server-side validation prevents invalid data storage</li>
          <li>Client-side validation provides immediate user feedback</li>
        </ul>

        <h3>Date Format Validation</h3>
        <p>Ensures consistent date handling:</p>
        <ul>
          <li>Expects ISO 8601 date format (YYYY-MM-DD)</li>
          <li>Validates date is a real calendar date</li>
          <li>Prevents invalid dates like February 30th</li>
        </ul>

        <h2>Navigation</h2>
        <p>
          The application includes a simple navigation system allowing users to
          move between:
        </p>
        <ul>
          <li>
            <strong>Home:</strong> Main dashboard with weather displays
          </li>
          <li>
            <strong>Admin Panel:</strong> Temperature data management
          </li>
          <li>
            <strong>Profile:</strong> Zipcode configuration
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Testing Opportunities:</strong> Navigation flows, page
            transitions, state persistence across navigation, and routing.
          </p>
        </div>

        <h2>Error Handling</h2>
        <p>
          The application implements comprehensive error handling throughout:
        </p>
        <ul>
          <li>
            <strong>API Errors:</strong> Clear error messages for failed requests
          </li>
          <li>
            <strong>Validation Errors:</strong> User-friendly validation feedback
          </li>
          <li>
            <strong>Missing Data:</strong> Graceful handling of empty states
          </li>
          <li>
            <strong>Edge Cases:</strong> Proper handling of boundary conditions
          </li>
        </ul>

        <h3>Error Message Format</h3>
        <p>API errors return a consistent JSON structure:</p>
        <pre>
          <code>{`{
  "error": "Descriptive error message"
}`}</code>
        </pre>

        <h2>What's NOT Included</h2>
        <p>
          To maintain assessment focus on testing skills, the following are
          intentionally excluded:
        </p>
        <ul>
          <li>
            <strong>Authentication:</strong> No login, passwords, or user accounts
          </li>
          <li>
            <strong>Database:</strong> No SQL, ORM, or database setup
          </li>
          <li>
            <strong>External APIs:</strong> No third-party weather services
          </li>
          <li>
            <strong>Deployment:</strong> Local development only
          </li>
          <li>
            <strong>Real-time Updates:</strong> No WebSockets or polling
          </li>
          <li>
            <strong>Multi-user Support:</strong> Single-user browser storage
          </li>
        </ul>

        <h2>Testing Scenarios</h2>
        <p>
          The features above enable candidates to demonstrate proficiency across
          multiple testing dimensions:
        </p>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>Unit Testing</h3>
            <ul>
              <li>Validation logic</li>
              <li>Date calculations</li>
              <li>Data formatting</li>
              <li>Utility functions</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Integration Testing</h3>
            <ul>
              <li>API endpoints</li>
              <li>Data persistence</li>
              <li>Component interactions</li>
              <li>State management</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>E2E Testing</h3>
            <ul>
              <li>User workflows</li>
              <li>Navigation flows</li>
              <li>Form submissions</li>
              <li>Data display</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Edge Cases</h3>
            <ul>
              <li>Empty states</li>
              <li>Invalid inputs</li>
              <li>Boundary dates</li>
              <li>Missing data</li>
            </ul>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
