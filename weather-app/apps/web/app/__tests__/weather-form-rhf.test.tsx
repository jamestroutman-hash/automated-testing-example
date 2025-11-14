/**
 * Tests for WeatherForm component with React Hook Form integration
 * Focus on client-side validation, API error handling, and toast notifications
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherForm } from '../admin/WeatherForm';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('WeatherForm with React Hook Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('validates temperature range client-side', async () => {
    render(<WeatherForm />);

    const temperatureInput = screen.getByLabelText(/temperature/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Enter temperature out of range (below -100)
    fireEvent.change(temperatureInput, { target: { value: '-150' } });
    fireEvent.blur(temperatureInput);

    // Wait for client-side validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -100°F and 150°F/i)).toBeInTheDocument();
    });

    // Submit button should be disabled
    expect(submitButton).toBeDisabled();

    // Correct the temperature
    fireEvent.change(temperatureInput, { target: { value: '75' } });
    fireEvent.blur(temperatureInput);

    // Error should clear and button should be enabled
    await waitFor(() => {
      expect(screen.queryByText(/temperature must be between -100°F and 150°F/i)).not.toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('displays field-specific errors from API', async () => {
    // Mock API error response with new format
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: async () => ({
        errors: {
          temperature: 'Temperature must be between -100°F and 150°F',
          zipcode: 'Invalid zipcode format. Must be 5 digits',
        },
      }),
    });

    render(<WeatherForm />);

    // Fill in the form with valid client-side data
    fireEvent.change(screen.getByLabelText(/temperature/i), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-15' } });
    fireEvent.change(screen.getByLabelText(/zipcode/i), { target: { value: '12345' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for API errors to be displayed via toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    // Verify toast was called with field-specific errors
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/temperature|zipcode/i)
    );
  });

  it('disables submit when validation errors exist', async () => {
    render(<WeatherForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Enter invalid zipcode
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid zipcode format/i)).toBeInTheDocument();
    });

    // Submit button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('shows toast notification for API errors', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<WeatherForm />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/temperature/i), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-15' } });
    fireEvent.change(screen.getByLabelText(/zipcode/i), { target: { value: '12345' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for network error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Network error. Please check your connection and try again.'
      );
    });
  });

  it('validates required fields client-side', async () => {
    render(<WeatherForm />);

    const temperatureInput = screen.getByLabelText(/temperature/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Trigger blur on empty field
    fireEvent.blur(temperatureInput);

    // Wait for required field error
    await waitFor(() => {
      expect(screen.getByText(/temperature is required/i)).toBeInTheDocument();
    });

    // Submit button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('shows success toast and clears form on successful submission', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 201,
      json: async () => ({
        zipcode: '12345',
        date: '2025-01-15',
        temperature: 75,
      }),
    });

    render(<WeatherForm />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/temperature/i), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-15' } });
    fireEvent.change(screen.getByLabelText(/zipcode/i), { target: { value: '12345' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Weather data submitted successfully!');
    });

    // Form should be cleared
    expect(screen.getByLabelText(/temperature/i)).toHaveValue(null);
    expect(screen.getByLabelText(/date/i)).toHaveValue('');
    expect(screen.getByLabelText(/zipcode/i)).toHaveValue('');
  });

  it('handles 500 server errors with generic message', async () => {
    // Mock 500 error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: async () => ({
        errors: {
          server: 'An unexpected error occurred',
        },
      }),
    });

    render(<WeatherForm />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/temperature/i), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-15' } });
    fireEvent.change(screen.getByLabelText(/zipcode/i), { target: { value: '12345' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/unexpected error/i)
      );
    });
  });
});
