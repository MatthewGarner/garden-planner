import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log the error to an error reporting service
    // This could be replaced with a proper error reporting solution
    try {
      // You could send to an error reporting service here
      // e.g., Sentry, LogRocket, etc.
      console.log('Error details:', {
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-lg w-full text-center">
            <div className="mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but an unexpected error occurred.</p>
            
            <div className="mb-4 p-3 bg-gray-100 rounded-md text-left overflow-auto max-h-32 text-sm">
              <code className="text-red-600 whitespace-pre-wrap">
                {this.state.error?.toString() || 'Unknown error'}
              </code>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => {
                  // Reload the page
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Return to Home Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;