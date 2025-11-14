/**
 * Roadmap 8 - Task Group 4: Integration Testing
 * Strategic tests covering end-to-end workflows, edge cases, and error format consistency
 * Maximum 10 additional tests to fill critical gaps
 *
 * Note: These tests focus on validation layer and error format consistency
 * without requiring Next.js server runtime to avoid test environment conflicts
 */

import { validateWeatherData } from '../api/weather/validation';
import { validateTemperature, validateDate, validateZipcode } from '../../lib/validation';

describe('Roadmap 8 - Integration Tests', () => {
  it('Edge Case: Temperature validation with boundary values (-100, 150)', () => {
    // Test lower boundary
    const lowerBoundary = validateTemperature(-100);
    expect(lowerBoundary).toBeNull(); // -100 should be valid

    const belowLowerBoundary = validateTemperature(-101);
    expect(belowLowerBoundary).not.toBeNull();
    expect(belowLowerBoundary?.message).toContain('-100°F and 150°F');

    // Test upper boundary
    const upperBoundary = validateTemperature(150);
    expect(upperBoundary).toBeNull(); // 150 should be valid

    const aboveUpperBoundary = validateTemperature(151);
    expect(aboveUpperBoundary).not.toBeNull();
    expect(aboveUpperBoundary?.message).toContain('-100°F and 150°F');

    // Test middle range
    expect(validateTemperature(0)).toBeNull();
    expect(validateTemperature(75)).toBeNull();
  });

  it('Edge Case: Date validation with invalid calendar dates', () => {
    // Invalid month
    const invalidMonth = validateDate('2025-13-01');
    expect(invalidMonth).not.toBeNull();
    expect(invalidMonth?.message).toContain('YYYY-MM-DD');

    // Invalid day for February
    const invalidFebDay = validateDate('2025-02-30');
    expect(invalidFebDay).not.toBeNull();

    // Invalid day for April (only 30 days)
    const invalidAprilDay = validateDate('2025-04-31');
    expect(invalidAprilDay).not.toBeNull();

    // Valid leap year date
    const validLeapYear = validateDate('2024-02-29');
    expect(validLeapYear).toBeNull();

    // Invalid non-leap year date
    const invalidLeapYear = validateDate('2025-02-29');
    expect(invalidLeapYear).not.toBeNull();

    // Valid dates
    expect(validateDate('2025-01-15')).toBeNull();
    expect(validateDate('2024-12-31')).toBeNull();
  });

  it('Cross-Component: Profile form and Weather form use same zipcode validation', () => {
    // Test that both forms reject the same invalid formats
    const invalidZipcodes = ['1234', '123456', 'ABCDE', '90210-1234', '902 10', '', '  '];

    invalidZipcodes.forEach((zipcode) => {
      const validationResult = validateZipcode(zipcode);
      expect(validationResult).not.toBeNull();
      expect(validationResult?.message).toBe('Invalid zipcode format. Must be 5 digits');
      expect(validationResult?.field).toBe('zipcode');
    });

    // Test that both forms accept the same valid formats
    const validZipcodes = ['90210', '12345', '02134', '99501', '00501'];

    validZipcodes.forEach((zipcode) => {
      const validationResult = validateZipcode(zipcode);
      expect(validationResult).toBeNull();
    });
  });

  it('Error Format: Validation layer returns errors object format for all field types', () => {
    const invalidData = {
      temperature: 200,
      date: '01/15/2025',
      zipcode: 'ABCDE',
    };

    const result = validateWeatherData(invalidData);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('errors');
    expect(typeof result?.errors).toBe('object');

    // Verify all three fields have errors
    expect(result?.errors.temperature).toBeDefined();
    expect(result?.errors.date).toBeDefined();
    expect(result?.errors.zipcode).toBeDefined();

    // Verify each error is a string
    expect(typeof result?.errors.temperature).toBe('string');
    expect(typeof result?.errors.date).toBe('string');
    expect(typeof result?.errors.zipcode).toBe('string');

    // Verify no old format fields exist
    expect(result).not.toHaveProperty('error');
    expect(result).not.toHaveProperty('details');
  });

  it('Error Format: Error messages include specific helpful information', () => {
    const result = validateWeatherData({
      temperature: -150,
      date: '2025-02-30',
      zipcode: '1234',
    });

    expect(result).not.toBeNull();

    // Temperature error includes range limits
    expect(result?.errors.temperature).toContain('-100°F');
    expect(result?.errors.temperature).toContain('150°F');

    // Date error includes expected format
    expect(result?.errors.date).toContain('YYYY-MM-DD');

    // Zipcode error includes expected format
    expect(result?.errors.zipcode).toContain('5 digits');
  });

  it('Error Format: Valid data returns null (no errors)', () => {
    const validData = {
      temperature: 75,
      date: '2025-01-15',
      zipcode: '90210',
    };

    const result = validateWeatherData(validData);
    expect(result).toBeNull();
  });

  it('Integration: Multiple validation errors collected in single errors object', () => {
    // All fields invalid
    const allInvalid = validateWeatherData({
      temperature: 999,
      date: 'invalid-date',
      zipcode: '123',
    });

    expect(allInvalid?.errors).toBeDefined();
    expect(Object.keys(allInvalid?.errors || {}).length).toBe(3);

    // Only temperature invalid
    const onlyTempInvalid = validateWeatherData({
      temperature: -200,
      date: '2025-01-15',
      zipcode: '90210',
    });

    expect(onlyTempInvalid?.errors).toBeDefined();
    expect(Object.keys(onlyTempInvalid?.errors || {}).length).toBe(1);
    expect(onlyTempInvalid?.errors.temperature).toBeDefined();
    expect(onlyTempInvalid?.errors.date).toBeUndefined();
    expect(onlyTempInvalid?.errors.zipcode).toBeUndefined();
  });

  it('Edge Case: Temperature type validation before range validation', () => {
    // Non-numeric values should return type error, not range error
    const invalidTypes = [
      'hot',
      'cold',
      null,
      undefined,
      NaN,
      '',
      '  ',
      'abc',
      '75degrees',
    ];

    invalidTypes.forEach((value) => {
      const result = validateWeatherData({
        temperature: value as any,
        date: '2025-01-15',
        zipcode: '90210',
      });

      expect(result).not.toBeNull();
      expect(result?.errors.temperature).toBeDefined();
      // Should be numeric error, not range error
      expect(result?.errors.temperature).toContain('numeric');
    });
  });

  it('Integration: Consistent error field names match input field names', () => {
    // Error field names should exactly match the input field names
    // This ensures frontend can map errors back to form fields
    const result = validateWeatherData({
      temperature: 999,
      date: 'bad-date',
      zipcode: 'bad-zip',
    });

    expect(result?.errors).toBeDefined();
    const errorFields = Object.keys(result?.errors || {});

    // Must have these exact field names
    expect(errorFields).toContain('temperature');
    expect(errorFields).toContain('date');
    expect(errorFields).toContain('zipcode');

    // Should NOT have any other fields
    expect(errorFields.length).toBe(3);
  });

  it('Integration: Empty or whitespace-only values treated as invalid', () => {
    // Test empty string
    expect(validateZipcode('')).not.toBeNull();

    // Test whitespace
    expect(validateZipcode('   ')).not.toBeNull();

    // Test empty date
    expect(validateDate('')).not.toBeNull();

    // Temperature of 0 should be valid (not treated as empty)
    expect(validateTemperature(0)).toBeNull();
  });
});
