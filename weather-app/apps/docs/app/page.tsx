import Link from "next/link";
import { DocsLayout } from "./components/DocsLayout";
import styles from "./docs.module.css";

export default function Home() {
  return (
    <DocsLayout>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1>Veritas Weather</h1>
          <p>
            An interview assessment platform designed to evaluate automated
            testing skills through a realistic, well-scoped weather application.
          </p>
        </div>

        <h2>Overview</h2>
        <p>
          Veritas Weather is a purpose-built web application that serves as a
          standardized technical assessment tool for evaluating test automation
          capabilities. Unlike generic coding challenges, this platform provides
          a realistic testing environment with controlled complexity and no
          external API dependencies.
        </p>

        <div className={styles.infoBox}>
          <p>
            <strong>Perfect for:</strong> Hiring managers, technical recruiters,
            and engineering teams looking to evaluate QA engineers, SDETs, and
            automation engineers with a fair, consistent assessment.
          </p>
        </div>

        <h2>Quick Links</h2>
        <div className={styles.cardGrid}>
          <Link href="/getting-started" className={styles.card}>
            <h3>Getting Started</h3>
            <p>Set up your development environment and run the application</p>
          </Link>

          <Link href="/features" className={styles.card}>
            <h3>Features</h3>
            <p>Explore the core features and functionality of the application</p>
          </Link>

          <Link href="/api-reference" className={styles.card}>
            <h3>API Reference</h3>
            <p>Complete API endpoint documentation with request/response examples</p>
          </Link>

          <Link href="/testing-guide" className={styles.card}>
            <h3>Testing Guide</h3>
            <p>Comprehensive guide for candidates implementing test automation</p>
          </Link>

          <Link href="/architecture" className={styles.card}>
            <h3>Architecture</h3>
            <p>Understand the technical architecture and design decisions</p>
          </Link>
        </div>

        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Admin Temperature Panel:</strong> Controlled test data
            injection eliminates external API dependencies
          </li>
          <li>
            <strong>Home Dashboard:</strong> Displays current temperature, 7-day
            historical data, and 7-day forecast
          </li>
          <li>
            <strong>User Profile:</strong> Zipcode configuration with validation
            and persistence
          </li>
          <li>
            <strong>In-Memory Data Store:</strong> Fast, deterministic data
            storage without database complexity
          </li>
          <li>
            <strong>Comprehensive Validation:</strong> Input validation,
            error handling, and edge case scenarios
          </li>
        </ul>

        <h2>Why Veritas Weather?</h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>Assessment-First Design</h3>
            <p>
              Every feature is intentionally chosen to test important automation
              skills: input validation, date logic, data persistence, and UI
              state management.
            </p>
          </div>

          <div className={styles.card}>
            <h3>No External Dependencies</h3>
            <p>
              Admin panel provides controlled test data injection, eliminating
              API rate limits, network flakiness, and unpredictable data changes.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Multiple Testing Dimensions</h3>
            <p>
              Evaluate candidates across unit tests, integration tests, E2E tests,
              and data persistence verification in one cohesive application.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Clear Scope Boundaries</h3>
            <p>
              Well-defined features with explicit boundaries ensure candidates
              focus on testing skills rather than infrastructure setup.
            </p>
          </div>
        </div>

        <h2>Technology Stack</h2>
        <div>
          <span className={styles.badge}>Next.js 16</span>
          <span className={styles.badge}>React 19</span>
          <span className={styles.badge}>TypeScript</span>
          <span className={styles.badge}>Turborepo</span>
          <span className={styles.badge}>In-Memory Storage</span>
        </div>

        <h2>Get Started</h2>
        <p>
          Ready to set up the application? Head over to the{" "}
          <Link href="/getting-started">Getting Started</Link> guide to install
          dependencies and run the development server.
        </p>
      </div>
    </DocsLayout>
  );
}
