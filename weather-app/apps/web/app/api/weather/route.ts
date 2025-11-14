/**
 * Weather API route handlers
 * Implements POST and GET endpoints for weather data storage and retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import { storeWeatherData, getWeatherData } from './dataStore';
import { validateWeatherData, validateZipcode, validateDate } from './validation';
import { WeatherData } from './types';
import { validateRequiredFields } from '../../../lib/validation';

/**
 * POST /api/weather
 * Store weather data in memory
 *
 * @param request - Next.js request object with JSON body
 * @returns 201 with stored data, 400 for validation errors, 500 for server errors
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          errors: { body: 'Invalid JSON in request body' },
        },
        { status: 400 }
      );
    }

    // Check for missing required fields first
    const missingFieldErrors = validateRequiredFields(body, ['temperature', 'date', 'zipcode']);
    if (missingFieldErrors.length > 0) {
      const errors: Record<string, string> = {};
      missingFieldErrors.forEach((err) => {
        errors[err.field] = err.message;
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Validate weather data (including format and range validations)
    const validationError = validateWeatherData(body as WeatherData);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    // Store data (upsert behavior: silently accepts duplicates and updates existing)
    storeWeatherData(body as WeatherData);

    // Return stored data with 201 status
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    // Handle unexpected server errors
    return NextResponse.json(
      {
        errors: { server: 'An unexpected error occurred' },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/weather
 * Retrieve weather data from memory
 *
 * @param request - Next.js request object with query parameters
 * @returns 200 with data or empty result, 400 for validation errors, 500 for server errors
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const zipcode = searchParams.get('zipcode');
    const date = searchParams.get('date');

    // Validate required zipcode parameter
    if (!zipcode) {
      return NextResponse.json(
        {
          errors: { zipcode: 'Zipcode is required' },
        },
        { status: 400 }
      );
    }

    // Validate zipcode format
    const zipcodeError = validateZipcode(zipcode);
    if (zipcodeError) {
      return NextResponse.json(
        {
          errors: { [zipcodeError.field]: zipcodeError.message },
        },
        { status: 400 }
      );
    }

    // Validate date format if provided
    if (date) {
      const dateError = validateDate(date);
      if (dateError) {
        return NextResponse.json(
          {
            errors: { [dateError.field]: dateError.message },
          },
          { status: 400 }
        );
      }
    }

    // Retrieve data from store
    const data = getWeatherData(zipcode, date || undefined);

    // Handle response based on whether date was provided
    if (date) {
      // Return specific temperature for zipcode+date (200 with null if not found)
      return NextResponse.json({ temperature: data }, { status: 200 });
    }

    // Return all dates and temperatures for zipcode (200 with null if not found)
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    // Handle unexpected server errors
    return NextResponse.json(
      {
        errors: { server: 'An unexpected error occurred' },
      },
      { status: 500 }
    );
  }
}
