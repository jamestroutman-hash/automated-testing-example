/**
 * Form submission integration tests
 * Tests API integration, response handling, and toast notifications
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Create mock toast functions that will be accessible in the mock module
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

// Mock react-hot-toast before importing WeatherForm
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
  Toaster: () => null,
}));

// Import component after mocking
import { WeatherForm } from '../WeatherForm';

describe('WeatherForm - API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
  });

  test('successful submission (201) clears form and shows success toast', async () => {
    const user = userEvent.setup();

    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        temperature: 72,
        date: '2025-11-13',
        zipcode: '12345',
      }),
    });

    render(<WeatherForm />);

    // Fill form with valid data
    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    await user.type(tempInput, '72');
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '12345');

    // Blur to trigger validation
    await user.tab();

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);

    // Wait for API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: 72,
          date: '2025-11-13',
          zipcode: '12345',
        }),
      });
    });

    // Verify success toast was shown
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Weather data submitted successfully!');
    });

    // Verify form was cleared
    expect(tempInput).toHaveValue(null);
    expect(dateInput).toHaveValue('');
    expect(zipcodeInput).toHaveValue('');
  });

  test('validation error response (400) displays error toast and preserves form data', async () => {
    const user = userEvent.setup();

    // Mock validation error API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Validation failed',
        details: {
          temperature: 'Temperature must be between -50 to 150 Fahrenheit',
        },
      }),
    });

    render(<WeatherForm />);

    // Fill form with data that will trigger server validation error
    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    await user.type(tempInput, '72');
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '12345');

    // Blur to clear any client-side validation errors
    await user.tab();

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);

    // Wait for API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Verify error toast was shown
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Validation failed');
    });

    // Verify form data was preserved
    expect(tempInput).toHaveValue(72);
    expect(dateInput).toHaveValue('2025-11-13');
    expect(zipcodeInput).toHaveValue('12345');

    // Verify server validation errors are displayed at top of form
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Temperature must be between -50 to 150 Fahrenheit/i)).toBeInTheDocument();
    });
  });

  test('server error response (500) displays error toast and preserves form data', async () => {
    const user = userEvent.setup();

    // Mock server error API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        error: 'An unexpected error occurred',
      }),
    });

    render(<WeatherForm />);

    // Fill form with valid data
    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    await user.type(tempInput, '72');
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '12345');

    // Blur to trigger validation
    await user.tab();

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);

    // Wait for API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Verify error toast was shown
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('An unexpected error occurred');
    });

    // Verify form data was preserved
    expect(tempInput).toHaveValue(72);
    expect(dateInput).toHaveValue('2025-11-13');
    expect(zipcodeInput).toHaveValue('12345');
  });

  test('network failure displays error toast and preserves form data', async () => {
    const user = userEvent.setup();

    // Mock network failure
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<WeatherForm />);

    // Fill form with valid data
    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    await user.type(tempInput, '72');
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '12345');

    // Blur to trigger validation
    await user.tab();

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);

    // Wait for API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Verify network error toast was shown
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Network error. Please check your connection and try again.');
    });

    // Verify form data was preserved
    expect(tempInput).toHaveValue(72);
    expect(dateInput).toHaveValue('2025-11-13');
    expect(zipcodeInput).toHaveValue('12345');
  });
});
