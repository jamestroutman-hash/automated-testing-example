/**
 * In-memory data store for weather data
 *
 * Data structure: { [zipcode]: { [date]: temperature } }
 * Data persists only while server is running (lost on restart)
 */

import { WeatherData } from './types';

/**
 * In-memory storage structure
 * Nested object: { [zipcode]: { [date]: temperature } }
 */
const dataStore: Record<string, Record<string, number>> = {};

/**
 * Store weather data in memory
 * Silently accepts duplicate zipcode/date combinations (no overwrite logic)
 *
 * @param data - Weather data to store
 */
export function storeWeatherData(data: WeatherData): void {
  const { zipcode, date, temperature } = data;

  // Initialize zipcode object if it doesn't exist
  if (!dataStore[zipcode]) {
    dataStore[zipcode] = {};
  }

  // Store temperature for the given date
  dataStore[zipcode][date] = temperature;
}

/**
 * Retrieve weather data from memory
 *
 * @param zipcode - 5-digit zipcode
 * @param date - Optional date in YYYY-MM-DD format
 * @returns Temperature for specific date, all dates for zipcode, or null if not found
 */
export function getWeatherData(
  zipcode: string,
  date?: string
): number | Record<string, number> | null {
  // Zipcode not found in store
  if (!dataStore[zipcode]) {
    return null;
  }

  // If date provided, return specific temperature
  if (date) {
    return dataStore[zipcode][date] ?? null;
  }

  // Return all dates and temperatures for zipcode
  return dataStore[zipcode];
}

/**
 * Clear all weather data from memory
 */
export function clearAllData(): void {
  Object.keys(dataStore).forEach(key => {
    delete dataStore[key];
  });
}
