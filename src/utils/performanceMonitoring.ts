interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte

  // Custom metrics
  apiResponseTime?: number;
  pageLoadTime?: number;
  componentRenderTime?: number;
}

interface PerformanceEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime);
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP observer not supported');
    }
  }

  private getRating(
    name: string,
    value: number
  ): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      LCP: [2500, 4000],
      FID: [100, 300],
      CLS: [0.1, 0.25],
      FCP: [1800, 3000],
      TTFB: [800, 1800],
    };

    const [good, needsImprovement] = thresholds[name] || [0, 0];

    if (value <= good) return 'good';
    if (value <= needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  recordMetric(name: string, value: number): void {
    const metric: PerformanceEntry = {
      name,
      value,
      rating: this.getRating(name, value),
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Performance] ${name}: ${value.toFixed(2)}ms (${metric.rating})`
      );
    }

    // Send to analytics
    this.sendToAnalytics(metric);
  }

  private sendToAnalytics(metric: PerformanceEntry): void {
    // TODO: Send to your analytics service
    // Example: Google Analytics, Sentry, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        non_interaction: true,
      });
    }
  }

  // Measure API response time
  measureApiCall(endpoint: string, startTime: number): void {
    const duration = performance.now() - startTime;
    this.recordMetric(`API: ${endpoint}`, duration);
  }

  // Measure component render time
  measureComponentRender(componentName: string, renderTime: number): void {
    this.recordMetric(`Component: ${componentName}`, renderTime);
  }

  // Measure custom timing
  measureCustom(name: string, startTime: number): void {
    const duration = performance.now() - startTime;
    this.recordMetric(name, duration);
  }

  // Get all recorded metrics
  getMetrics(): PerformanceEntry[] {
    return [...this.metrics];
  }

  // Get metrics by name
  getMetricsByName(name: string): PerformanceEntry[] {
    return this.metrics.filter((m) => m.name === name);
  }

  // Get average for a metric
  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Disconnect all observers
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  // Report core web vitals
  reportWebVitals(): void {
    const report = {
      LCP: this.getMetricsByName('LCP')[0],
      FID: this.getMetricsByName('FID')[0],
      CLS: this.getMetricsByName('CLS')[0],
      FCP: this.getMetricsByName('FCP')[0],
    };

    console.log('Core Web Vitals Report:', report);
    return report as any;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for measuring component performance
export const measureComponentPerformance = (
  componentName: string,
  callback: () => void
): void => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  performanceMonitor.measureComponentRender(componentName, endTime - startTime);
};

// HOC for measuring component render time
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> => {
  return (props: P) => {
    const startTime = performance.now();

    React.useEffect(() => {
      const endTime = performance.now();
      performanceMonitor.measureComponentRender(
        componentName,
        endTime - startTime
      );
    }, []);

    return React.createElement(Component, props);
  };
};

// Utility to measure page load time
export const measurePageLoad = (): void => {
  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      performanceMonitor.recordMetric('Page Load Time', pageLoadTime);
    });
  }
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  measurePageLoad();
}
