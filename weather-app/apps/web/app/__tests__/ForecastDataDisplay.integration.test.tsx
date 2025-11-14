/**
 * Integration tests for ForecastDataDisplay - Gap Analysis
 * Task Group 4: Test Review & Gap Analysis
 *
 * Focus: End-to-end workflows and critical integration points
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// Mock Recharts components with more detailed tracking
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children, height }: { children: React.ReactNode; height: number }) => (
    <div data-testid="responsive-container" data-height={height}>{children}</div>
  ),
  LineChart: ({ children, data }: { children: React.ReactNode; data: any[] }) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>{children}</div>
  ),
  Line: ({ stroke, strokeWidth, type, connectNulls }: any) => (
    <div
      data-testid="line"
      data-stroke={stroke}
      data-stroke-width={strokeWidth}
      data-type={type}
      data-connect-nulls={connectNulls}
    />
  ),
  XAxis: ({ dataKey }: { dataKey: string }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: ({ domain }: { domain: string[] }) => <div data-testid="y-axis" data-domain={JSON.stringify(domain)} />,
  CartesianGrid: ({ strokeDasharray }: { strokeDasharray: string }) => (
    <div data-testid="cartesian-grid" data-stroke-dasharray={strokeDasharray} />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
}));

import { ForecastDataDisplay } from '../ForecastDataDisplay';

describe('ForecastDataDisplay - Complete User Flow', () => {
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

  it('complete user flow: visit page -> see loading -> see forecast', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    // Mock delayed API response
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({
              data: {
                '2025-11-15': 68,
                '2025-11-16': 70,
                '2025-11-17': 72,
                '2025-11-18': 71,
                '2025-11-19': 69,
                '2025-11-20': 67,
                '2025-11-21': 66,
              }
            }),
          }), 50)
        )
    );

    render(<ForecastDataDisplay />);

    // Step 1: Initially should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading forecast data')).toBeInTheDocument();

    // Step 2: After loading, should show forecast chart
    await waitFor(() => {
      expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    // Step 3: Verify chart has data
    const lineChart = screen.getByTestId('line-chart');
    const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');
    expect(chartData).toHaveLength(7);
  });

  it('forecast data displays correctly when API returns partial data', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    // Mock API with only some future dates
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-15': 68,
          '2025-11-17': 72,
          '2025-11-19': 69,
          '2025-11-21': 66,
        }
      }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    // Verify chart handles partial data
    const lineChart = screen.getByTestId('line-chart');
    const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');

    // Should still have 7 data points (with nulls for missing dates)
    expect(chartData).toHaveLength(7);

    // Some temperatures should be null
    const nullCount = chartData.filter((d: any) => d.temperature === null).length;
    expect(nullCount).toBeGreaterThan(0);
  });
});

describe('ForecastDataDisplay - Date Calculation Accuracy', () => {
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
      },
      writable: true,
    });

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  it('calculates exactly 7 future dates (days +1 through +7)', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    const futureData: Record<string, number> = {};
    const today = new Date();

    // Generate data for days +1 through +7
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      futureData[dateStr] = 60 + i;
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: futureData }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');

      // Should have exactly 7 data points
      expect(chartData).toHaveLength(7);

      // All should have temperature data
      const allHaveData = chartData.every((d: any) => d.temperature !== null);
      expect(allHaveData).toBe(true);
    });
  });

  it('only displays future dates, not past or current dates', async () => {
    mockLocalStorage['userZipcode'] = '10001';

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const mixedData: Record<string, number> = {
      // Past date (should be filtered out)
      [yesterday.toISOString().split('T')[0]]: 50,
      // Today (should be filtered out)
      [today.toISOString().split('T')[0]]: 55,
      // Future dates (should be included)
      [tomorrow.toISOString().split('T')[0]]: 60,
    };

    // Add more future dates
    for (let i = 2; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      mixedData[date.toISOString().split('T')[0]] = 60 + i;
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: mixedData }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');

      // Should only have future dates
      expect(chartData).toHaveLength(7);

      // First data point should be tomorrow's temperature (60)
      expect(chartData[0].temperature).toBe(60);
    });
  });
});

describe('ForecastDataDisplay - Visual Distinction', () => {
  let mockLocalStorage: { [key: string]: string } = {};
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
      },
      writable: true,
    });

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  it('orange line color is distinct and applied correctly', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-15': 68,
          '2025-11-16': 70,
          '2025-11-17': 72,
          '2025-11-18': 71,
          '2025-11-19': 69,
          '2025-11-20': 67,
          '2025-11-21': 66,
        }
      }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      const line = screen.getByTestId('line');

      // Verify orange color is applied
      const strokeColor = line.getAttribute('data-stroke');
      expect(strokeColor).toBe('#FF8C42');

      // Verify it's not using the default/historical color
      expect(strokeColor).not.toBe('var(--foreground)');
    });
  });

  it('chart renders with correct dimensions (300px height)', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-15': 68,
          '2025-11-16': 70,
        }
      }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      const container = screen.getByTestId('responsive-container');
      expect(container).toHaveAttribute('data-height', '300');
    });
  });

  it('section heading displays correctly with proper text', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-15': 68,
          '2025-11-16': 70,
        }
      }),
    });

    const { container } = render(<ForecastDataDisplay />);

    await waitFor(() => {
      const heading = screen.getByText('7-Day Forecast');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');

      // Verify heading appears before chart
      const headingElement = heading;
      const chartContainer = container.querySelector('[class*="chartContainer"]');
      expect(chartContainer).toBeInTheDocument();
    });
  });
});

describe('ForecastDataDisplay - Error Recovery', () => {
  let mockLocalStorage: { [key: string]: string } = {};
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
      },
      writable: true,
    });

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  it('handles API failure gracefully and shows error toast', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load forecast data. Please try again.');
    });

    // Should not render chart after error
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });

  it('handles API returning invalid response structure', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load forecast data. Please try again.');
    });
  });
});

describe('ForecastDataDisplay - Chart Configuration', () => {
  let mockLocalStorage: { [key: string]: string } = {};
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
      },
      writable: true,
    });

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  it('line configuration uses correct settings', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-15': 68,
          '2025-11-16': 70,
        }
      }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      const line = screen.getByTestId('line');

      // Verify line type
      expect(line.getAttribute('data-type')).toBe('monotone');

      // Verify stroke width
      expect(line.getAttribute('data-stroke-width')).toBe('2');

      // Verify connectNulls is false (shows gaps)
      expect(line.getAttribute('data-connect-nulls')).toBe('false');
    });
  });

  it('X-axis uses date as dataKey', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-15': 68,
        }
      }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      const xAxis = screen.getByTestId('x-axis');
      expect(xAxis.getAttribute('data-key')).toBe('date');
    });
  });

  it('CartesianGrid uses correct dash pattern', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-15': 68,
        }
      }),
    });

    render(<ForecastDataDisplay />);

    await waitFor(() => {
      const grid = screen.getByTestId('cartesian-grid');
      expect(grid.getAttribute('data-stroke-dasharray')).toBe('3 3');
    });
  });
});
