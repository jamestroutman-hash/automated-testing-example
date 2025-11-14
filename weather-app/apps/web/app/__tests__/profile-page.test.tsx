/**
 * Tests for Profile Page structure and basic rendering
 * Task Group 1: Foundation - Page Route & Structure
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '../profile/page';

describe('Profile Page', () => {
  it('renders without errors', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/user profile/i)).toBeInTheDocument();
  });

  it('displays page title', () => {
    render(<ProfilePage />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/user profile/i);
  });

  it('displays page description', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/save your preferred zipcode/i)).toBeInTheDocument();
  });

  it('renders form container', () => {
    render(<ProfilePage />);
    // Check that the form is present (via ProfileForm component)
    expect(screen.getByLabelText(/zipcode/i)).toBeInTheDocument();
  });
});
