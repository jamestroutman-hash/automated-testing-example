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

        <h3>3. Component Tests</h3>
        <p>Test React components in isolation with mocked dependencies.</p>

        <h4>What to Component Test</h4>
        <ul>
          <li>Component rendering with different props</li>
          <li>User interactions (clicks, form submissions)</li>
          <li>State changes and UI updates</li>
          <li>Error handling and loading states</li>
        </ul>

        <h3>4. End-to-End Tests</h3>
        <p>Test complete user workflows across the entire application.</p>

        <h4>What to E2E Test</h4>
        <ul>
          <li>Complete user journeys (add data → view data)</li>
          <li>Navigation between pages</li>
          <li>Data persistence across pages</li>
          <li>Real browser interactions</li>
        </ul>

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
