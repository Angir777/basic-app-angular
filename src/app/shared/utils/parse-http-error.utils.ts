import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Processing the response from the API.
 * @param error
 * @returns
 */
export function parseHttpError(error: HttpErrorResponse): ApiError {
  const backendError = error?.error ?? {};

  // Laravel validation
  if (error.status === 422 && backendError.errors) {
    return {
      message: 'VALIDATION_ERROR',
      errors: backendError.errors,
    };
  }

  // ApiException
  if (backendError.message) {
    return {
      message: backendError.message,
      errors: backendError.errors ?? {},
    };
  }

  // Fallback
  return {
    message: 'GENERAL_ERROR',
    errors: {},
  };
}
