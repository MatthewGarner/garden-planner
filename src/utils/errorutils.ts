/**
 * Error handling utilities
 */

// Custom application error class
export class AppError extends Error {
    code: string;
    
    constructor(message: string, code: string) {
      super(message);
      this.name = 'AppError';
      this.code = code;
    }
  }
  
  // Error codes
  export enum ErrorCode {
    GARDEN_NOT_FOUND = 'GARDEN_NOT_FOUND',
    PLANT_NOT_FOUND = 'PLANT_NOT_FOUND',
    STORAGE_ERROR = 'STORAGE_ERROR',
    IMAGE_PROCESSING_ERROR = 'IMAGE_PROCESSING_ERROR',
    INVALID_INPUT = 'INVALID_INPUT',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
  }
  
  // Helper function to create specific errors
  export const createError = (code: ErrorCode, message: string): AppError => {
    return new AppError(message, code);
  };
  
  // Get user-friendly error message
  export const getUserFriendlyErrorMessage = (error: Error | AppError | unknown): string => {
    if (error instanceof AppError) {
      switch (error.code) {
        case ErrorCode.GARDEN_NOT_FOUND:
          return 'Garden not found. It may have been deleted or never existed.';
        case ErrorCode.PLANT_NOT_FOUND:
          return 'Plant not found in the database.';
        case ErrorCode.STORAGE_ERROR:
          return 'There was a problem saving your data. Please try again.';
        case ErrorCode.IMAGE_PROCESSING_ERROR:
          return 'There was a problem processing your image. Please try a different image.';
        case ErrorCode.INVALID_INPUT:
          return error.message || 'Invalid input provided. Please check your data and try again.';
        default:
          return error.message || 'An unexpected error occurred. Please try again.';
      }
    }
    
    if (error instanceof Error) {
      return error.message || 'An unexpected error occurred. Please try again.';
    }
    
    return 'An unknown error occurred. Please try again.';
  };
  
  // Safe error logging
  export const logError = (error: unknown, context?: string): void => {
    if (context) {
      console.error(`Error in ${context}:`, error);
    } else {
      console.error('Error:', error);
    }
    
    // In a production app, we might send errors to a monitoring service
    // Example: sendToErrorMonitoring(error, context);
  };
  
  // Function to handle errors in async functions
  export const handleAsyncError = async <T>(
    promise: Promise<T>, 
    errorContext: string
  ): Promise<[T | null, AppError | null]> => {
    try {
      const data = await promise;
      return [data, null];
    } catch (error) {
      logError(error, errorContext);
      
      if (error instanceof AppError) {
        return [null, error];
      }
      
      if (error instanceof Error) {
        return [null, new AppError(error.message, ErrorCode.UNKNOWN_ERROR)];
      }
      
      return [null, new AppError('An unknown error occurred', ErrorCode.UNKNOWN_ERROR)];
    }
  };