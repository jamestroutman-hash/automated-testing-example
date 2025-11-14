import { DocsLayout } from "../components/DocsLayout";
import styles from "../docs.module.css";

export default function GettingStartedPage() {
  return (
    <DocsLayout>
      <div className={styles.content}>
        <h1>Getting Started</h1>
        <p>
          This guide will help you set up the Veritas Weather application on
          your local development environment.
        </p>

        <h2>Prerequisites</h2>
        <p>Before you begin, ensure you have the following installed:</p>
        <ul>
          <li>
            <strong>Node.js:</strong> Version 20.x or later (LTS recommended)
          </li>
          <li>
            <strong>npm:</strong> Version 10.x or later (comes with Node.js)
          </li>
          <li>
            <strong>Git:</strong> For cloning the repository
          </li>
          <li>
            <strong>Code Editor:</strong> VS Code recommended
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Note:</strong> This is a monorepo managed by Turborepo. The
            application consists of two Next.js apps: <code>web</code> (main
            application) and <code>docs</code> (documentation site).
          </p>
        </div>

        <h2>Installation</h2>
        <h3>1. Clone the Repository</h3>
        <pre>
          <code>{`git clone https://github.com/jamestroutman-hash/automated-testing-example.git
cd automated-testing-example/weather-app`}</code>
        </pre>
        <div className={styles.infoBox}>
          <p>
            <strong>Live Application:</strong> You can also view the running application at{" "}
            <a
              href="https://automated-testing-example.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://automated-testing-example.vercel.app/
            </a>
          </p>
        </div>

        <h3>2. Install Dependencies</h3>
        <p>
          From the root of the monorepo, install all dependencies for both apps:
        </p>
        <pre>
          <code>npm install</code>
        </pre>

        <h3>3. Verify Installation</h3>
        <p>Check that Node.js and npm are correctly installed:</p>
        <pre>
          <code>{`node --version  # Should show v20.x or later
npm --version   # Should show v10.x or later`}</code>
        </pre>

        <h2>Running the Application</h2>
        <h3>Development Mode</h3>
        <p>
          To run the main web application in development mode (with hot reload):
        </p>
        <pre>
          <code>npm run dev --workspace=web</code>
        </pre>
        <p>
          The application will be available at{" "}
          <code>http://localhost:3000</code>
        </p>

        <h3>Running the Documentation Site</h3>
        <p>To run this documentation site locally:</p>
        <pre>
          <code>npm run dev --workspace=docs</code>
        </pre>
        <p>
          The documentation will be available at{" "}
          <code>http://localhost:3001</code>
        </p>

        <h3>Running Both Applications</h3>
        <p>
          To run both the web app and docs site simultaneously from the root:
        </p>
        <pre>
          <code>npm run dev</code>
        </pre>

        <h2>Project Structure</h2>
        <pre>
          <code>{`weather-app/
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
│       ├── package.json
│       └── ...
│
├── packages/
│   └── ui/               # Shared UI components
│
├── package.json          # Root package.json
├── turbo.json            # Turborepo configuration
└── README.md`}</code>
        </pre>

        <h2>Verifying the Setup</h2>
        <p>After starting the development server, verify the setup by:</p>
        <ol>
          <li>
            Navigate to <code>http://localhost:3000</code>
          </li>
          <li>You should see the Veritas Weather home dashboard</li>
          <li>Click on "Admin Panel" in the navigation</li>
          <li>Click on "Profile" in the navigation</li>
          <li>All pages should load without errors</li>
        </ol>

        <h2>Running Tests</h2>
        <h3>Unit and Integration Tests (Jest)</h3>
        <pre>
          <code>npm run test --workspace=web</code>
        </pre>

        <h3>Type Checking</h3>
        <pre>
          <code>npm run check-types --workspace=web</code>
        </pre>

        <h3>Linting</h3>
        <pre>
          <code>npm run lint --workspace=web</code>
        </pre>

        <h2>Building for Production</h2>
        <p>To create an optimized production build:</p>
        <pre>
          <code>npm run build --workspace=web</code>
        </pre>

        <p>To start the production server:</p>
        <pre>
          <code>npm run start --workspace=web</code>
        </pre>

        <h2>Troubleshooting</h2>
        <h3>Port Already in Use</h3>
        <p>
          If you see an error that port 3000 or 3001 is already in use, either:
        </p>
        <ul>
          <li>Stop the process using that port</li>
          <li>
            Change the port in <code>package.json</code> scripts
          </li>
        </ul>

        <h3>Module Not Found Errors</h3>
        <p>If you encounter module errors:</p>
        <pre>
          <code>{`rm -rf node_modules
npm install`}</code>
        </pre>

        <h3>TypeScript Errors</h3>
        <p>Ensure your TypeScript version matches the project requirements:</p>
        <pre>
          <code>npm list typescript</code>
        </pre>

        <h2>Next Steps</h2>
        <p>Now that your environment is set up, you can:</p>
        <ul>
          <li>
            Explore the <a href="/features">Features</a> to understand what the
            application does
          </li>
          <li>
            Review the <a href="/api-reference">API Reference</a> for detailed
            endpoint documentation
          </li>
          <li>
            Check out the <a href="/testing-guide">Testing Guide</a> to start
            implementing automated tests
          </li>
          <li>
            Understand the <a href="/architecture">Architecture</a> and design
            decisions
          </li>
        </ul>
      </div>
    </DocsLayout>
  );
}
