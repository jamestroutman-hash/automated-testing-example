"use client";

import React, { useState, useEffect } from "react";
import { validateZipcode } from "../../lib/validation";
import toast from "react-hot-toast";
import styles from "./profile.module.css";

interface ValidationErrors {
  [key: string]: string;
}

export function ProfileForm() {
  const [zipcode, setZipcode] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load saved zipcode from localStorage on mount
  useEffect(() => {
    try {
      const savedZipcode = localStorage.getItem('userZipcode');
      if (savedZipcode) {
        setZipcode(savedZipcode);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipcode(e.target.value);
  };

  // Handle blur validation
  const handleBlur = () => {
    const validationError = validateZipcode(zipcode);

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (validationError) {
        newErrors.zipcode = validationError.message;
      } else {
        delete newErrors.zipcode;
      }
      return newErrors;
    });
  };

  // Handle save button click
  const handleSave = async () => {
    // Prevent save if validation errors exist
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Prevent double save
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      // Write to localStorage
      localStorage.setItem('userZipcode', zipcode);
      toast.success('Zipcode saved successfully!');
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      toast.error('Failed to save zipcode. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.form}>
      {/* Error Display Area */}
      {Object.keys(validationErrors).length > 0 && (
        <div className={styles.errorDisplay} role="alert">
          <h3 className={styles.errorTitle}>Validation Error:</h3>
          <ul className={styles.errorList}>
            {Object.entries(validationErrors).map(([field, message]) => (
              <li key={field} className={styles.errorItem}>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Zipcode Input Field */}
      <div className={styles.formField}>
        <label htmlFor="zipcode" className={styles.label}>
          Zipcode
        </label>
        <input
          type="text"
          id="zipcode"
          name="zipcode"
          value={zipcode}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={5}
          placeholder="Enter your 5-digit US zipcode"
          className={styles.input}
          disabled={isSaving}
        />
        {!zipcode && (
          <p className={styles.helperText}>No zipcode saved yet</p>
        )}
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className={styles.submitButton}
        disabled={Object.keys(validationErrors).length > 0 || isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Zipcode'}
      </button>
    </div>
  );
}
