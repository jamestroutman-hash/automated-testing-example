/**
 * API Layer Tests for Roadmap 8 - Task Group 2
 * Focused tests for API endpoints with new error format and validation
 */

// Mock Next.js server before importing the route handlers
const mockJson = jest.fn();
const mockNextResponse = {
  json: jest.fn((data: any, init?: any) => ({
    json: async () => data,
    status: init?.status || 200,
  })),
};

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: mockNextResponse,
}));

import { validateWeatherData } from '../validation';
import { validateRequiredFields } from '../../../../lib/validation';

describe('API Layer - validateWeatherData with new error format', () => {
  it('should return null for valid weather data', () => {
    const validData = {
      temperature: 75,
      date: '2025-01-15',
      zipcode: '12345',
    };

    const result = validateWeatherData(validData);
    expect(result).toBeNull();
  });

  it('should return errors object with field-specific errors for invalid temperature', () => {
    const invalidData = {
      temperature: 200, // Outside valid range
      date: '2025-01-15',
      zipcode: '12345',
    };

    const result = validateWeatherData(invalidData);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('errors');
    expect(result?.errors).toHaveProperty('temperature');
    expect(result?.errors.temperature).toBe('Temperature must be between -100°F and 150°F');
  });

  it('should return errors object with all field errors when multiple fields are invalid', () => {
    const invalidData = {
      temperature: 200,
      date: '01/15/2025',
      zipcode: '1234',
    };

    const result = validateWeatherData(invalidData);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('errors');
    expect(result?.errors).toHaveProperty('temperature');
    expect(result?.errors).toHaveProperty('date');
    expect(result?.errors).toHaveProperty('zipcode');
  });

  it('should validate temperature type before range checking', () => {
    const invalidData = {
      temperature: 'hot' as any,
      date: '2025-01-15',
      zipcode: '12345',
    };

    const result = validateWeatherData(invalidData);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('errors');
    expect(result?.errors).toHaveProperty('temperature');
    expect(result?.errors.temperature).toBe('Temperature must be a numeric value');
  });
});

describe('API Layer - validateRequiredFields for missing field handling', () => {
  it('should return empty array when all required fields are present', () => {
    const data = {
      temperature: 75,
      date: '2025-01-15',
      zipcode: '12345',
    };

    const errors = validateRequiredFields(data, ['temperature', 'date', 'zipcode']);
    expect(errors).toEqual([]);
  });

  it('should return errors for each missing required field', () => {
    const incompleteData = {
      temperature: 75,
      // Missing date and zipcode
    };

    const errors = validateRequiredFields(incompleteData, ['temperature', 'date', 'zipcode']);
    expect(errors.length).toBe(2);

    const errorFields = errors.map((e) => e.field);
    expect(errorFields).toContain('date');
    expect(errorFields).toContain('zipcode');

    errors.forEach((error) => {
      expect(error.message).toContain('required');
    });
  });

  it('should treat empty string as missing field', () => {
    const dataWithEmptyString = {
      temperature: '',
      date: '2025-01-15',
      zipcode: '12345',
    };

    const errors = validateRequiredFields(dataWithEmptyString, ['temperature', 'date', 'zipcode']);
    expect(errors.length).toBe(1);
    expect(errors[0].field).toBe('temperature');
    expect(errors[0].message).toContain('required');
  });
});

describe('API Layer - Error format consistency', () => {
  it('should use consistent errors object format across all validation failures', () => {
    const testCases = [
      {
        data: { temperature: 200, date: '2025-01-15', zipcode: '12345' },
        expectedFields: ['temperature'],
      },
      {
        data: { temperature: 75, date: '01/15/2025', zipcode: '12345' },
        expectedFields: ['date'],
      },
      {
        data: { temperature: 75, date: '2025-01-15', zipcode: '1234' },
        expectedFields: ['zipcode'],
      },
      {
        data: { temperature: 200, date: '01/15/2025', zipcode: '1234' },
        expectedFields: ['temperature', 'date', 'zipcode'],
      },
    ];

    testCases.forEach((testCase) => {
      const result = validateWeatherData(testCase.data);
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('errors');
      expect(typeof result?.errors).toBe('object');

      testCase.expectedFields.forEach((field) => {
        expect(result?.errors).toHaveProperty(field);
        expect(typeof result?.errors[field]).toBe('string');
      });
    });
  });

  it('should include specific error messages for each validation failure', () => {
    const invalidData = {
      temperature: -150,
      date: '2025-02-30',
      zipcode: 'ABCDE',
    };

    const result = validateWeatherData(invalidData);
    expect(result).not.toBeNull();

    // Verify error messages are descriptive
    expect(result?.errors.temperature).toContain('-100°F');
    expect(result?.errors.temperature).toContain('150°F');
    expect(result?.errors.date).toContain('YYYY-MM-DD');
    expect(result?.errors.zipcode).toContain('5 digits');
  });
});
