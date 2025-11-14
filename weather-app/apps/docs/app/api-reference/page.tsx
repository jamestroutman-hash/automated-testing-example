import { DocsLayout } from "../components/DocsLayout";
import styles from "../docs.module.css";

export default function APIReferencePage() {
  return (
    <DocsLayout>
      <div className={styles.content}>
        <h1>API Reference</h1>
        <p>
          Complete documentation for the Veritas Weather API endpoints. All
          endpoints return JSON and use standard HTTP methods and status codes.
        </p>

        <h2>Base URL</h2>
        <pre>
          <code>http://localhost:3000/api</code>
        </pre>

        <h2>Weather Data Endpoints</h2>
        <p>
          The weather API provides endpoints for storing and retrieving
          temperature data organized by zipcode and date.
        </p>

        <h3>POST /api/weather</h3>
        <p>Store weather data in the in-memory data store.</p>

        <h4>Request</h4>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Content-Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>POST</td>
              <td>/api/weather</td>
              <td>application/json</td>
            </tr>
          </tbody>
        </table>

        <h4>Request Body</h4>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>temperature</td>
              <td>number</td>
              <td>Yes</td>
              <td>Temperature in Fahrenheit (-150 to 150)</td>
            </tr>
            <tr>
              <td>date</td>
              <td>string</td>
              <td>Yes</td>
              <td>Date in YYYY-MM-DD format (ISO 8601)</td>
            </tr>
            <tr>
              <td>zipcode</td>
              <td>string</td>
              <td>Yes</td>
              <td>5-digit US zipcode</td>
            </tr>
          </tbody>
        </table>

        <h4>Example Request</h4>
        <pre>
          <code>{`POST /api/weather
Content-Type: application/json

{
  "temperature": 72,
  "date": "2025-11-14",
  "zipcode": "12345"
}`}</code>
        </pre>

        <h4>Success Response (201 Created)</h4>
        <p>Returns the stored weather data.</p>
        <pre>
          <code>{`{
  "temperature": 72,
  "date": "2025-11-14",
  "zipcode": "12345"
}`}</code>
        </pre>

        <h4>Error Responses</h4>

        <h5>400 Bad Request - Missing Fields</h5>
        <pre>
          <code>{`{
  "errors": {
    "temperature": "Temperature is required",
    "date": "Date is required",
    "zipcode": "Zipcode is required"
  }
}`}</code>
        </pre>

        <h5>400 Bad Request - Invalid Temperature</h5>
        <pre>
          <code>{`{
  "errors": {
    "temperature": "Temperature must be a valid number"
  }
}

// Or for out-of-range values:
{
  "errors": {
    "temperature": "Temperature must be between -150 and 150°F"
  }
}`}</code>
        </pre>

        <h5>400 Bad Request - Invalid Date Format</h5>
        <pre>
          <code>{`{
  "errors": {
    "date": "Date must be in YYYY-MM-DD format"
  }
}`}</code>
        </pre>

        <h5>400 Bad Request - Invalid Zipcode</h5>
        <pre>
          <code>{`{
  "errors": {
    "zipcode": "Zipcode must be a 5-digit number"
  }
}`}</code>
        </pre>

        <h5>500 Internal Server Error</h5>
        <pre>
          <code>{`{
  "errors": {
    "server": "An unexpected error occurred"
  }
}`}</code>
        </pre>

        <div className={styles.infoBox}>
          <p>
            <strong>Note:</strong> The POST endpoint uses upsert behavior. If
            data already exists for the given zipcode and date, it will be
            updated silently without returning an error.
          </p>
        </div>

        <h3>GET /api/weather</h3>
        <p>Retrieve weather data from the in-memory data store.</p>

        <h4>Request</h4>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Query Parameters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GET</td>
              <td>/api/weather</td>
              <td>zipcode (required), date (optional)</td>
            </tr>
          </tbody>
        </table>

        <h4>Query Parameters</h4>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>zipcode</td>
              <td>string</td>
              <td>Yes</td>
              <td>5-digit US zipcode</td>
            </tr>
            <tr>
              <td>date</td>
              <td>string</td>
              <td>No</td>
              <td>
                Date in YYYY-MM-DD format. If omitted, returns all dates for
                zipcode.
              </td>
            </tr>
          </tbody>
        </table>

        <h4>Example Request - Specific Date</h4>
        <pre>
          <code>{`GET /api/weather?zipcode=12345&date=2025-11-14`}</code>
        </pre>

        <h4>Success Response - Specific Date (200 OK)</h4>
        <pre>
          <code>{`{
  "temperature": 72
}`}</code>
        </pre>

        <p>If no data exists for the specified zipcode and date:</p>
        <pre>
          <code>{`{
  "temperature": null
}`}</code>
        </pre>

        <h4>Example Request - All Dates</h4>
        <pre>
          <code>{`GET /api/weather?zipcode=12345`}</code>
        </pre>

        <h4>Success Response - All Dates (200 OK)</h4>
        <pre>
          <code>{`{
  "data": {
    "2025-11-10": 68,
    "2025-11-11": 70,
    "2025-11-12": 71,
    "2025-11-13": 69,
    "2025-11-14": 72
  }
}`}</code>
        </pre>

        <p>If no data exists for the specified zipcode:</p>
        <pre>
          <code>{`{
  "data": null
}`}</code>
        </pre>

        <h4>Error Responses</h4>

        <h5>400 Bad Request - Missing Zipcode</h5>
        <pre>
          <code>{`{
  "errors": {
    "zipcode": "Zipcode is required"
  }
}`}</code>
        </pre>

        <h5>400 Bad Request - Invalid Zipcode</h5>
        <pre>
          <code>{`{
  "errors": {
    "zipcode": "Zipcode must be a 5-digit number"
  }
}`}</code>
        </pre>

        <h5>400 Bad Request - Invalid Date Format</h5>
        <pre>
          <code>{`{
  "errors": {
    "date": "Date must be in YYYY-MM-DD format"
  }
}`}</code>
        </pre>

        <h5>500 Internal Server Error</h5>
        <pre>
          <code>{`{
  "errors": {
    "server": "An unexpected error occurred"
  }
}`}</code>
        </pre>

        <h2>Data Types</h2>

        <h3>WeatherData</h3>
        <pre>
          <code>{`interface WeatherData {
  zipcode: string;    // 5-digit US zipcode
  date: string;       // ISO 8601 date (YYYY-MM-DD)
  temperature: number;// Temperature in °F (-150 to 150)
}`}</code>
        </pre>

        <h3>ErrorResponse</h3>
        <pre>
          <code>{`interface ErrorResponse {
  errors: Record<string, string>;
}

// Example:
{
  "errors": {
    "temperature": "Temperature must be a valid number",
    "zipcode": "Zipcode must be a 5-digit number"
  }
}`}</code>
        </pre>

        <h2>Validation Rules</h2>

        <h3>Temperature Validation</h3>
        <ul>
          <li>Must be a valid number (not string, null, undefined, or NaN)</li>
          <li>Must be between -150 and 150 (inclusive)</li>
          <li>Decimals are allowed</li>
        </ul>

        <h3>Date Validation</h3>
        <ul>
          <li>Must be in YYYY-MM-DD format</li>
          <li>Must be a valid calendar date (e.g., no February 30th)</li>
          <li>Leading zeros required for month and day</li>
          <li>Four-digit year required</li>
        </ul>

        <h3>Zipcode Validation</h3>
        <ul>
          <li>Must be exactly 5 characters</li>
          <li>Must contain only numeric digits (0-9)</li>
          <li>Leading zeros are preserved (e.g., "01234" is valid)</li>
        </ul>

        <h2>HTTP Status Codes</h2>
        <table>
          <thead>
            <tr>
              <th>Status Code</th>
              <th>Description</th>
              <th>When Used</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>200 OK</td>
              <td>Request successful</td>
              <td>GET requests with valid parameters</td>
            </tr>
            <tr>
              <td>201 Created</td>
              <td>Resource created successfully</td>
              <td>POST requests with valid data</td>
            </tr>
            <tr>
              <td>400 Bad Request</td>
              <td>Invalid request data</td>
              <td>Validation errors, missing fields, malformed JSON</td>
            </tr>
            <tr>
              <td>500 Internal Server Error</td>
              <td>Unexpected server error</td>
              <td>Unhandled exceptions or errors</td>
            </tr>
          </tbody>
        </table>

        <h2>Testing the API</h2>

        <h3>Using curl</h3>
        <h4>POST Request</h4>
        <pre>
          <code>{`curl -X POST http://localhost:3000/api/weather \\
  -H "Content-Type: application/json" \\
  -d '{
    "temperature": 72,
    "date": "2025-11-14",
    "zipcode": "12345"
  }'`}</code>
        </pre>

        <h4>GET Request - Specific Date</h4>
        <pre>
          <code>{`curl "http://localhost:3000/api/weather?zipcode=12345&date=2025-11-14"`}</code>
        </pre>

        <h4>GET Request - All Dates</h4>
        <pre>
          <code>{`curl "http://localhost:3000/api/weather?zipcode=12345"`}</code>
        </pre>

        <h3>Using JavaScript fetch</h3>
        <h4>POST Request</h4>
        <pre>
          <code>{`const response = await fetch('/api/weather', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    temperature: 72,
    date: '2025-11-14',
    zipcode: '12345',
  }),
});

const data = await response.json();
console.log(data);`}</code>
        </pre>

        <h4>GET Request</h4>
        <pre>
          <code>{`const response = await fetch(
  '/api/weather?zipcode=12345&date=2025-11-14'
);
const data = await response.json();
console.log(data.temperature);`}</code>
        </pre>

        <h2>Common Integration Patterns</h2>

        <h3>Adding Test Data</h3>
        <p>
          Before running tests, seed the data store with known test data:
        </p>
        <pre>
          <code>{`// Seed data for testing
const testData = [
  { temperature: 65, date: '2025-11-10', zipcode: '12345' },
  { temperature: 68, date: '2025-11-11', zipcode: '12345' },
  { temperature: 72, date: '2025-11-12', zipcode: '12345' },
];

for (const data of testData) {
  await fetch('/api/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}`}</code>
        </pre>

        <h3>Fetching Date Ranges</h3>
        <p>To fetch a 7-day range of data:</p>
        <pre>
          <code>{`async function getDateRange(zipcode: string, startDate: string, days: number) {
  const response = await fetch(\`/api/weather?zipcode=\${zipcode}\`);
  const { data } = await response.json();

  if (!data) return [];

  // Filter and sort by date range
  const start = new Date(startDate);
  return Object.entries(data)
    .filter(([date]) => {
      const d = new Date(date);
      const daysDiff = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff < days;
    })
    .map(([date, temperature]) => ({ date, temperature }))
    .sort((a, b) => a.date.localeCompare(b.date));
}`}</code>
        </pre>

        <h2>Error Handling Best Practices</h2>
        <ul>
          <li>
            Always check the response status code before parsing JSON
          </li>
          <li>
            Handle <code>null</code> values in GET responses (data not found)
          </li>
          <li>
            Display field-specific error messages from the{" "}
            <code>errors</code> object
          </li>
          <li>
            Implement retry logic for 500 errors (though they should be rare)
          </li>
          <li>
            Validate data client-side before submission to provide immediate
            feedback
          </li>
        </ul>

        <div className={styles.infoBox}>
          <p>
            <strong>Testing Tip:</strong> The in-memory store is reset when the
            server restarts, making it easy to start with a clean state for each
            test run.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
}
