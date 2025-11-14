import React from "react";
import type { Metadata } from "next";
import styles from "./home.module.css";
import { CurrentTemperatureDisplay } from "./CurrentTemperatureDisplay";
import { HistoricalDataDisplay } from "./HistoricalDataDisplay";
import { ForecastDataDisplay } from "./ForecastDataDisplay";

export const metadata: Metadata = {
  title: "Veritas Weather - Home Dashboard",
  description: "View current weather, historical data, and forecasts",
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Veritas Weather</h1>

        {/* Section 1: Current Temperature */}
        <div className={`${styles.section} ${styles.currentTempSection}`}>
          <CurrentTemperatureDisplay />
        </div>

        {/* Section 2: 7-Day Historical */}
        <div className={`${styles.section} ${styles.historicalSection}`}>
          <HistoricalDataDisplay />
        </div>

        {/* Section 3: 7-Day Forecast */}
        <div className={`${styles.section} ${styles.forecastSection}`}>
          <ForecastDataDisplay />
        </div>
      </main>
    </div>
  );
}
