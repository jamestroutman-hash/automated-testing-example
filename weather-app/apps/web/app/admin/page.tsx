import type { Metadata } from "next";
import { WeatherForm } from "./WeatherForm";
import { ToastProvider } from "./ToastProvider";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Admin Panel - Weather Data Entry",
  description: "Submit weather data to the system",
};

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.description}>Enter weather data below</p>
        <WeatherForm />
        <ToastProvider />
      </main>
    </div>
  );
}
