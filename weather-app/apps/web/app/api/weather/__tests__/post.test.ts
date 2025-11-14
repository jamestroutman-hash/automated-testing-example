/**
 * POST /api/weather endpoint tests
 * Focus on critical POST behaviors only
 */

import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/weather', () => {
  it('should store valid weather data and return 201', async () => {
    const requestData = {
      zipcode: '90210',
      date: '2025-11-13',
      temperature: 72,
    };

    const request = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(requestData);
  });

  it('should return 400 for invalid weather data', async () => {
    const requestData = {
      zipcode: 'invalid',
      date: '11/13/2025',
      temperature: 999,
    };

    const request = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
    expect(data.details.zipcode).toBeDefined();
    expect(data.details.date).toBeDefined();
    expect(data.details.temperature).toBeDefined();
  });

  it('should return 400 for malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: 'invalid json{',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should accept duplicate zipcode/date combinations', async () => {
    const requestData = {
      zipcode: '90210',
      date: '2025-11-14',
      temperature: 75,
    };

    const request1 = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response1 = await POST(request1);
    expect(response1.status).toBe(201);

    // Submit same data again
    const request2 = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response2 = await POST(request2);
    expect(response2.status).toBe(201);
  });
});
