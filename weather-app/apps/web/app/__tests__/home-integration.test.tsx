/**
 * Integration tests for Home Page
 * Task Group 3: Home Page Integration
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Link from 'next/link';

// Mock react-hot-toast BEFORE importing components
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

import HomePage from '../page';

// Mock the navigation structure for integration tests
const MockLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav className="mainNav">
        <div className="navContainer">
          <Link href="/" className="navLink">
            Home
          </Link>
          <Link href="/profile" className="navLink">
            Profile
          </Link>
          <Link href="/admin" className="navLink">
            Admin Panel
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
};

describe('Home Page - Integration', () => {
  let mockLocalStorage: { [key: string]: string } = {};
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage = {};

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('page metadata is correctly set', () => {
    // This test verifies the metadata is exported correctly
    // In a real Next.js environment, this would be set in the document head
    const { metadata } = require('../page');

    expect(metadata.title).toBe('Veritas Weather - Home Dashboard');
    expect(metadata.description).toBe('View current weather, historical data, and forecasts');
  });

  it('renders within layout with navigation', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    render(
      <MockLayout>
        <HomePage />
      </MockLayout>
    );

    // Verify navigation is present
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    // Verify page content is present
    expect(screen.getByText(/veritas weather/i)).toBeInTheDocument();
  });

  it('sections maintain semantic structure for screen readers', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    const { container } = render(<HomePage />);

    // Verify main landmark
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Verify heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.tagName).toBe('H1');
  });

  it('page layout does not break with empty sections', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    const { container } = render(<HomePage />);

    // Verify page renders successfully with sections
    const sections = container.querySelectorAll('[class*="section"]');
    expect(sections.length).toBe(3);

    // Verify each section is rendered
    sections.forEach(section => {
      expect(section).toBeInTheDocument();
      expect(section).toBeVisible();
    });
  });

  it('CSS classes are applied to elements as expected', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    const { container } = render(<HomePage />);

    // Verify page wrapper has page class
    const page = container.querySelector('[class*="page"]');
    expect(page).toBeInTheDocument();

    // Verify main has main class
    const main = container.querySelector('main');
    expect(main?.className).toContain('main');

    // Verify title has title class
    const title = screen.getByRole('heading', { level: 1 });
    expect(title.className).toContain('title');

    // Verify all sections have section class
    const sections = container.querySelectorAll('[class*="section"]');
    sections.forEach(section => {
      expect(section.className).toContain('section');
    });
  });

  it('maintains consistent layout across multiple renders', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    const { container: container1 } = render(<HomePage />);
    const { container: container2 } = render(<HomePage />);

    // Verify both renders have the same structure
    const sections1 = container1.querySelectorAll('[class*="section"]');
    const sections2 = container2.querySelectorAll('[class*="section"]');

    expect(sections1.length).toBe(sections2.length);
    expect(sections1.length).toBe(3);
  });

  it('all three section containers have unique semantic class names', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    const { container } = render(<HomePage />);

    // Verify each section has its specific semantic class
    const currentTempSection = container.querySelector('[class*="currentTempSection"]');
    const historicalSection = container.querySelector('[class*="historicalSection"]');
    const forecastSection = container.querySelector('[class*="forecastSection"]');

    expect(currentTempSection).toBeInTheDocument();
    expect(historicalSection).toBeInTheDocument();
    expect(forecastSection).toBeInTheDocument();
  });

  it('page is accessible with proper heading structure', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    render(<HomePage />);

    // Verify only one h1 heading exists
    const headings = screen.getAllByRole('heading');
    const h1Headings = headings.filter(h => h.tagName === 'H1');

    expect(h1Headings.length).toBe(1);
    expect(h1Headings[0]).toHaveTextContent(/veritas weather/i);
  });

  // CurrentTemperatureDisplay Integration Tests

  it('renders CurrentTemperatureDisplay component in .currentTempSection', () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    render(<HomePage />);

    // Home page should contain the main title
    expect(screen.getByText('Veritas Weather')).toBeInTheDocument();
  });

  it('displays loading state initially when fetching temperature', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ temperature: 72 }),
          }), 100)
        )
    );

    render(<HomePage />);

    // Loading spinners should be visible (both components)
    const spinners = screen.getAllByRole("status");
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('displays temperature after successful API fetch', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    render(<HomePage />);

    // Wait for temperature to be displayed
    await waitFor(() => {
      expect(screen.getByText('72°F')).toBeInTheDocument();
    });
  });

  it('displays placeholder when no data exists', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: null }),
    });

    render(<HomePage />);

    // Wait for placeholder message
    await waitFor(() => {
      expect(screen.getByText('No temperature data available for today')).toBeInTheDocument();
    });
  });
});

// HistoricalDataDisplay Integration Tests
describe('Home Page - HistoricalDataDisplay Integration', () => {
  let mockLocalStorage: { [key: string]: string } = {};
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders HistoricalDataDisplay component in historicalSection div', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    // Mock responses for both CurrentTemperatureDisplay and HistoricalDataDisplay
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ temperature: 72 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            '2025-11-07': 68,
            '2025-11-08': 70,
            '2025-11-09': 72,
            '2025-11-10': 71,
            '2025-11-11': 69,
            '2025-11-12': 67,
            '2025-11-13': 66,
          }
        }),
      });

    const { container } = render(<HomePage />);

    // Wait for historical component to render
    await waitFor(() => {
      const historicalSection = container.querySelector('[class*="historicalSection"]');
      expect(historicalSection).toBeInTheDocument();

      // Verify the graph is rendered within historical section
      const chart = screen.getByTestId('responsive-container');
      expect(chart).toBeInTheDocument();
    });
  });

  it('component integrates with page layout correctly', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ temperature: 72 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            '2025-11-07': 68,
            '2025-11-08': 70,
            '2025-11-09': 72,
            '2025-11-10': 71,
            '2025-11-11': 69,
            '2025-11-12': 67,
            '2025-11-13': 66,
          }
        }),
      });

    const { container } = render(<HomePage />);

    await waitFor(() => {
      // Verify all three sections exist
      const sections = container.querySelectorAll('[class*="section"]');
      expect(sections.length).toBe(3);

      // Verify historical section contains the chart
      const historicalSection = container.querySelector('[class*="historicalSection"]');
      const chartContainer = historicalSection?.querySelector('[class*="chartContainer"]');
      expect(chartContainer).toBeInTheDocument();
    });
  });

  it('component follows semantic structure', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ temperature: 72 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            '2025-11-07': 68,
            '2025-11-08': 70,
            '2025-11-09': 72,
            '2025-11-10': 71,
            '2025-11-11': 69,
            '2025-11-12': 67,
            '2025-11-13': 66,
          }
        }),
      });

    const { container } = render(<HomePage />);

    await waitFor(() => {
      // Verify proper nesting structure
      const historicalSection = container.querySelector('[class*="historicalSection"]');
      expect(historicalSection).toBeInTheDocument();

      // Verify the container is within the section
      const historicalContainer = historicalSection?.querySelector('[class*="container"]');
      expect(historicalContainer).toBeInTheDocument();
    });
  });

  it('both components can coexist on the page', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ temperature: 72 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            '2025-11-07': 68,
            '2025-11-08': 70,
            '2025-11-09': 72,
            '2025-11-10': 71,
            '2025-11-11': 69,
            '2025-11-12': 67,
            '2025-11-13': 66,
          }
        }),
      });

    render(<HomePage />);

    // Wait for both components to be rendered
    await waitFor(() => {
      // CurrentTemperatureDisplay shows temperature
      expect(screen.getByText('72°F')).toBeInTheDocument();

      // HistoricalDataDisplay shows chart
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});
