import { isAxiosError } from "axios";

/**
 * Extracts a user-friendly error message from an unknown catch error.
 * Supports Axios errors (with backend message), standard Error objects, and string fallbacks.
 *
 * @param error - The caught error object
 * @param fallbackMessage - Fallback message if no specific error message can be extracted
 * @returns string error message
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred",
): string => {
  if (isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message as string;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};
