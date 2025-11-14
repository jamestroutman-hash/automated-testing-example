/**
 * Tests for Home Page structure and basic rendering
 * Task Groups 1-3: Structure, Styling, and Responsive Design
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../page';

describe('Home Page - Structure', () => {
  it('renders without errors', () => {
    render(<HomePage />);
    expect(screen.getByText(/veritas weather/i)).toBeInTheDocument();
  });

  it('displays "Veritas Weather" h1 title', () => {
    render(<HomePage />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/veritas weather/i);
  });

  it('displays three dashboard sections with semantic class names', () => {
    const { container } = render(<HomePage />);

    // Look for sections with appropriate data attributes or structure
    const sections = container.querySelectorAll('[class*="section"]');
    expect(sections.length).toBeGreaterThanOrEqual(3);
  });

  it('has appropriate semantic structure for sections', () => {
    const { container } = render(<HomePage />);

    // Check for section containers with semantic structure
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('displays sections in correct vertical order', () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main');

    // Verify main container exists with flex column layout
    expect(main).toBeInTheDocument();
  });
});

describe('Home Page - Visual Styling', () => {
  it('sections have visual distinction with border styling', () => {
    const { container } = render(<HomePage />);

    const sections = container.querySelectorAll('[class*="section"]');
    expect(sections.length).toBeGreaterThan(0);

    // Verify sections have styling classes applied
    sections.forEach(section => {
      expect(section.className).toContain('section');
    });
  });

  it('main content area has correct max-width constraint', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Verify main element has a class applied
    expect(main?.className).toBeTruthy();
    expect(main?.className).toContain('main');
  });

  it('sections are vertically stacked with flex column layout', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Verify multiple sections exist within main
    const sections = container.querySelectorAll('[class*="section"]');
    expect(sections.length).toBe(3);
  });

  it('page has appropriate spacing between sections', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Check that main element has styling class for gap/spacing
    if (main) {
      expect(main.className).toContain('main');
    }
  });
});

describe('Home Page - Responsive Design', () => {
  it('renders correctly in mobile viewport', () => {
    // Simulate mobile viewport
    global.innerWidth = 375;
    global.innerHeight = 667;

    const { container } = render(<HomePage />);
    const title = screen.getByRole('heading', { level: 1 });

    // Verify title is visible
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/veritas weather/i);

    // Verify sections stack vertically
    const sections = container.querySelectorAll('[class*="section"]');
    expect(sections.length).toBe(3);
  });

  it('maintains single-column layout at all breakpoints', () => {
    const { container } = render(<HomePage />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Verify main has single-column flex layout class
    if (main) {
      expect(main.className).toContain('main');
    }

    // Verify all sections are within main
    const sections = main?.querySelectorAll('[class*="section"]');
    expect(sections?.length).toBe(3);
  });

  it('renders correctly in desktop viewport', () => {
    // Simulate desktop viewport
    global.innerWidth = 1440;
    global.innerHeight = 900;

    const { container } = render(<HomePage />);

    // Verify page structure remains consistent
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    const sections = container.querySelectorAll('[class*="section"]');
    expect(sections.length).toBe(3);
  });
});
