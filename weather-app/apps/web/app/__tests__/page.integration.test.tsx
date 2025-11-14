/**
 * Integration tests for ForecastDataDisplay on Home Page
 * Task Group 3: Home Page Integration
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

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
  Line: ({ stroke }: { stroke: string }) => <div data-testid="line" data-stroke={stroke} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

import HomePage from '../page';

describe('Home Page - ForecastDataDisplay Integration', () => {
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

  it('ForecastDataDisplay component renders in correct section', async () => {
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

    const { container } = render(<HomePage />);

    // Wait for forecast section to render
    await waitFor(() => {
      expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
    });

    // Verify the forecast section exists in the correct location
    const forecastSection = container.querySelector('[class*="forecastSection"]');
    expect(forecastSection).toBeInTheDocument();
  });

  it('component appears alongside CurrentTemperatureDisplay and HistoricalDataDisplay', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-07': 65,
          '2025-11-08': 66,
          '2025-11-09': 67,
          '2025-11-10': 68,
          '2025-11-11': 69,
          '2025-11-12': 70,
          '2025-11-13': 71,
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

    const { container } = render(<HomePage />);

    // Wait for all components to render
    await waitFor(() => {
      expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
    });

    // Verify all three sections exist
    const currentTempSection = container.querySelector('[class*="currentTempSection"]');
    const historicalSection = container.querySelector('[class*="historicalSection"]');
    const forecastSection = container.querySelector('[class*="forecastSection"]');

    expect(currentTempSection).toBeInTheDocument();
    expect(historicalSection).toBeInTheDocument();
    expect(forecastSection).toBeInTheDocument();
  });

  it('page layout maintains proper structure with all three sections', async () => {
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

    const { container } = render(<HomePage />);

    // Wait for forecast section to render
    await waitFor(() => {
      expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
    });

    // Verify page title exists
    expect(screen.getByText('Veritas Weather')).toBeInTheDocument();

    // Verify main container structure
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();

    // Verify all three sections are within main
    const sections = container.querySelectorAll('[class*="section"]');
    expect(sections.length).toBe(3);
  });

  it('no conflicts with existing components', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          '2025-11-07': 65,
          '2025-11-08': 66,
          '2025-11-09': 67,
          '2025-11-10': 68,
          '2025-11-11': 69,
          '2025-11-12': 70,
          '2025-11-13': 71,
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

    render(<HomePage />);

    // Wait for all components to render
    await waitFor(() => {
      expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
    });

    // Verify fetch was called (both historical and forecast components fetch data)
    expect(mockFetch).toHaveBeenCalled();

    // Verify multiple responsive containers (one for historical, one for forecast)
    const containers = screen.getAllByTestId('responsive-container');
    expect(containers.length).toBeGreaterThanOrEqual(2);
  });
});
