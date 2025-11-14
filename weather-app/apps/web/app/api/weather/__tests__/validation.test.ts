/**
 * Validation layer tests
 * Focus on critical validation behaviors only
 */

import {
  validateTemperature,
  validateDate,
  validateZipcode,
  validateWeatherData,
} from '../validation';

describe('Temperature Validation', () => {
  it('should accept valid temperature within range', () => {
    expect(validateTemperature(72)).toBeNull();
    expect(validateTemperature(-100)).toBeNull();
    expect(validateTemperature(150)).toBeNull();
    expect(validateTemperature(0)).toBeNull();
  });

  it('should reject temperature outside valid range', () => {
    const below = validateTemperature(-101);
    expect(below).not.toBeNull();
    expect(below?.message).toContain('-100°F and 150°F');

    const above = validateTemperature(151);
    expect(above).not.toBeNull();
    expect(above?.message).toContain('-100°F and 150°F');
  });

  it('should reject non-numeric temperature', () => {
    const result = validateTemperature('hot' as any);
    expect(result).not.toBeNull();
    expect(result?.message).toContain('numeric');
  });
});

describe('Date Validation', () => {
  it('should accept valid YYYY-MM-DD dates', () => {
    expect(validateDate('2025-11-13')).toBeNull();
    expect(validateDate('2025-01-01')).toBeNull();
    expect(validateDate('2025-12-31')).toBeNull();
  });

  it('should reject invalid date formats', () => {
    expect(validateDate('11/13/2025')).not.toBeNull();
    expect(validateDate('13-11-2025')).not.toBeNull();
    expect(validateDate('2025-11-13T00:00:00Z')).not.toBeNull();
  });

  it('should reject invalid calendar dates', () => {
    expect(validateDate('2025-13-01')).not.toBeNull();
    expect(validateDate('2025-02-30')).not.toBeNull();
  });
});

describe('Zipcode Validation', () => {
  it('should accept valid 5-digit zipcodes', () => {
    expect(validateZipcode('90210')).toBeNull();
    expect(validateZipcode('02134')).toBeNull();
    expect(validateZipcode('12345')).toBeNull();
  });

  it('should reject invalid zipcode formats', () => {
    expect(validateZipcode('90210-1234')).not.toBeNull();
    expect(validateZipcode('1234')).not.toBeNull();
    expect(validateZipcode('123456')).not.toBeNull();
    expect(validateZipcode('abcde')).not.toBeNull();
  });
});

describe('Weather Data Validation Orchestrator', () => {
  it('should return null for valid weather data', () => {
    const result = validateWeatherData({
      zipcode: '90210',
      date: '2025-11-13',
      temperature: 72,
    });
    expect(result).toBeNull();
  });

  it('should return aggregated errors for invalid data with new error format', () => {
    const result = validateWeatherData({
      zipcode: 'invalid',
      date: '11/13/2025',
      temperature: 999,
    });

    expect(result).not.toBeNull();
    expect(result?.errors).toBeDefined();
    expect(result?.errors?.zipcode).toBeDefined();
    expect(result?.errors?.date).toBeDefined();
    expect(result?.errors?.temperature).toBeDefined();
  });
});
