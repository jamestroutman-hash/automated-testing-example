# Tech Stack

This document defines the technical stack for the Weather App interview assessment platform.

## Framework & Runtime
- **Monorepo Manager:** Turborepo
- **Application Framework:** Next.js 16 (App Router)
- **Language/Runtime:** TypeScript / Node.js
- **Package Manager:** npm
- **Workspace Location:** @weather-app/ (local monorepo package)

## Frontend
- **JavaScript Framework:** React 19
- **CSS Framework:** Tailwind CSS
- **UI Components:** shadcn/ui (optional, for rapid UI development)
- **Form Handling:** React Hook Form (optional, for validation patterns)

## Database & Storage
- **Database:** None (In-Memory Store using JavaScript Map)
- **Data Persistence:** In-memory Map/Object structure in Node.js runtime
- **User Preferences:** localStorage / session storage (browser-side)
- **Caching:** Not required (data already in memory)

## API Layer
- **API Routes:** Next.js API Routes (App Router route handlers)
- **Data Format:** JSON
- **HTTP Client:** Native fetch API

## Authentication & Authorization
- **Authentication:** None or Simple Session Storage
- **User Identification:** Basic identifier in localStorage/cookie (no password)
- **Session Management:** Browser storage only (no server sessions)

## Testing & Quality (Candidate Implementation)
Candidates will implement the following testing stack as part of their assessment:

- **Unit Testing:** Jest or Vitest
- **Component Testing:** React Testing Library
- **E2E Testing:** Playwright or Cypress
- **API Testing:** Supertest or native fetch testing
- **Linting/Formatting:** ESLint, Prettier (pre-configured)

## Deployment & Infrastructure
- **Hosting:** Not Required (Local Development Only)
- **CI/CD:** Not Required for Assessment
- **Containerization:** Optional Docker (for candidate environment consistency)

## Third-Party Services
- **Weather API:** None (Simulated via Admin Panel)
- **Email:** Not Required
- **Monitoring:** Not Required
- **Analytics:** Not Required

## Development Tools
- **Code Editor:** Candidate's choice (VS Code recommended)
- **Version Control:** Git
- **Node Version:** LTS (20.x or later recommended)

## Notes
- Minimal external dependencies to focus assessment on testing skills
- In-memory storage eliminates database setup complexity
- No external API calls ensure deterministic, fast test execution
- Local-only development removes deployment and infrastructure concerns
