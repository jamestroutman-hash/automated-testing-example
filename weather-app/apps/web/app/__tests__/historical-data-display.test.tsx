/**
 * Unit tests for HistoricalDataDisplay Component
 * Task Groups 2, 3 & 4: Core Component Implementation, Graph Rendering, and Styling
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

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children, data }: { children: React.ReactNode; data: any[] }) => <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

import { HistoricalDataDisplay } from '../HistoricalDataDisplay';

describe('HistoricalDataDisplay - Component Behavior', () => {
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

  it('renders loading state initially', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({
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
          }), 100)
        )
    );

    render(<HistoricalDataDisplay />);

    // Loading spinner should be visible
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading historical data');
  });

  it('fetches and displays historical data for 7 days', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
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

    render(<HistoricalDataDisplay />);

    // Wait for graph to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    // Verify fetch was called with correct zipcode
    expect(mockFetch).toHaveBeenCalledWith('/api/weather?zipcode=10001');
  });

  it('handles missing zipcode with toast error', async () => {
    mockLocalStorage['userZipcode'] = '';

    render(<HistoricalDataDisplay />);

    // Wait for toast error to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please configure your zipcode in the profile page');
    });

    // Component should return null (not render anything)
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });

  it('handles API errors with toast notification', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<HistoricalDataDisplay />);

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load historical data. Please try again.');
    });
  });

  it('displays placeholder for no data scenario', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: null }),
    });

    render(<HistoricalDataDisplay />);

    // Wait for placeholder message
    await waitFor(() => {
      expect(screen.getByText('No historical data available for the past 7 days')).toBeInTheDocument();
    });
  });

  it('handles partial data with some missing dates', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-07': 68,
          '2025-11-09': 72,
          '2025-11-11': 69,
          '2025-11-13': 66,
        }
      }),
    });

    render(<HistoricalDataDisplay />);

    // Wait for graph to be displayed (should handle null values)
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});

describe('HistoricalDataDisplay - Graph Rendering', () => {
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

  it('graph renders with correct data structure', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
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

    render(<HistoricalDataDisplay />);

    await waitFor(() => {
      const lineChart = screen.getByTestId('line-chart');
      expect(lineChart).toBeInTheDocument();

      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');
      expect(chartData).toHaveLength(7);
      expect(chartData[0]).toHaveProperty('date');
      expect(chartData[0]).toHaveProperty('temperature');
    });
  });

  it('graph displays all 7 date labels on X-axis', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
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

    render(<HistoricalDataDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');
      expect(chartData).toHaveLength(7);
    });
  });

  it('graph handles null temperature values (gaps in line)', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-07': 68,
          '2025-11-09': 72,
          '2025-11-13': 66,
        }
      }),
    });

    render(<HistoricalDataDisplay />);

    await waitFor(() => {
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');

      // Should have 7 data points (some with null temperatures)
      expect(chartData).toHaveLength(7);

      // Some temperatures should be null
      const nullCount = chartData.filter((d: any) => d.temperature === null).length;
      expect(nullCount).toBeGreaterThan(0);
    });
  });

  it('loading spinner displays during data fetch', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({
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
          }), 100)
        )
    );

    render(<HistoricalDataDisplay />);

    // Initially should show spinner
    expect(screen.getByRole('status')).toBeInTheDocument();

    // After loading, graph should be visible
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  it('all Recharts components are rendered', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
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

    render(<HistoricalDataDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('line')).toBeInTheDocument();
    });
  });
});

describe('HistoricalDataDisplay - Styling', () => {
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

  it('component has correct CSS class names applied', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
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

    const { container } = render(<HistoricalDataDisplay />);

    await waitFor(() => {
      const containerDiv = container.querySelector('[class*="container"]');
      expect(containerDiv).toBeInTheDocument();

      const chartContainer = container.querySelector('[class*="chartContainer"]');
      expect(chartContainer).toBeInTheDocument();
    });
  });

  it('container maintains semantic structure', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
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

    const { container } = render(<HistoricalDataDisplay />);

    await waitFor(() => {
      const containerDiv = container.querySelector('[class*="container"]');
      expect(containerDiv).toBeInTheDocument();

      // Verify chartContainer is inside container
      const chartContainer = containerDiv?.querySelector('[class*="chartContainer"]');
      expect(chartContainer).toBeInTheDocument();
    });
  });

  it('placeholder text has correct CSS class', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: null }),
    });

    const { container } = render(<HistoricalDataDisplay />);

    await waitFor(() => {
      const placeholderText = container.querySelector('[class*="placeholderText"]');
      expect(placeholderText).toBeInTheDocument();
      expect(placeholderText?.tagName).toBe('P');
    });
  });

  it('spinner has correct CSS class and attributes', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({
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
          }), 100)
        )
    );

    const { container } = render(<HistoricalDataDisplay />);

    const spinner = container.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading historical data');
  });
});
