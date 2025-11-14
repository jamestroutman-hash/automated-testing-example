/**
 * Integration tests for Profile feature
 * Task Group 4: Testing & Quality Assurance
 * Focus on end-to-end workflows and integration points
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
  Toaster: () => <div data-testid="toaster" />,
}));

describe('Profile Integration Tests', () => {
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

  it('completes end-to-end profile update workflow', async () => {
    const toast = require('react-hot-toast').default;

    render(<ProfileForm />);

    // User navigates to profile page - verify form is present
    expect(screen.getByLabelText(/zipcode/i)).toBeInTheDocument();

    // User enters zipcode
    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    fireEvent.change(zipcodeInput, { target: { value: '12345' } });

    // User saves zipcode
    const saveButton = screen.getByRole('button', { name: /save zipcode/i });
    fireEvent.click(saveButton);

    // Verify zipcode is persisted to localStorage
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('userZipcode', '12345');
      expect(toast.success).toHaveBeenCalledWith('Zipcode saved successfully!');
    });
  });

  it('maintains localStorage persistence across page refreshes', () => {
    // Save zipcode in first render
    mockLocalStorage['userZipcode'] = '90210';

    // First render - verify saved zipcode is loaded
    const { unmount } = render(<ProfileForm />);
    let zipcodeInput = screen.getByLabelText(/zipcode/i);
    expect(zipcodeInput).toHaveValue('90210');

    // Unmount component (simulating page refresh)
    unmount();

    // Second render - verify zipcode persists
    render(<ProfileForm />);
    zipcodeInput = screen.getByLabelText(/zipcode/i);
    expect(zipcodeInput).toHaveValue('90210');
  });

  it('handles error state to success state transition', async () => {
    const toast = require('react-hot-toast').default;

    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    const saveButton = screen.getByRole('button', { name: /save zipcode/i });

    // Enter invalid zipcode and trigger validation
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/zipcode must be exactly 5 numeric digits/i)).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });

    // Correct the input
    fireEvent.change(zipcodeInput, { target: { value: '12345' } });
    fireEvent.blur(zipcodeInput);

    // Verify error is cleared
    await waitFor(() => {
      expect(screen.queryByText(/zipcode must be exactly 5 numeric digits/i)).not.toBeInTheDocument();
      expect(saveButton).not.toBeDisabled();
    });

    // Save successfully
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('userZipcode', '12345');
      expect(toast.success).toHaveBeenCalledWith('Zipcode saved successfully!');
    });
  });

  it('displays empty state for first-time users', () => {
    // Ensure no saved zipcode exists
    mockLocalStorage = {};

    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    expect(zipcodeInput).toHaveValue('');
    expect(screen.getByText(/no zipcode saved yet/i)).toBeInTheDocument();
  });

  it('handles multiple save operations correctly', async () => {
    const toast = require('react-hot-toast').default;

    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    const saveButton = screen.getByRole('button', { name: /save zipcode/i });

    // First save
    fireEvent.change(zipcodeInput, { target: { value: '10001' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('userZipcode', '10001');
    });

    // Second save with different zipcode
    fireEvent.change(zipcodeInput, { target: { value: '90210' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('userZipcode', '90210');
      expect(toast.success).toHaveBeenCalledTimes(2);
    });
  });

  it('validates accessibility with proper ARIA attributes', async () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Trigger validation error
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Check for role="alert" on error display
    await waitFor(() => {
      const errorDisplay = screen.getByRole('alert');
      expect(errorDisplay).toBeInTheDocument();
      expect(errorDisplay).toHaveTextContent(/zipcode must be exactly 5 numeric digits/i);
    });
  });
});
