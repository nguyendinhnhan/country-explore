import { Alert } from 'react-native';

export enum ErrorLevel {
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum ErrorContext {
  USER_ACTION = 'USER_ACTION',
  API = 'API',
  STORAGE = 'STORAGE',
  NAVIGATION = 'NAVIGATION',
  GENERAL = 'GENERAL',
}

export interface ErrorDetails {
  message: string;
  error?: unknown;
  level?: ErrorLevel;
  showUserAlert?: boolean;
  userMessage?: string;
  context?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private isDevelopment = __DEV__;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle important errors that need tracking
   */
  handleError(details: ErrorDetails): void {
    const level = details.level || ErrorLevel.ERROR;

    // Always log in development
    if (this.isDevelopment) {
      this.logToConsole(details, level);
    }

    // Only report important errors in production
    if (!this.isDevelopment && level !== ErrorLevel.WARNING) {
      this.reportToCrashlytics(details);
    }

    // Show user alert if requested
    if (details.showUserAlert) {
      this.showUserAlert(details, level);
    }
  }

  /**
   * For user-facing operations that failed (favorites, sharing, etc.)
   */
  handleUserActionError(
    message: string,
    error: unknown,
    userMessage?: string
  ): void {
    this.handleError({
      message,
      error,
      level: ErrorLevel.WARNING,
      showUserAlert: true,
      userMessage: userMessage || 'Action failed. Please try again.',
      context: ErrorContext.USER_ACTION,
    });
  }

  /**
   * For API failures (network requests, data fetching, etc.)
   */
  handleApiError(message: string, error: unknown): void {
    this.handleError({
      message,
      error,
      level: ErrorLevel.ERROR,
      showUserAlert: false,
      context: ErrorContext.API,
    });
  }

  /**
   * For critical failures (storage, navigation, etc.)
   */
  handleCriticalError(
    message: string,
    error: unknown,
    context?: ErrorContext
  ): void {
    const errorContext = context || ErrorContext.GENERAL;
    this.handleError({
      message,
      error,
      level: ErrorLevel.CRITICAL,
      showUserAlert: false,
      context: errorContext,
    });
  }

  private logToConsole(details: ErrorDetails, level: ErrorLevel): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${level.toUpperCase()}][${timestamp}]`;

    console.group(`${prefix} ${details.message}`);
    if (details.error) {
      console.log('Error:', details.error);
    }
    if (details.context) {
      console.log('Context:', details.context);
    }
    console.groupEnd();
  }

  private reportToCrashlytics(details: ErrorDetails): void {
    // TODO: Only implement when we actually need crash reporting
    console.log('Would report to crashlytics:', details);
  }

  private showUserAlert(details: ErrorDetails, level: ErrorLevel): void {
    const title = level === ErrorLevel.CRITICAL ? 'Error' : 'Oops!';
    const message = details.userMessage || details.message;

    Alert.alert(title, message, [{ text: 'OK' }]);
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Simple, focused error logging functions
export const logUserActionError = (
  message: string,
  error: unknown,
  userMessage?: string
) => errorHandler.handleUserActionError(message, error, userMessage);

export const logApiError = (message: string, error: unknown) =>
  errorHandler.handleApiError(message, error);

export const logCriticalError = (
  message: string,
  error: unknown,
  context?: ErrorContext
) => errorHandler.handleCriticalError(message, error, context);

export const logStorageError = (message: string, error: unknown) =>
  errorHandler.handleCriticalError(message, error, ErrorContext.STORAGE);

// Simple replacement for console.error (no tracking, just logging)
export const logError = (message: string, error?: unknown) => {
  if (__DEV__) {
    console.error(message, error);
  }
};
