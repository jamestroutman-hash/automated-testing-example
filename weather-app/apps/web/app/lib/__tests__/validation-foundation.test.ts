/**
 * Foundation Layer Tests for Roadmap 8 - Task Group 1
 * Focused tests for updated validation functions with new temperature range and error messages
 */

import {
  validateTemperature,
  validateDate,
  validateZipcode,
  validateRequiredFields,
} from '../../../lib/validation';

describe('Foundation Layer - validateTemperature with new -100°F to 150°F range', () => {
  it('should accept valid temperatures within new -100°F to 150°F range', () => {
    expect(validateTemperature(-100)).toBeNull();
    expect(validateTemperature(0)).toBeNull();
    expect(validateTemperature(150)).toBeNull();
  });

  it('should reject temperatures outside new -100°F to 150°F range with error message including limits', () => {
    const tooLow = validateTemperature(-101);
    expect(tooLow).not.toBeNull();
    expect(tooLow?.field).toBe('temperature');
    expect(tooLow?.message).toBe('Temperature must be between -100°F and 150°F');
    expect(tooLow?.message).toContain('-100°F');
    expect(tooLow?.message).toContain('150°F');

    const tooHigh = validateTemperature(151);
    expect(tooHigh).not.toBeNull();
    expect(tooHigh?.field).toBe('temperature');
    expect(tooHigh?.message).toBe('Temperature must be between -100°F and 150°F');
  });

  it('should reject non-numeric values (NaN, null, undefined, string) with appropriate error', () => {
    const nanValue = validateTemperature(NaN);
    expect(nanValue).not.toBeNull();
    expect(nanValue?.field).toBe('temperature');
    expect(nanValue?.message).toBe('Temperature must be a numeric value');

    // Test with type coercion to simulate various invalid inputs
    const undefinedValue = validateTemperature(undefined as any);
    expect(undefinedValue).not.toBeNull();
    expect(undefinedValue?.message).toBe('Temperature must be a numeric value');

    const stringValue = validateTemperature('75' as any);
    expect(stringValue).not.toBeNull();
    expect(stringValue?.message).toBe('Temperature must be a numeric value');
  });
});

describe('Foundation Layer - validateZipcode with updated error message', () => {
  it('should accept valid 5-digit zipcodes', () => {
    expect(validateZipcode('12345')).toBeNull();
    expect(validateZipcode('90210')).toBeNull();
  });

  it('should reject invalid zipcode formats with new error message', () => {
    const tooShort = validateZipcode('1234');
    expect(tooShort).not.toBeNull();
    expect(tooShort?.field).toBe('zipcode');
    expect(tooShort?.message).toBe('Invalid zipcode format. Must be 5 digits');

    const tooLong = validateZipcode('123456');
    expect(tooLong).not.toBeNull();
    expect(tooLong?.message).toBe('Invalid zipcode format. Must be 5 digits');

    const withLetters = validateZipcode('1234A');
    expect(withLetters).not.toBeNull();
    expect(withLetters?.message).toBe('Invalid zipcode format. Must be 5 digits');
  });
});

describe('Foundation Layer - validateDate with updated error message', () => {
  it('should accept valid dates in YYYY-MM-DD format', () => {
    expect(validateDate('2025-01-15')).toBeNull();
    expect(validateDate('2024-12-31')).toBeNull();
  });

  it('should reject invalid date formats with new error message', () => {
    const invalidFormat = validateDate('01/15/2025');
    expect(invalidFormat).not.toBeNull();
    expect(invalidFormat?.field).toBe('date');
    expect(invalidFormat?.message).toBe('Invalid date format. Use YYYY-MM-DD');

    const invalidDate = validateDate('2025-02-30');
    expect(invalidDate).not.toBeNull();
    expect(invalidDate?.message).toBe('Invalid date format. Use YYYY-MM-DD');
  });
});

describe('Foundation Layer - validateRequiredFields helper', () => {
  it('should return empty array when all required fields are present', () => {
    const data = {
      temperature: 75,
      date: '2025-01-15',
      zipcode: '12345',
    };
    const errors = validateRequiredFields(data, ['temperature', 'date', 'zipcode']);
    expect(errors).toEqual([]);
  });

  it('should return errors for each missing required field with proper format', () => {
    const data = {
      temperature: 75,
    };
    const errors = validateRequiredFields(data, ['temperature', 'date', 'zipcode']);

    expect(errors.length).toBe(2);
    expect(errors).toContainEqual({
      field: 'date',
      message: 'Date is required',
    });
    expect(errors).toContainEqual({
      field: 'zipcode',
      message: 'Zipcode is required',
    });
  });

  it('should treat empty string as missing field', () => {
    const data = {
      temperature: '',
      date: '2025-01-15',
      zipcode: '12345',
    };
    const errors = validateRequiredFields(data, ['temperature', 'date', 'zipcode']);

    expect(errors.length).toBe(1);
    expect(errors[0]).toEqual({
      field: 'temperature',
      message: 'Temperature is required',
    });
  });
});
