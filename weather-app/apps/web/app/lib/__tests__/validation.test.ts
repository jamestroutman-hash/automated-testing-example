/**
 * Tests for shared validation functions
 * Covers temperature, date, and zipcode validation with focus on core behaviors
 * These tests verify the shared validation module can be used by both client and server
 */

import {
  validateTemperature,
  validateDate,
  validateZipcode,
  ValidationError,
} from '../../../lib/validation';

describe('Shared Validation - validateTemperature', () => {
  it('should return null for valid temperature within range -100 to 150', () => {
    expect(validateTemperature(-100)).toBeNull();
    expect(validateTemperature(0)).toBeNull();
    expect(validateTemperature(75)).toBeNull();
    expect(validateTemperature(150)).toBeNull();
  });

  it('should return error for temperature outside valid range', () => {
    const tooLow = validateTemperature(-101);
    expect(tooLow).not.toBeNull();
    expect(tooLow?.field).toBe('temperature');
    expect(tooLow?.message).toContain('-100°F and 150°F');

    const tooHigh = validateTemperature(151);
    expect(tooHigh).not.toBeNull();
    expect(tooHigh?.field).toBe('temperature');
    expect(tooHigh?.message).toContain('-100°F and 150°F');
  });
});

describe('Shared Validation - validateDate', () => {
  it('should return null for valid date in YYYY-MM-DD format', () => {
    expect(validateDate('2025-01-15')).toBeNull();
    expect(validateDate('2024-12-31')).toBeNull();
    expect(validateDate('2025-02-28')).toBeNull();
  });

  it('should return error for invalid date format or invalid calendar date', () => {
    const invalidFormat = validateDate('01/15/2025');
    expect(invalidFormat).not.toBeNull();
    expect(invalidFormat?.field).toBe('date');
    expect(invalidFormat?.message).toContain('YYYY-MM-DD');

    const invalidDate = validateDate('2025-02-30');
    expect(invalidDate).not.toBeNull();
    expect(invalidDate?.field).toBe('date');
    expect(invalidDate?.message).toContain('YYYY-MM-DD');
  });
});

describe('Shared Validation - validateZipcode', () => {
  it('should return null for valid 5-digit zipcode', () => {
    expect(validateZipcode('12345')).toBeNull();
    expect(validateZipcode('90210')).toBeNull();
    expect(validateZipcode('00501')).toBeNull();
  });

  it('should return error for invalid zipcode format', () => {
    const tooShort = validateZipcode('1234');
    expect(tooShort).not.toBeNull();
    expect(tooShort?.field).toBe('zipcode');
    expect(tooShort?.message).toContain('5 digits');

    const tooLong = validateZipcode('123456');
    expect(tooLong).not.toBeNull();
    expect(tooLong?.field).toBe('zipcode');

    const withLetters = validateZipcode('1234A');
    expect(withLetters).not.toBeNull();
    expect(withLetters?.field).toBe('zipcode');
  });
});

describe('Shared Validation - ValidationError structure', () => {
  it('should return consistent error structure with field and message', () => {
    const tempError = validateTemperature(200);
    expect(tempError).toHaveProperty('field');
    expect(tempError).toHaveProperty('message');
    expect(typeof tempError?.field).toBe('string');
    expect(typeof tempError?.message).toBe('string');

    const dateError = validateDate('invalid');
    expect(dateError).toHaveProperty('field');
    expect(dateError).toHaveProperty('message');

    const zipcodeError = validateZipcode('abc');
    expect(zipcodeError).toHaveProperty('field');
    expect(zipcodeError).toHaveProperty('message');
  });
});
