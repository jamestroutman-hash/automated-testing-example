/**
 * Shared validation functions for weather data
 * Used by both client-side form validation and server-side API validation
 * All validations fail early with clear, specific error messages
 */

/**
 * Validation error for field-specific errors
 */
export type ValidationError = {
  field: string;
  message: string;
} | null;

/**
 * Validate temperature value
 * Must be numeric and within -100 to 150 Fahrenheit range
 *
 * @param temperature - Temperature value to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateTemperature(temperature: number): ValidationError {
  // Check if numeric (not NaN, null, undefined, string, etc.)
  if (typeof temperature !== 'number' || isNaN(temperature)) {
    return {
      field: 'temperature',
      message: 'Temperature must be a numeric value',
    };
  }

  // Check range: -100 to 150 Fahrenheit (inclusive)
  if (temperature < -100 || temperature > 150) {
    return {
      field: 'temperature',
      message: 'Temperature must be between -100°F and 150°F',
    };
  }

  return null;
}

/**
 * Validate date format and validity
 * Must be strict YYYY-MM-DD format and valid calendar date
 *
 * @param date - Date string to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateDate(date: string): ValidationError {
  // Check strict YYYY-MM-DD format using regex
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormatRegex.test(date)) {
    return {
      field: 'date',
      message: 'Invalid date format. Use YYYY-MM-DD',
    };
  }

  // Validate as valid calendar date
  const parts = date.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  // Ensure all parts are defined and valid numbers
  if (year === undefined || month === undefined || day === undefined ||
      isNaN(year) || isNaN(month) || isNaN(day)) {
    return {
      field: 'date',
      message: 'Invalid date format. Use YYYY-MM-DD',
    };
  }

  const dateObject = new Date(year, month - 1, day);

  // Check if date is valid (handles invalid dates like 2025-02-30)
  if (
    dateObject.getFullYear() !== year ||
    dateObject.getMonth() !== month - 1 ||
    dateObject.getDate() !== day
  ) {
    return {
      field: 'date',
      message: 'Invalid date format. Use YYYY-MM-DD',
    };
  }

  return null;
}

/**
 * Validate zipcode format
 * Must be exactly 5 numeric digits
 *
 * @param zipcode - Zipcode string to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateZipcode(zipcode: string): ValidationError {
  // Check exactly 5 numeric digits (no ZIP+4, no letters, no spaces/dashes)
  const zipcodeRegex = /^\d{5}$/;
  if (!zipcodeRegex.test(zipcode)) {
    return {
      field: 'zipcode',
      message: 'Invalid zipcode format. Must be 5 digits',
    };
  }

  return null;
}

/**
 * Validate that required fields are present
 * Returns array of ValidationError for any missing required fields
 *
 * @param data - Object containing the fields to validate
 * @param requiredFields - Array of field names that are required
 * @returns Array of ValidationError for missing fields, empty array if all present
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): Array<{ field: string; message: string }> {
  const errors: Array<{ field: string; message: string }> = [];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({
        field,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
      });
    }
  }

  return errors;
}
