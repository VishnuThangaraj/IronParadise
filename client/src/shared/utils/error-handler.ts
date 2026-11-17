import { isAxiosError } from "axios";

/**
 * Extracts a user-friendly error message from an unknown catch error.
 * Supports strings, Axios errors (with backend message or zod field errors), standard Error objects, and fallbacks.
 *
 * @param error - The caught error object
 * @param fallbackMessage - Fallback message if no specific error message can be extracted
 * @returns string error message
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred",
): string => {
  if (typeof error === "string" && error.trim().length > 0) {
    return error.trim();
  }
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Record<string, any>;
    if (data.message && typeof data.message === "string") {
      return data.message;
    }
    if (data.errors) {
      if (typeof data.errors === "string") return data.errors;
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return String(data.errors[0]);
      }
      if (
        data.errors.fieldErrors &&
        typeof data.errors.fieldErrors === "object"
      ) {
        const firstField = Object.values(data.errors.fieldErrors)[0];
        if (Array.isArray(firstField) && firstField.length > 0) {
          return String(firstField[0]);
        }
      }
      if (
        data.errors.formErrors &&
        Array.isArray(data.errors.formErrors) &&
        data.errors.formErrors.length > 0
      ) {
        return String(data.errors.formErrors[0]);
      }
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};
