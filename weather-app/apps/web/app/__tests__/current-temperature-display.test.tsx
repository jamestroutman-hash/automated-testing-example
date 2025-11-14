/**
 * Tests for CurrentTemperatureDisplay component
 * Task Group 1: Frontend Component Development
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

describe('CurrentTemperatureDisplay', () => {
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

  it('displays loading spinner while fetching data', async () => {
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

    render(<CurrentTemperatureDisplay />);

    // Loading spinner should be visible initially
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays temperature value when API returns data', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 72 }),
    });

    render(<CurrentTemperatureDisplay />);

    // Wait for temperature to be displayed
    await waitFor(() => {
      expect(screen.getByText('72°F')).toBeInTheDocument();
    });
  });

  it('displays placeholder message when API returns null temperature', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: null }),
    });

    render(<CurrentTemperatureDisplay />);

    // Wait for placeholder message to be displayed
    await waitFor(() => {
      expect(screen.getByText('No temperature data available for today')).toBeInTheDocument();
    });
  });

  it('shows toast notification when zipcode is missing from localStorage', async () => {
    // No zipcode in localStorage
    mockLocalStorage = {};

    render(<CurrentTemperatureDisplay />);

    // Wait for toast notification
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please configure your zipcode in the profile page');
    });
  });

  it('shows toast notification when API request fails', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<CurrentTemperatureDisplay />);

    // Wait for error toast notification
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load temperature data. Please try again.');
    });
  });

  it('correctly handles temperature value of 0', async () => {
    mockLocalStorage['userZipcode'] = '10001';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ temperature: 0 }),
    });

    render(<CurrentTemperatureDisplay />);

    // Wait for temperature to be displayed (should show "0°F", not placeholder)
    await waitFor(() => {
      expect(screen.getByText('0°F')).toBeInTheDocument();
    });
  });
});
