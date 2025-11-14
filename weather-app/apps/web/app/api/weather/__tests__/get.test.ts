/**
 * GET /api/weather endpoint tests
 * Focus on critical GET behaviors only
 */

import { POST, GET } from '../route';
import { NextRequest } from 'next/server';

// Helper function to store test data
async function storeTestData(zipcode: string, date: string, temperature: number) {
  const request = new NextRequest('http://localhost:3000/api/weather', {
    method: 'POST',
    body: JSON.stringify({ zipcode, date, temperature }),
    headers: { 'Content-Type': 'application/json' },
  });
  await POST(request);
}

describe('GET /api/weather', () => {
  it('should retrieve temperature for specific zipcode and date', async () => {
    // Store test data
    await storeTestData('12345', '2025-11-15', 68);

    // Retrieve data
    const request = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=12345&date=2025-11-15'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.temperature).toBe(68);
  });

  it('should retrieve all dates for a zipcode', async () => {
    // Store multiple dates for same zipcode
    await storeTestData('54321', '2025-11-16', 70);
    await storeTestData('54321', '2025-11-17', 72);
    await storeTestData('54321', '2025-11-18', 75);

    // Retrieve all dates
    const request = new NextRequest('http://localhost:3000/api/weather?zipcode=54321');

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.data).toBeDefined();
    expect(responseData.data['2025-11-16']).toBe(70);
    expect(responseData.data['2025-11-17']).toBe(72);
    expect(responseData.data['2025-11-18']).toBe(75);
  });

  it('should return 200 with null for non-existent zipcode', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=99999'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeNull();
  });

  it('should return 200 with null for non-existent date', async () => {
    await storeTestData('11111', '2025-11-20', 65);

    const request = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=11111&date=2025-11-21'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.temperature).toBeNull();
  });

  it('should return 400 for missing zipcode parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return 400 for invalid zipcode format', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=invalid'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details.zipcode).toBeDefined();
  });

  it('should return 400 for invalid date format', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=12345&date=11/15/2025'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details.date).toBeDefined();
  });
});
