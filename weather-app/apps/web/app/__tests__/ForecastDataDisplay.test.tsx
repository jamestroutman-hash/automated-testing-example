/**
 * Unit tests for ForecastDataDisplay Component
 * Task Group 1: Frontend Component Implementation
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

import { ForecastDataDisplay } from '../ForecastDataDisplay';

describe('ForecastDataDisplay - Component Behavior', () => {
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

  it('renders loading spinner during data fetch', async () => {
    mockLocalStorage['userZipcode'] = '10001';
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
          }), 100)
        )
    );

    render(<ForecastDataDisplay />);

    // Loading spinner should be visible
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading forecast data');
  });

  it('shows error toast when zipcode is missing', async () => {
    mockLocalStorage['userZipcode'] = '';

    render(<ForecastDataDisplay />);

    // Wait for toast error to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please configure your zipcode in the profile page');
    });

    // Component should return null (not render anything)
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });

  it('displays placeholder when no forecast data exists', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: null }),
    });

    render(<ForecastDataDisplay />);

    // Wait for placeholder message
    await waitFor(() => {
      expect(screen.getByText('No forecast data available for the next 7 days')).toBeInTheDocument();
    });
  });

  it('renders chart with correct data structure', async () => {
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

    // Wait for graph to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    // Verify fetch was called with correct zipcode
    expect(mockFetch).toHaveBeenCalledWith('/api/weather?zipcode=10001');

    // Verify chart has correct structure
    const lineChart = screen.getByTestId('line-chart');
    const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');
    expect(chartData).toHaveLength(7);
    expect(chartData[0]).toHaveProperty('date');
    expect(chartData[0]).toHaveProperty('temperature');
  });

  it('formats dates correctly with Mon, Nov 11 format', async () => {
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
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');

      // Verify date format includes day name, month name, and day number
      expect(chartData[0].date).toMatch(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2}$/);
    });
  });

  it('calculates future dates correctly (days +1 through +7)', async () => {
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
      // Verify API was called
      expect(mockFetch).toHaveBeenCalled();

      // Verify we got 7 data points (one for each day +1 through +7)
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '[]');
      expect(chartData).toHaveLength(7);
    });
  });

  it('handles API errors with toast notification', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<ForecastDataDisplay />);

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load forecast data. Please try again.');
    });
  });

  it('renders section heading "7-Day Forecast"', async () => {
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
      expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
    });
  });
});
