"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import styles from "./admin.module.css";

interface WeatherData {
  temperature: number;
  date: string;
  zipcode: string;
}

export function DataManagementButtons() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState<WeatherData[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  /**
   * Generate 14 days of random temperature data
   * 7 days in the past and 7 days in the future from today
   * Temperature range: 20°F to 90°F
   * Default zipcode: 10001
   */
  const handleGenerateData = async () => {
    setIsGenerating(true);
    const zipcode = "10001";
    const successCount = { count: 0 };
    const errorCount = { count: 0 };

    try {
      // Generate data for 7 days back and 7 days forward (14 days total)
      const today = new Date();
      const promises = [];

      for (let i = -7; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

        // Random temperature between 20 and 90
        const temperature = Math.floor(Math.random() * 71) + 20;

        // Create promise for each POST request
        const promise = fetch('/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            temperature,
            date: dateString,
            zipcode,
          }),
        })
          .then(response => {
            if (response.status === 201) {
              successCount.count++;
            } else {
              errorCount.count++;
            }
            return response;
          })
          .catch(() => {
            errorCount.count++;
          });

        promises.push(promise);
      }

      // Wait for all requests to complete
      await Promise.all(promises);

      if (errorCount.count === 0) {
        toast.success(`Successfully generated 14 days of random temperature data for zipcode ${zipcode}`);
      } else if (successCount.count > 0) {
        toast.success(`Generated ${successCount.count} days of data (${errorCount.count} failed)`);
      } else {
        toast.error('Failed to generate random data');
      }

      // Refresh table data if visible
      if (showTable) {
        await fetchTableData();
      }
    } catch (error) {
      console.error('Error generating data:', error);
      toast.error('An error occurred while generating data');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Clear all weather data from the data store
   */
  const handleClearData = async () => {
    // Confirm before clearing
    if (!confirm('Are you sure you want to clear all weather data? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);

    try {
      const response = await fetch('/api/weather', {
        method: 'DELETE',
      });

      if (response.status === 200) {
        toast.success('All weather data cleared successfully');
        // Refresh table data if visible
        if (showTable) {
          await fetchTableData();
        }
      } else {
        const data = await response.json();
        toast.error(data.errors?.server || 'Failed to clear data');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Fetch all weather data for the table
   */
  const fetchTableData = useCallback(async () => {
    setIsLoadingTable(true);
    try {
      const response = await fetch('/api/weather?zipcode=10001');
      if (response.ok) {
        const result = await response.json();
        const dataObject = result.data;

        // Transform object { "date": temperature } to array of WeatherData objects
        const dataArray: WeatherData[] = dataObject
          ? Object.entries(dataObject).map(([date, temperature]) => ({
              date,
              temperature: temperature as number,
              zipcode: '10001'
            }))
          : [];

        // Sort by date descending (newest first)
        const sortedData = dataArray.sort((a: WeatherData, b: WeatherData) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTableData(sortedData);
      } else {
        toast.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      toast.error('Error loading data');
    } finally {
      setIsLoadingTable(false);
    }
  }, []);

  /**
   * Toggle table visibility and fetch data if showing
   */
  const handleToggleTable = async () => {
    const newShowTable = !showTable;
    setShowTable(newShowTable);
    if (newShowTable) {
      await fetchTableData();
    }
  };

  // Auto-refresh table when it's visible
  useEffect(() => {
    if (showTable) {
      fetchTableData();
      // Set up polling to refresh every 5 seconds
      const interval = setInterval(fetchTableData, 5000);
      return () => clearInterval(interval);
    }
  }, [showTable, fetchTableData]);

  return (
    <div className={styles.dataManagement}>
      <h2 className={styles.dataManagementTitle}>Data Management</h2>
      <div className={styles.buttonGroup}>
        <button
          onClick={handleGenerateData}
          className={styles.generateButton}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate 14 Days of Random Data'}
        </button>
        <button
          onClick={handleClearData}
          className={styles.clearButton}
          disabled={isClearing}
        >
          {isClearing ? 'Clearing...' : 'Clear All Data'}
        </button>
        <button
          onClick={handleToggleTable}
          className={styles.viewDataButton}
        >
          {showTable ? 'Hide Data Table' : 'View All Data'}
        </button>
      </div>

      {showTable && (
        <div className={styles.tableContainer}>
          {isLoadingTable ? (
            <p className={styles.loadingText}>Loading data...</p>
          ) : tableData.length === 0 ? (
            <p className={styles.emptyText}>No data available. Generate some data to see it here.</p>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Temperature (°F)</th>
                  <th>Zipcode</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={`${item.date}-${item.zipcode}-${index}`}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.temperature}°F</td>
                    <td>{item.zipcode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
