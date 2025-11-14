/**
 * Extended tests for CurrentTemperatureDisplay component
 * Task Group 4: Test Review & Gap Analysis
 *
 * These tests fill critical gaps in test coverage for date calculation,
 * localStorage error handling, and end-to-end workflows.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-hot-toast BEFORE importing component
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

import { CurrentTemperatureDisplay } from '../CurrentTemperatureDisplay';
import toast from 'react-hot-toast';

describe('CurrentTemperatureDisplay - Extended Coverage', () => {
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

  describe('Date Calculation Edge Cases', () => {
    it('correctly pads single-digit months in date string', async () => {
      mockLocalStorage['userZipcode'] = '10001';

      // Mock Date to return January (month 0)
      const mockDate = new Date(2025, 0, 15); // January 15, 2025
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ temperature: 68 }),
      });

      render(<CurrentTemperatureDisplay />);

      await waitFor(() => {
        // Verify API was called with correctly padded month (01)
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('date=2025-01-15')
        );
      });
    });

    it('correctly pads single-digit days in date string', async () => {
      mockLocalStorage['userZipcode'] = '10001';

      // Mock Date to return 5th day of month
      const mockDate = new Date(2025, 10, 5); // November 5, 2025
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ temperature: 62 }),
      });

      render(<CurrentTemperatureDisplay />);

      await waitFor(() => {
        // Verify API was called with correctly padded day (05)
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('date=2025-11-05')
        );
      });
    });

    it('correctly formats date with both month and day needing padding', async () => {
      mockLocalStorage['userZipcode'] = '10001';

      // Mock Date to return January 5th
      const mockDate = new Date(2025, 0, 5); // January 5, 2025
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ temperature: 55 }),
      });

      render(<CurrentTemperatureDisplay />);

      await waitFor(() => {
        // Verify API was called with both padded month and day
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('date=2025-01-05')
        );
      });
    });
  });

  describe('localStorage Error Handling', () => {
    it('treats empty string zipcode as missing', async () => {
      mockLocalStorage['userZipcode'] = '   '; // Whitespace-only string

      render(<CurrentTemperatureDisplay />);

      // Should show error toast for missing zipcode
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please configure your zipcode in the profile page');
      });

      // Should NOT make API request
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('API Request Formatting', () => {
    it('makes API request with correctly formatted URL', async () => {
      mockLocalStorage['userZipcode'] = '90210';

      const mockDate = new Date(2025, 10, 14); // November 14, 2025
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ temperature: 75 }),
      });

      render(<CurrentTemperatureDisplay />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/weather?zipcode=90210&date=2025-11-14');
      });
    });

    it('handles API response with non-ok status', async () => {
      mockLocalStorage['userZipcode'] = '10001';

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      render(<CurrentTemperatureDisplay />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load temperature data. Please try again.');
      });
    });
  });

  describe('End-to-End Workflows', () => {
    it('complete workflow: user with configured zipcode sees temperature', async () => {
      // Setup: User has zipcode configured
      mockLocalStorage['userZipcode'] = '10001';

      // API returns temperature data
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ temperature: 72 }),
      });

      render(<CurrentTemperatureDisplay />);

      // Workflow verification:
      // 1. Component starts in loading state
      expect(screen.getByRole('status')).toBeInTheDocument();

      // 2. After loading, temperature is displayed
      await waitFor(() => {
        expect(screen.getByText('72°F')).toBeInTheDocument();
      });

      // 3. No error toasts shown
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('complete workflow: user without zipcode gets prompted to configure profile', async () => {
      // Setup: User has NO zipcode configured
      mockLocalStorage = {};

      render(<CurrentTemperatureDisplay />);

      // Workflow verification:
      // 1. Toast notification shown prompting user
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please configure your zipcode in the profile page');
      });

      // 2. No API request made
      expect(mockFetch).not.toHaveBeenCalled();

      // 3. Component renders nothing (or minimal UI)
      expect(screen.queryByText(/°F/)).not.toBeInTheDocument();
      expect(screen.queryByText('No temperature data available for today')).not.toBeInTheDocument();
    });

    it('complete workflow: user sees no data message when weather not recorded', async () => {
      // Setup: User has zipcode configured
      mockLocalStorage['userZipcode'] = '10001';

      // API returns null (no data available)
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ temperature: null }),
      });

      render(<CurrentTemperatureDisplay />);

      // 1. Component shows "no data" message
      await waitFor(() => {
        expect(screen.getByText('No temperature data available for today')).toBeInTheDocument();
      });

      // 2. No error toast shown (this is not an error, just empty state)
      expect(toast.error).not.toHaveBeenCalled();
    });
  });
});
