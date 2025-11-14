/**
 * TypeScript types for Weather API
 */

import { ValidationError as SharedValidationError } from '../../../lib/validation';

/**
 * Weather data structure with required fields
 */
export interface WeatherData {
  zipcode: string;
  date: string;
  temperature: number;
}

/**
 * Error response structure for API errors
 * Field-specific errors with consistent format
 */
export interface ErrorResponse {
  errors: Record<string, string>;
}

/**
 * Validation error for field-specific errors
 * Re-exported from shared validation module for backward compatibility
 */
export type ValidationError = SharedValidationError;
