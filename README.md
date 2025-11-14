# Veritas Weather

An interview assessment platform designed to evaluate automated testing skills through a realistic, well-scoped weather application.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://automated-testing-example.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/jamestroutman-hash/automated-testing-example)

## Overview

Veritas Weather is a purpose-built web application that serves as a standardized technical assessment tool for evaluating test automation capabilities. Unlike generic coding challenges, this platform provides a realistic testing environment with controlled complexity and no external API dependencies.

**Perfect for:** Hiring managers, technical recruiters, and engineering teams looking to evaluate QA engineers, SDETs, and automation engineers with a fair, consistent assessment.

## Links

- **Live Application**: [https://automated-testing-example.vercel.app/](https://automated-testing-example.vercel.app/)
- **Documentation**: Available at `/weather-app/apps/docs` (runs on [http://localhost:3001](http://localhost:3001))

## Key Features

- **Admin Temperature Panel**: Controlled test data injection eliminates external API dependencies
- **Home Dashboard**: Displays current temperature, 7-day historical data, and 7-day forecast
- **User Profile**: Zipcode configuration with validation and persistence
- **In-Memory Data Store**: Fast, deterministic data storage without database complexity
- **Comprehensive Validation**: Input validation, error handling, and edge case scenarios

## Why Veritas Weather?

### Assessment-First Design
Every feature is intentionally chosen to test important automation skills: input validation, date logic, data persistence, and UI state management.

### No External Dependencies
Admin panel provides controlled test data injection, eliminating API rate limits, network flakiness, and unpredictable data changes.

### Multiple Testing Dimensions
Evaluate candidates across unit tests, integration tests, E2E tests, and data persistence verification in one cohesive application.

### Clear Scope Boundaries
Well-defined features with explicit boundaries ensure candidates focus on testing skills rather than infrastructure setup.

## Technology Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Turborepo** - Monorepo management
- **In-Memory Storage** - Deterministic data layer
- **Recharts** - Data visualization

## Project Structure

```
automated-testing-example/
└── weather-app/
    ├── apps/
    │   ├── web/              # Main application
    │   │   ├── app/
    │   │   │   ├── page.tsx           # Home dashboard
    │   │   │   ├── admin/             # Admin panel
    │   │   │   ├── profile/           # User profile
    │   │   │   ├── api/               # API routes
    │   │   │   └── lib/               # Utilities
    │   │   ├── package.json
    │   │   └── jest.config.cjs        # Jest configuration
    │   │
    │   └── docs/             # Documentation site
    │       ├── app/
    │       └── package.json
    │
    ├── packages/
    │   └── ui/               # Shared UI components
    │
    ├── package.json          # Root package.json
    └── turbo.json            # Turborepo configuration
```

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x or later (LTS recommended)
- **npm**: Version 10.x or later (comes with Node.js)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jamestroutman-hash/automated-testing-example.git
cd automated-testing-example/weather-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev --workspace=web
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Running the Documentation

```bash
npm run dev --workspace=docs
```

The documentation will be available at [http://localhost:3001](http://localhost:3001)

### Running Tests

```bash
# Unit and integration tests
npm run test --workspace=web

# Type checking
npm run check-types --workspace=web

# Linting
npm run lint --workspace=web
```

### Building for Production

```bash
npm run build --workspace=web
npm run start --workspace=web
```

## Application Features

### Admin Panel (`/admin`)
- Set temperature data for specific dates
- Control test scenarios without external API dependencies
- Date picker with calendar interface
- Input validation (temperature range: -100°F to 150°F)
- Toast notifications for feedback

### Home Dashboard (`/`)
- Current temperature display with date/time
- 7-day historical data chart
- 7-day forecast chart
- Responsive design with dark mode support
- Visual indicators when no data is available

### User Profile (`/profile`)
- Zipcode configuration (5-digit US zipcodes)
- Form validation with error messages
- Data persistence across sessions
- Success/error feedback

## API Reference

### Temperature Endpoints

**POST** `/api/temperatures`
- Set temperature for a specific date
- Request: `{ date: string, temperature: number }`
- Response: `{ success: boolean, message: string, data?: Temperature }`

**GET** `/api/temperatures/current`
- Get temperature for today
- Response: `{ temperature: number, date: string, zipcode?: string }`

**GET** `/api/temperatures/historical`
- Get past 7 days of temperature data
- Response: `Temperature[]`

**GET** `/api/temperatures/forecast`
- Get next 7 days of temperature data
- Response: `Temperature[]`

### Profile Endpoints

**GET** `/api/profile`
- Get user profile (zipcode)
- Response: `{ zipcode: string | null }`

**POST** `/api/profile`
- Update user profile
- Request: `{ zipcode: string }`
- Response: `{ success: boolean, message: string, data?: Profile }`

## Testing Opportunities

This application provides rich opportunities for test automation:

### Unit Testing
- Zipcode validation logic
- Temperature range validation
- Date formatting utilities
- API route handlers
- Data store operations

### Integration Testing
- API endpoint workflows
- Profile update persistence
- Temperature data retrieval
- Error handling scenarios

### End-to-End Testing
- Admin panel temperature submission
- Profile zipcode update flow
- Dashboard data display
- Navigation between pages
- Form validation feedback

### Edge Cases
- Invalid zipcode formats
- Out-of-range temperatures
- Future/past date boundaries
- Missing data scenarios
- Concurrent data updates

## Documentation

Comprehensive documentation is available in the `/weather-app/apps/docs` directory, covering:

- **Getting Started**: Setup and installation guide
- **Features**: Core functionality and features
- **API Reference**: Complete API documentation
- **Architecture**: Technical design and decisions
- **Testing Guide**: Comprehensive testing instructions

## Contributing

This is a technical assessment platform. If you're using this for hiring purposes, feel free to fork and customize it for your needs.

## License

MIT License - feel free to use this for technical assessments and educational purposes.

## Contact

For questions or feedback about this assessment platform, please open an issue on GitHub.

---

**Note**: This application uses in-memory storage, so data will be reset when the server restarts. This is intentional to provide a clean slate for each assessment session.
