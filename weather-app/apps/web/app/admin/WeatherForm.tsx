"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { validateTemperature, validateDate, validateZipcode } from "../../lib/validation";
import toast from "react-hot-toast";
import styles from "./admin.module.css";

interface FormData {
  temperature: string;
  date: string;
  zipcode: string;
}

interface ErrorResponse {
  errors: Record<string, string>;
}

export function WeatherForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      temperature: "",
      date: "",
      zipcode: "",
    },
  });

  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  // Combine client-side validation errors and API errors
  const allErrors = {
    ...apiErrors,
    ...(errors.temperature ? { temperature: errors.temperature.message } : {}),
    ...(errors.date ? { date: errors.date.message } : {}),
    ...(errors.zipcode ? { zipcode: errors.zipcode.message } : {}),
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    // Clear previous API errors
    setApiErrors({});

    try {
      // Construct JSON body
      const requestBody = {
        temperature: parseFloat(data.temperature),
        date: data.date,
        zipcode: data.zipcode,
      };

      // Send POST request to API
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Parse response JSON
      const responseData: ErrorResponse = await response.json();

      // Handle response based on status code
      if (response.status === 201) {
        // Success: Clear form, clear errors, show success toast
        reset();
        setApiErrors({});
        toast.success('Weather data submitted successfully!');
      } else if (response.status === 400) {
        // Validation error: Display all field-specific errors via toast notifications
        const fieldErrors = responseData.errors;

        // Show toast for each field error
        Object.entries(fieldErrors).forEach(([field, message]) => {
          toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`);

          // Map API errors to form field errors using setError
          if (field === 'temperature' || field === 'date' || field === 'zipcode') {
            setError(field as keyof FormData, {
              type: 'server',
              message: message,
            });
          }
        });

        // Store API errors for display
        setApiErrors(fieldErrors);
      } else if (response.status === 500) {
        // Server error: Show generic error toast
        const errorMessage = responseData.errors?.server || 'An unexpected error occurred';
        toast.error(errorMessage);
      } else {
        // Other errors: Show error toast
        toast.error('An error occurred while submitting the form');
      }
    } catch (error) {
      // Network failure: Show network error toast
      console.error('Network error:', error);
      toast.error('Network error. Please check your connection and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* Error Display Area at Top of Form */}
      {Object.keys(allErrors).length > 0 && (
        <div className={styles.errorDisplay} role="alert">
          <h3 className={styles.errorTitle}>Validation Errors:</h3>
          <ul className={styles.errorList}>
            {Object.entries(allErrors).map(([field, message]) => (
              <li key={field} className={styles.errorItem}>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Temperature Input Field */}
      <div className={styles.formField}>
        <label htmlFor="temperature" className={styles.label}>
          Temperature (F)
        </label>
        <input
          type="number"
          id="temperature"
          {...register("temperature", {
            required: "Temperature is required",
            validate: (value) => {
              const tempValue = parseFloat(value);
              const validationError = validateTemperature(tempValue);
              return validationError ? validationError.message : true;
            },
          })}
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      {/* Date Input Field */}
      <div className={styles.formField}>
        <label htmlFor="date" className={styles.label}>
          Date
        </label>
        <input
          type="date"
          id="date"
          {...register("date", {
            required: "Date is required",
            validate: (value) => {
              const validationError = validateDate(value);
              return validationError ? validationError.message : true;
            },
          })}
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      {/* Zipcode Input Field */}
      <div className={styles.formField}>
        <label htmlFor="zipcode" className={styles.label}>
          Zipcode
        </label>
        <input
          type="text"
          id="zipcode"
          {...register("zipcode", {
            required: "Zipcode is required",
            validate: (value) => {
              const validationError = validateZipcode(value);
              return validationError ? validationError.message : true;
            },
            maxLength: {
              value: 5,
              message: "Zipcode must be 5 digits",
            },
          })}
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={Object.keys(allErrors).length > 0 || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Weather Data'}
      </button>
    </form>
  );
}
