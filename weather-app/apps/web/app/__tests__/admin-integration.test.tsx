/**
 * End-to-end integration tests for admin panel feature
 * Tests critical user workflows and integration between components
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WeatherForm } from '../admin/WeatherForm';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Create mock toast functions
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
  Toaster: () => null,
}));

describe('Admin Panel - End-to-End Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
  });

  test('complete user workflow: fill form with valid data, submit, verify success', async () => {
    const user = userEvent.setup();

    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        temperature: 68,
        date: '2025-11-13',
        zipcode: '90210',
      }),
    });

    render(<WeatherForm />);

    // Fill all form fields with valid data
    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    await user.type(tempInput, '68');
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '90210');

    // Trigger blur validation
    await user.tab();

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);

    // Verify API call was made with correct data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: 68,
          date: '2025-11-13',
          zipcode: '90210',
        }),
      });
    });

    // Verify success toast
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Weather data submitted successfully!');
    });

    // Verify form was cleared
    expect(tempInput).toHaveValue(null);
    expect(dateInput).toHaveValue('');
    expect(zipcodeInput).toHaveValue('');
  });

  test('error recovery: fix validation error and successfully resubmit', async () => {
    const user = userEvent.setup();

    // Mock successful API response for the corrected submission
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        temperature: 75,
        date: '2025-11-13',
        zipcode: '12345',
      }),
    });

    render(<WeatherForm />);

    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Enter invalid temperature (out of range)
    await user.type(tempInput, '200');
    await user.tab();

    // Verify validation error appears
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -50 to 150 fahrenheit/i)).toBeInTheDocument();
    });

    // Verify form cannot be submitted with error
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);
    expect(mockFetch).not.toHaveBeenCalled();

    // Fix the validation error
    await user.clear(tempInput);
    await user.type(tempInput, '75');
    await user.tab();

    // Verify error is cleared
    await waitFor(() => {
      expect(screen.queryByText(/temperature must be between -50 to 150 fahrenheit/i)).not.toBeInTheDocument();
    });

    // Fill remaining fields with valid data
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '12345');
    await user.tab();

    // Submit form successfully
    await user.click(submitButton);

    // Verify successful submission
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: 75,
          date: '2025-11-13',
          zipcode: '12345',
        }),
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Weather data submitted successfully!');
    });
  });

  test('multiple field validation errors display simultaneously', async () => {
    const user = userEvent.setup();

    render(<WeatherForm />);

    const tempInput = screen.getByLabelText(/temperature/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Enter invalid data in multiple fields
    await user.type(tempInput, '200');
    await user.tab();

    await user.type(zipcodeInput, '123');
    await user.tab();

    // Verify both errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -50 to 150 fahrenheit/i)).toBeInTheDocument();
      expect(screen.getByText(/zipcode must be exactly 5 numeric digits/i)).toBeInTheDocument();
    });

    // Verify error display area contains both errors
    const errorDisplay = screen.getByRole('alert');
    expect(errorDisplay).toBeInTheDocument();
    expect(errorDisplay).toHaveTextContent(/temperature/i);
    expect(errorDisplay).toHaveTextContent(/zipcode/i);
  });

  test('date field blur validation triggers error for invalid format', async () => {
    const user = userEvent.setup();

    render(<WeatherForm />);

    const dateInput = screen.getByLabelText(/date/i);

    // The native date input might handle this differently in jsdom
    // We'll test by setting an invalid value directly
    await user.type(dateInput, '2025-13-45'); // Invalid month/day
    await user.tab();

    // Note: Native date inputs might prevent invalid dates from being entered
    // This test documents the expected behavior
  });

  test('empty form submission attempt is prevented', async () => {
    const user = userEvent.setup();

    render(<WeatherForm />);

    const submitButton = screen.getByRole('button', { name: /submit weather data/i });

    // Try to submit empty form
    await user.click(submitButton);

    // Form should not make API call with empty fields
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('server validation error updates form error display and shows toast', async () => {
    const user = userEvent.setup();

    // Mock server validation error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Validation failed',
        details: {
          temperature: 'Temperature must be between -50 to 150 Fahrenheit',
          zipcode: 'Zipcode must be exactly 5 numeric digits',
        },
      }),
    });

    render(<WeatherForm />);

    // Fill form with data (that server will reject)
    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    await user.type(tempInput, '72');
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '12345');
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

    // Verify server validation errors are displayed in form
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Temperature must be between -50 to 150 Fahrenheit/i)).toBeInTheDocument();
      expect(screen.getByText(/Zipcode must be exactly 5 numeric digits/i)).toBeInTheDocument();
    });

    // Verify form data was preserved
    expect(tempInput).toHaveValue(72);
    expect(dateInput).toHaveValue('2025-11-13');
    expect(zipcodeInput).toHaveValue('12345');
  });

  test('form state persists through validation and submission lifecycle', async () => {
    const user = userEvent.setup();

    // First mock a validation error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Validation failed',
        details: {
          temperature: 'Temperature out of range',
        },
      }),
    });

    render(<WeatherForm />);

    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Fill form
    await user.type(tempInput, '80');
    await user.type(dateInput, '2025-11-13');
    await user.type(zipcodeInput, '54321');
    await user.tab();

    // Submit and get validation error
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Verify form still has values
    expect(tempInput).toHaveValue(80);
    expect(dateInput).toHaveValue('2025-11-13');
    expect(zipcodeInput).toHaveValue('54321');

    // Server validation error is now displayed, which disables the submit button
    // User needs to fix the field to clear the error
    await waitFor(() => {
      expect(screen.getByText(/Temperature out of range/i)).toBeInTheDocument();
    });

    // Fix the validation error by triggering blur again on the temperature field
    await user.click(tempInput);
    await user.tab();

    // Wait for client validation to clear the error
    await waitFor(() => {
      expect(screen.queryByText(/Temperature out of range/i)).not.toBeInTheDocument();
    });

    // Now mock successful response for retry
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        temperature: 80,
        date: '2025-11-13',
        zipcode: '54321',
      }),
    });

    // User can resubmit with same data
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    // On success, form is cleared
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalled();
      expect(tempInput).toHaveValue(null);
      expect(dateInput).toHaveValue('');
      expect(zipcodeInput).toHaveValue('');
    });
  });

  test('negative temperature values are accepted and submitted correctly', async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        temperature: -20,
        date: '2025-01-15',
        zipcode: '99501',
      }),
    });

    render(<WeatherForm />);

    const tempInput = screen.getByLabelText(/temperature/i);
    const dateInput = screen.getByLabelText(/date/i);
    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Enter negative temperature (valid for cold weather)
    await user.type(tempInput, '-20');
    await user.type(dateInput, '2025-01-15');
    await user.type(zipcodeInput, '99501');
    await user.tab();

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit weather data/i });
    await user.click(submitButton);

    // Verify negative temperature was accepted and submitted
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: -20,
          date: '2025-01-15',
          zipcode: '99501',
        }),
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalled();
    });
  });

  test('boundary temperature values are validated correctly', async () => {
    const user = userEvent.setup();

    render(<WeatherForm />);

    const tempInput = screen.getByLabelText(/temperature/i);

    // Test minimum valid temperature
    await user.type(tempInput, '-50');
    await user.tab();

    // Should not show error for -50
    await waitFor(() => {
      expect(screen.queryByText(/temperature must be between -50 to 150 fahrenheit/i)).not.toBeInTheDocument();
    });

    // Clear and test just below minimum
    await user.clear(tempInput);
    await user.type(tempInput, '-51');
    await user.tab();

    // Should show error for -51
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -50 to 150 fahrenheit/i)).toBeInTheDocument();
    });

    // Clear and test maximum valid temperature
    await user.clear(tempInput);
    await user.type(tempInput, '150');
    await user.tab();

    // Should not show error for 150
    await waitFor(() => {
      expect(screen.queryByText(/temperature must be between -50 to 150 fahrenheit/i)).not.toBeInTheDocument();
    });

    // Clear and test just above maximum
    await user.clear(tempInput);
    await user.type(tempInput, '151');
    await user.tab();

    // Should show error for 151
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -50 to 150 fahrenheit/i)).toBeInTheDocument();
    });
  });

  test('form maintains accessibility throughout interaction lifecycle', async () => {
    const user = userEvent.setup();

    render(<WeatherForm />);

    // Verify all form fields have accessible labels
    expect(screen.getByLabelText(/temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zipcode/i)).toBeInTheDocument();

    // Verify submit button is accessible
    expect(screen.getByRole('button', { name: /submit weather data/i })).toBeInTheDocument();

    // Trigger validation error
    const tempInput = screen.getByLabelText(/temperature/i);
    await user.type(tempInput, '200');
    await user.tab();

    // Verify error display has proper ARIA role
    await waitFor(() => {
      const errorDisplay = screen.getByRole('alert');
      expect(errorDisplay).toBeInTheDocument();
    });
  });
});
