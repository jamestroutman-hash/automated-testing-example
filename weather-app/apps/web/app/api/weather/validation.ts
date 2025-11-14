/**
 * Validation functions for weather data
 * Re-exports from shared validation module for backward compatibility
 * All validations fail early with clear, specific error messages
 */

import { WeatherData, ErrorResponse, ValidationError } from './types';
import {
  validateTemperature as sharedValidateTemperature,
  validateDate as sharedValidateDate,
  validateZipcode as sharedValidateZipcode,
} from '../../../lib/validation';

// Re-export individual validation functions from shared module
export const validateTemperature = sharedValidateTemperature;
export const validateDate = sharedValidateDate;
export const validateZipcode = sharedValidateZipcode;

/**
 * Validate complete weather data object
 * Orchestrates all field validations and aggregates errors
 *
 * @param data - Weather data to validate
 * @returns ErrorResponse if any validation fails, null if all pass
 */
export function validateWeatherData(data: WeatherData): ErrorResponse | null {
  const errors: Record<string, string> = {};

  // Validate temperature (including type checking before range validation)
  const tempError = validateTemperature(data.temperature);
  if (tempError) {
    errors[tempError.field] = tempError.message;
  }

  // Validate date
  const dateError = validateDate(data.date);
  if (dateError) {
    errors[dateError.field] = dateError.message;
  }

  // Validate zipcode
  const zipcodeError = validateZipcode(data.zipcode);
  if (zipcodeError) {
    errors[zipcodeError.field] = zipcodeError.message;
  }

  // Return aggregated errors if any validations failed
  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  return null;
}
