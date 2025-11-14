/**
 * Integration tests for Weather API
 * Focus on end-to-end workflows between POST and GET endpoints
 */

import { POST, GET } from '../route';
import { NextRequest } from 'next/server';

describe('Weather API Integration', () => {
  it('should store data via POST and retrieve it via GET with zipcode+date', async () => {
    // POST: Store weather data
    const postRequest = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify({
        zipcode: '60601',
        date: '2025-11-19',
        temperature: 45,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const postResponse = await POST(postRequest);
    expect(postResponse.status).toBe(201);

    // GET: Retrieve the same data
    const getRequest = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=60601&date=2025-11-19'
    );

    const getResponse = await GET(getRequest);
    const getData = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getData.temperature).toBe(45);
  });

  it('should store multiple dates for same zipcode and retrieve all via GET', async () => {
    const zipcode = '90210';
    const weatherData = [
      { date: '2025-11-20', temperature: 78 },
      { date: '2025-11-21', temperature: 80 },
      { date: '2025-11-22', temperature: 82 },
    ];

    // POST: Store multiple dates
    for (const data of weatherData) {
      const postRequest = new NextRequest('http://localhost:3000/api/weather', {
        method: 'POST',
        body: JSON.stringify({ zipcode, ...data }),
        headers: { 'Content-Type': 'application/json' },
      });
      const postResponse = await POST(postRequest);
      expect(postResponse.status).toBe(201);
    }

    // GET: Retrieve all dates for zipcode
    const getRequest = new NextRequest(
      `http://localhost:3000/api/weather?zipcode=${zipcode}`
    );

    const getResponse = await GET(getRequest);
    const getData = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getData.data['2025-11-20']).toBe(78);
    expect(getData.data['2025-11-21']).toBe(80);
    expect(getData.data['2025-11-22']).toBe(82);
  });

  it('should handle invalid POST data and valid GET query consistently', async () => {
    // POST: Attempt to store invalid data
    const postRequest = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify({
        zipcode: 'invalid',
        date: 'invalid',
        temperature: 'invalid',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const postResponse = await POST(postRequest);
    const postData = await postResponse.json();

    expect(postResponse.status).toBe(400);
    expect(postData.error).toBe('Validation failed');
    expect(postData.details).toBeDefined();

    // GET: Valid query should still work and return 200 with null
    const getRequest = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=99999'
    );

    const getResponse = await GET(getRequest);
    expect(getResponse.status).toBe(200);
  });

  it('should return consistent error format across endpoints', async () => {
    // POST: Invalid validation
    const postRequest = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify({
        zipcode: '1234',
        date: '2025-11-23',
        temperature: 70,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const postResponse = await POST(postRequest);
    const postData = await postResponse.json();

    expect(postResponse.status).toBe(400);
    expect(postData.error).toBeDefined();
    expect(postData.details).toBeDefined();

    // GET: Invalid validation
    const getRequest = new NextRequest(
      'http://localhost:3000/api/weather?zipcode=1234'
    );

    const getResponse = await GET(getRequest);
    const getData = await getResponse.json();

    expect(getResponse.status).toBe(400);
    expect(getData.error).toBeDefined();
    expect(getData.details).toBeDefined();

    // Both should have same error structure
    expect(typeof postData.error).toBe('string');
    expect(typeof getData.error).toBe('string');
    expect(typeof postData.details).toBe('object');
    expect(typeof getData.details).toBe('object');
  });

  it('should handle duplicate POST submissions without error', async () => {
    const weatherData = {
      zipcode: '10001',
      date: '2025-11-24',
      temperature: 55,
    };

    // POST: First submission
    const postRequest1 = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify(weatherData),
      headers: { 'Content-Type': 'application/json' },
    });

    const postResponse1 = await POST(postRequest1);
    expect(postResponse1.status).toBe(201);

    // POST: Duplicate submission
    const postRequest2 = new NextRequest('http://localhost:3000/api/weather', {
      method: 'POST',
      body: JSON.stringify(weatherData),
      headers: { 'Content-Type': 'application/json' },
    });

    const postResponse2 = await POST(postRequest2);
    expect(postResponse2.status).toBe(201);

    // GET: Should retrieve the data
    const getRequest = new NextRequest(
      `http://localhost:3000/api/weather?zipcode=${weatherData.zipcode}&date=${weatherData.date}`
    );

    const getResponse = await GET(getRequest);
    const getData = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getData.temperature).toBe(weatherData.temperature);
  });
});
