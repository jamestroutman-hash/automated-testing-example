/**
 * Tests for ProfileForm component
 * Task Group 2: Core Feature - ProfileForm Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileForm } from '../profile/ProfileForm';

// Mock the validation function
jest.mock('../../lib/validation', () => ({
  validateZipcode: jest.fn((zipcode: string) => {
    const zipcodeRegex = /^\d{5}$/;
    if (!zipcodeRegex.test(zipcode)) {
      return { field: 'zipcode', message: 'Zipcode must be exactly 5 numeric digits' };
    }
    return null;
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ProfileForm', () => {
  let mockLocalStorage: { [key: string]: string } = {};

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
  });

  it('renders with empty state on first load', () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    expect(zipcodeInput).toBeInTheDocument();
    expect(zipcodeInput).toHaveValue('');
    expect(screen.getByText(/no zipcode saved yet/i)).toBeInTheDocument();
  });

  it('accepts and displays user input', () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    fireEvent.change(zipcodeInput, { target: { value: '12345' } });

    expect(zipcodeInput).toHaveValue('12345');
  });

  it('triggers validation on blur with invalid zipcode format', async () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Enter invalid zipcode (not 5 digits)
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/zipcode must be exactly 5 numeric digits/i)).toBeInTheDocument();
    });
  });

  it('writes to localStorage on successful save', async () => {
    const toast = require('react-hot-toast').default;

    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    const saveButton = screen.getByRole('button', { name: /save zipcode/i });

    // Enter valid zipcode
    fireEvent.change(zipcodeInput, { target: { value: '12345' } });

    // Click save button
    fireEvent.click(saveButton);

    // Wait for save to complete
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('userZipcode', '12345');
      expect(toast.success).toHaveBeenCalledWith('Zipcode saved successfully!');
    });
  });

  it('loads saved zipcode from localStorage on mount', () => {
    // Set a saved zipcode in localStorage
    mockLocalStorage['userZipcode'] = '90210';

    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    expect(zipcodeInput).toHaveValue('90210');
  });

  it('displays success toast after save', async () => {
    const toast = require('react-hot-toast').default;

    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    const saveButton = screen.getByRole('button', { name: /save zipcode/i });

    // Enter valid zipcode
    fireEvent.change(zipcodeInput, { target: { value: '10001' } });

    // Click save button
    fireEvent.click(saveButton);

    // Wait for success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Zipcode saved successfully!');
    });
  });

  it('disables save button when validation errors exist', async () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    const saveButton = screen.getByRole('button', { name: /save zipcode/i });

    // Enter invalid zipcode
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/zipcode must be exactly 5 numeric digits/i)).toBeInTheDocument();
    });

    // Save button should be disabled
    expect(saveButton).toBeDisabled();
  });

  it('clears validation error when input is corrected', async () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Enter invalid zipcode
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/zipcode must be exactly 5 numeric digits/i)).toBeInTheDocument();
    });

    // Correct the zipcode
    fireEvent.change(zipcodeInput, { target: { value: '12345' } });
    fireEvent.blur(zipcodeInput);

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/zipcode must be exactly 5 numeric digits/i)).not.toBeInTheDocument();
    });
  });
});
