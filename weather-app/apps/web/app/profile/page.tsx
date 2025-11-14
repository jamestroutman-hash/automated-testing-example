import React from "react";
import type { Metadata } from "next";
import { ProfileForm } from "./ProfileForm";
import { ToastProvider } from "../admin/ToastProvider";
import styles from "./profile.module.css";

export const metadata: Metadata = {
  title: "User Profile - Weather App",
  description: "Manage your weather preferences",
};

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>User Profile</h1>
        <p className={styles.description}>Save your preferred zipcode for personalized weather data</p>
        <ProfileForm />
        <ToastProvider />
      </main>
    </div>
  );
}
