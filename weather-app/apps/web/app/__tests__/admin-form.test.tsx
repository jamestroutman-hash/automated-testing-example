/**
 * Tests for WeatherForm component
 * Focus on core form rendering, blur validation, and submission behavior
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherForm } from '../admin/WeatherForm';

// Mock the validation functions
jest.mock('../../lib/validation', () => ({
  validateTemperature: jest.fn((temp: number) => {
    if (typeof temp !== 'number' || isNaN(temp)) {
      return { field: 'temperature', message: 'Temperature must be a numeric value' };
    }
    if (temp < -50 || temp > 150) {
      return { field: 'temperature', message: 'Temperature must be between -50 to 150 Fahrenheit' };
    }
    return null;
  }),
  validateDate: jest.fn((date: string) => {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(date)) {
      return { field: 'date', message: 'Date must be in YYYY-MM-DD format' };
    }
    return null;
  }),
  validateZipcode: jest.fn((zipcode: string) => {
    const zipcodeRegex = /^\d{5}$/;
    if (!zipcodeRegex.test(zipcode)) {
      return { field: 'zipcode', message: 'Zipcode must be exactly 5 numeric digits' };
    }
    return null;
  }),
}));

describe('WeatherForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all three required fields', () => {
    render(<WeatherForm />);

    // Check for temperature field
    expect(screen.getByLabelText(/temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temperature/i)).toHaveAttribute('type', 'number');

    // Check for date field
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toHaveAttribute('type', 'date');

    // Check for zipcode field
    expect(screen.getByLabelText(/zipcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zipcode/i)).toHaveAttribute('type', 'text');

    // Check for submit button
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('triggers blur validation when leaving temperature field with invalid value', async () => {
    render(<WeatherForm />);

    const temperatureInput = screen.getByLabelText(/temperature/i);

    // Enter invalid temperature (out of range)
    fireEvent.change(temperatureInput, { target: { value: '200' } });
    fireEvent.blur(temperatureInput);

    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -50 to 150 fahrenheit/i)).toBeInTheDocument();
    });
  });

  it('triggers blur validation when leaving zipcode field with invalid format', async () => {
    render(<WeatherForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Enter invalid zipcode (not 5 digits)
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/zipcode must be exactly 5 numeric digits/i)).toBeInTheDocument();
    });
  });

  it('displays validation errors at top of form', async () => {
    render(<WeatherForm />);

    const temperatureInput = screen.getByLabelText(/temperature/i);

    // Trigger validation error
    fireEvent.change(temperatureInput, { target: { value: '200' } });
    fireEvent.blur(temperatureInput);

    // Check that error display area exists and shows the error
    await waitFor(() => {
      const errorDisplay = screen.getByRole('alert');
      expect(errorDisplay).toBeInTheDocument();
      expect(errorDisplay).toHaveTextContent(/temperature/i);
    });
  });

  it('prevents form submission when validation errors exist', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    render(<WeatherForm />);

    const temperatureInput = screen.getByLabelText(/temperature/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Enter invalid temperature
    fireEvent.change(temperatureInput, { target: { value: '200' } });
    fireEvent.blur(temperatureInput);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -50 to 150 fahrenheit/i)).toBeInTheDocument();
    });

    // Try to submit
    fireEvent.click(submitButton);

    // Fetch should not be called because validation errors exist
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('clears validation error when field is corrected', async () => {
    render(<WeatherForm />);

    const temperatureInput = screen.getByLabelText(/temperature/i);

    // Enter invalid temperature
    fireEvent.change(temperatureInput, { target: { value: '200' } });
    fireEvent.blur(temperatureInput);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/temperature must be between -50 to 150 fahrenheit/i)).toBeInTheDocument();
    });

    // Correct the temperature
    fireEvent.change(temperatureInput, { target: { value: '75' } });
    fireEvent.blur(temperatureInput);

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/temperature must be between -50 to 150 fahrenheit/i)).not.toBeInTheDocument();
    });
  });
});
