"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./CurrentTemperatureDisplay.module.css";

export function CurrentTemperatureDisplay() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [hasZipcode, setHasZipcode] = useState<boolean>(true);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        // Read zipcode from localStorage
        const savedZipcode = localStorage.getItem('userZipcode');

        // Handle missing zipcode
        if (!savedZipcode || savedZipcode.trim() === '') {
          setHasZipcode(false);
          toast.error('Please configure your zipcode in the profile page');
          return;
        }

        // Calculate today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        // Set loading state
        setIsLoading(true);

        // Make API request
        const response = await fetch(`/api/weather?zipcode=${savedZipcode}&date=${dateString}`);

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();

        // Set temperature (can be null or a number)
        setTemperature(data.temperature);
      } catch (error) {
        console.error('Error fetching temperature:', error);
        toast.error('Failed to load temperature data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemperature();
  }, []);

  // Render loading spinner
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner} role="status" aria-label="Loading temperature"></div>
      </div>
    );
  }

  // Render temperature value (including 0)
  if (temperature !== null) {
    return (
      <div className={styles.container}>
        <div className={styles.temperatureValue}>{temperature}°F</div>
      </div>
    );
  }

  // Render placeholder message (no data state)
  if (hasZipcode && temperature === null) {
    return (
      <div className={styles.container}>
        <p className={styles.placeholderText}>No temperature data available for today</p>
      </div>
    );
  }

  // Render nothing if no zipcode (toast already shown)
  return null;
}
