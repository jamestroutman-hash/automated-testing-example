# Product Mission

## Pitch
Weather App is an interview assessment platform that helps hiring managers and technical recruiters evaluate automated testing skills by providing a realistic, testable web application with controlled complexity.

## Users

### Primary Customers
- **Hiring Managers & Technical Recruiters**: Need a standardized, fair way to evaluate testing automation capabilities across candidates
- **Engineering Teams**: Require consistent assessment criteria for QA engineer and automation engineer positions
- **Interview Candidates**: Benefit from a clear, well-defined scope that allows them to showcase their testing skills without unnecessary complexity

### User Personas

**Senior QA Engineer / Hiring Manager** (35-50)
- **Role:** Technical interviewer evaluating automation testing candidates
- **Context:** Needs to assess multiple candidates fairly with limited time
- **Pain Points:**
  - Generic coding challenges don't reflect real-world testing scenarios
  - Complex applications obscure whether candidates understand testing fundamentals
  - Difficult to compare candidates when each works on different codebases
- **Goals:**
  - Evaluate testing strategy, architecture, and implementation skills
  - Assess ability to handle edge cases and data validation
  - Determine code quality and maintainability practices

**Automation Test Engineer Candidate** (25-40)
- **Role:** QA engineer or SDET interviewing for testing automation position
- **Context:** Demonstrating testing capabilities through take-home or live coding assessment
- **Pain Points:**
  - Unclear requirements lead to wasted time on wrong priorities
  - External API dependencies make testing unpredictable
  - Complex applications force focus on understanding the app rather than writing tests
- **Goals:**
  - Showcase testing framework design skills
  - Demonstrate understanding of multiple testing types (unit, integration, E2E)
  - Display code organization and maintainability practices
  - Complete assessment efficiently within time constraints

## The Problem

### Interview Assessments Don't Reflect Real Testing Scenarios
Most technical interviews for testing automation roles rely on generic algorithm challenges or overly complex production codebases. Algorithm challenges don't assess real-world testing skills like API validation, UI interaction testing, or data persistence verification. Production codebases are too complex, forcing candidates to spend valuable time understanding business logic instead of demonstrating testing expertise. External API dependencies introduce flakiness and unpredictability into test execution.

**Our Solution:** A purpose-built weather application with intentionally controlled scope that mirrors real-world testing scenarios without unnecessary complexity. Admin panel eliminates external API dependencies by allowing controlled test data injection. The application includes common testing challenges: form validation, date logic, data persistence, UI state management, and CRUD operations.

### Inconsistent Evaluation Criteria Across Candidates
When candidates work on different codebases or undefined problems, comparing their testing skills becomes subjective and unfair. Without standardized scope, some candidates over-engineer while others under-deliver, making it difficult to assess true capability.

**Our Solution:** A standardized application with well-defined features provides consistent evaluation criteria. All candidates work with the same data structures, UI components, and business logic, enabling fair comparison. Clear feature requirements help candidates understand expectations and demonstrate relevant skills.

## Differentiators

### Assessment-First Design
Unlike generic sample applications repurposed for interviews, Weather App is intentionally designed as an assessment tool. Every feature is chosen specifically to test important automation skills: zipcode validation tests input handling, date ranges test edge cases, admin panel tests understanding of test data management, and persistence tests state management verification.

### Controlled Complexity Without External Dependencies
Unlike real weather applications that depend on external APIs (OpenWeatherMap, Weather.gov), our admin panel provides controlled test data injection. This eliminates API rate limits, network flakiness, and unpredictable data changes that plague traditional integration testing exercises. Candidates focus on testing skills, not debugging API issues.

### Multiple Testing Dimensions in One Application
Unlike narrow testing challenges that focus on a single skill, Weather App requires candidates to demonstrate proficiency across multiple testing types within a cohesive system. Unit tests for validation logic, integration tests for API endpoints, E2E tests for user workflows, and data persistence verification all work together in a realistic architecture. This provides a comprehensive view of candidate capabilities.

### Clear Scope Boundaries
Unlike ambiguous take-home assignments that leave candidates guessing, Weather App has well-defined features and explicit boundaries. No authentication complexity (simple session storage), no database setup (in-memory store), no deployment requirements (local development only). These boundaries ensure candidates spend time on testing, not infrastructure setup.

## Key Features

### Core Features
- **Admin Temperature Panel:** Enables controlled test data injection with temperature, date, and zipcode entry. Provides validation feedback for invalid inputs. Eliminates external API dependencies for predictable testing.
- **Home Dashboard with Weather Display:** Shows current temperature for user's configured zipcode. Displays 7-day historical data and 7-day forecast in organized views. Provides clear testing targets for UI state and data rendering.
- **User Profile with Zipcode Configuration:** Allows users to set and persist their preferred zipcode. Validates zipcode format on submission. Demonstrates data persistence and preference management patterns.

### Data Management Features
- **In-Memory Weather Data Store:** Stores temperature data keyed by zipcode and date. Provides fast retrieval without database complexity. Enables easy test data reset between test runs.
- **Date Range Logic:** Handles past dates (historical data), current date (today's temperature), and future dates (forecast). Tests candidate understanding of temporal logic and edge cases.

### Validation Features
- **Zipcode Validation:** Enforces 5-digit US zipcode format. Provides immediate feedback on invalid entries. Creates testable validation scenarios for both frontend and backend.
- **Temperature Data Validation:** Validates numeric temperature values within reasonable ranges. Ensures date format consistency. Tests error handling and boundary condition logic.
