"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./ForecastDataDisplay.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TemperatureDataPoint {
  date: string;
  temperature: number | null;
}

export function ForecastDataDisplay() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [temperatureData, setTemperatureData] = useState<TemperatureDataPoint[]>([]);
  const [hasZipcode, setHasZipcode] = useState<boolean>(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // Read zipcode from localStorage
        const savedZipcode = localStorage.getItem('userZipcode');

        // Handle missing zipcode
        if (!savedZipcode || savedZipcode.trim() === '') {
          setHasZipcode(false);
          toast.error('Please configure your zipcode in the profile page');
          return;
        }

        // Set loading state
        setIsLoading(true);

        // Calculate date range for next 7 days (days +1 through +7)
        const dateRange: string[] = [];
        const today = new Date();

        for (let i = 1; i <= 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateString = date.toISOString().split('T')[0] || '';
          if (dateString) {
            dateRange.push(dateString);
          }
        }

        // Make API request without date parameter to get all data
        const response = await fetch(`/api/weather?zipcode=${savedZipcode}`);

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const apiResponse = await response.json();
        const allData: Record<string, number> | null = apiResponse.data;

        // If no data exists at all, set empty array
        if (!allData) {
          setTemperatureData([]);
          return;
        }

        // Filter and transform data for the 7-day forecast range
        const chartData: TemperatureDataPoint[] = dateRange.map((dateStr) => {
          // Get temperature for this date (null if not found)
          const temperature = allData[dateStr] !== undefined ? allData[dateStr] : null;

          // Format date for display: "Mon, Nov 11"
          const dateObj = new Date(dateStr + 'T00:00:00');
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          return {
            date: formattedDate,
            temperature,
          };
        });

        // Check if all temperatures are null (no actual data)
        const hasAnyData = chartData.some(point => point.temperature !== null);

        // Set temperature data only if there's at least some data
        if (hasAnyData) {
          setTemperatureData(chartData);
        } else {
          setTemperatureData([]);
        }
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        toast.error('Failed to load forecast data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  // Render loading spinner
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner} role="status" aria-label="Loading forecast data"></div>
      </div>
    );
  }

  // Return null if no zipcode (toast already shown)
  if (!hasZipcode) {
    return null;
  }

  // Render placeholder message if no data
  if (temperatureData.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.placeholderText}>No forecast data available for the next 7 days</p>
      </div>
    );
  }

  // Render graph with heading
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>7-Day Forecast</h2>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--foreground)' }}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'var(--foreground)' }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#FF8C42"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
