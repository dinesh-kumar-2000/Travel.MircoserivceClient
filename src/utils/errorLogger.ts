interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  log(error: Error, additionalInfo?: Record<string, any>) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      additionalInfo,
    };

    this.logs.push(errorLog);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorLog);
    }

    // Send to server in production
    if (import.meta.env.PROD) {
      this.sendToServer(errorLog);
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('errorLogs', JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to store error logs:', e);
    }
  }

  private async sendToServer(errorLog: ErrorLog) {
    try {
      await fetch('/api/logs/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (error) {
      console.warn('Failed to send error log to server:', error);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('errorLogs');
  }

  getLogsFromStorage(): ErrorLog[] {
    try {
      const stored = localStorage.getItem('errorLogs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export const errorLogger = new ErrorLogger();

// Global error handler
window.addEventListener('error', (event) => {
  errorLogger.log(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  errorLogger.log(
    event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
    { type: 'unhandledRejection' }
  );
});

