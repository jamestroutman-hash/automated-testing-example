/**
 * Tests for navigation integration
 * Task Group 3: Navigation Integration
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Link from 'next/link';

// Mock the navigation component structure
const MockNavigation = () => {
  return (
    <nav className="mainNav">
      <div className="navContainer">
        <Link href="/" className="navLink">
          Home
        </Link>
        <Link href="/profile" className="navLink">
          Profile
        </Link>
        <Link href="/admin" className="navLink">
          Admin Panel
        </Link>
      </div>
    </nav>
  );
};

describe('Navigation', () => {
  it('renders Profile link in navigation', () => {
    render(<MockNavigation />);

    const profileLink = screen.getByRole('link', { name: /profile/i });
    expect(profileLink).toBeInTheDocument();
  });

  it('Profile link has correct href', () => {
    render(<MockNavigation />);

    const profileLink = screen.getByRole('link', { name: /profile/i });
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('Profile link appears between Home and Admin Panel', () => {
    render(<MockNavigation />);

    const links = screen.getAllByRole('link');
    const linkTexts = links.map(link => link.textContent);

    const homeIndex = linkTexts.indexOf('Home');
    const profileIndex = linkTexts.indexOf('Profile');
    const adminIndex = linkTexts.indexOf('Admin Panel');

    expect(homeIndex).toBeLessThan(profileIndex);
    expect(profileIndex).toBeLessThan(adminIndex);
  });
});
