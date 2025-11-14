/**
 * Tests for ProfileForm component validation
 * Focus on zipcode validation and consistent error display
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileForm } from '../profile/ProfileForm';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ProfileForm validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('validates zipcode format client-side', async () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);
    const saveButton = screen.getByRole('button', { name: /save/i });

    // Enter invalid zipcode (not 5 digits)
    fireEvent.change(zipcodeInput, { target: { value: '123' } });
    fireEvent.blur(zipcodeInput);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid zipcode format. must be 5 digits/i)).toBeInTheDocument();
    });

    // Save button should be disabled
    expect(saveButton).toBeDisabled();

    // Correct the zipcode
    fireEvent.change(zipcodeInput, { target: { value: '12345' } });
    fireEvent.blur(zipcodeInput);

    // Error should clear and button should be enabled
    await waitFor(() => {
      expect(screen.queryByText(/invalid zipcode format/i)).not.toBeInTheDocument();
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('rejects zipcode with letters', async () => {
    render(<ProfileForm />);

    const zipcodeInput = screen.getByLabelText(/zipcode/i);

    // Enter zipcode with letters
    fireEvent.change(zipcodeInput, { target: { value: '1234A' } });
    fireEvent.blur(zipcodeInput);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid zipcode format. must be 5 digits/i)).toBeInTheDocument();
    });
  });

  it('shows success toast on successful save', async () => {
    render(<ProfileForm />);

    // Enter valid zipcode
    fireEvent.change(screen.getByLabelText(/zipcode/i), { target: { value: '12345' } });

    // Click save button
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Zipcode saved successfully!');
    });

    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userZipcode', '12345');
  });
});
