interface FeatureFlags {
  enablePWA: boolean;
  enable2FA: boolean;
  enableLoyaltyProgram: boolean;
  enableReviews: boolean;
  enableSupportTickets: boolean;
  enableInsurance: boolean;
  enableWebSocket: boolean;
  enablePerformanceMonitoring: boolean;
  enableAnalytics: boolean;
  enableNewUI: boolean;
  enableBetaFeatures: boolean;
}

type FeatureFlagKey = keyof FeatureFlags;

class FeatureFlagService {
  private flags: FeatureFlags;
  private listeners: Map<FeatureFlagKey, Set<(enabled: boolean) => void>> = new Map();

  constructor() {
    // Default feature flags
    this.flags = {
      enablePWA: true,
      enable2FA: true,
      enableLoyaltyProgram: true,
      enableReviews: true,
      enableSupportTickets: true,
      enableInsurance: true,
      enableWebSocket: true,
      enablePerformanceMonitoring: true,
      enableAnalytics: true,
      enableNewUI: false,
      enableBetaFeatures: false,
    };

    // Load from localStorage
    this.loadFromStorage();
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(flag: FeatureFlagKey): boolean {
    return this.flags[flag] || false;
  }

  /**
   * Enable a feature
   */
  enable(flag: FeatureFlagKey): void {
    this.setFlag(flag, true);
  }

  /**
   * Disable a feature
   */
  disable(flag: FeatureFlagKey): void {
    this.setFlag(flag, false);
  }

  /**
   * Toggle a feature
   */
  toggle(flag: FeatureFlagKey): void {
    this.setFlag(flag, !this.flags[flag]);
  }

  /**
   * Set a feature flag
   */
  setFlag(flag: FeatureFlagKey, enabled: boolean): void {
    this.flags[flag] = enabled;
    this.saveToStorage();
    this.notifyListeners(flag, enabled);
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  /**
   * Set multiple flags at once
   */
  setFlags(flags: Partial<FeatureFlags>): void {
    Object.entries(flags).forEach(([key, value]) => {
      this.setFlag(key as FeatureFlagKey, value as boolean);
    });
  }

  /**
   * Subscribe to feature flag changes
   */
  subscribe(flag: FeatureFlagKey, callback: (enabled: boolean) => void): () => void {
    if (!this.listeners.has(flag)) {
      this.listeners.set(flag, new Set());
    }

    this.listeners.get(flag)!.add(callback);

    // Call immediately with current value
    callback(this.flags[flag]);

    // Return unsubscribe function
    return () => {
      this.listeners.get(flag)?.delete(callback);
    };
  }

  /**
   * Fetch feature flags from server
   */
  async fetchFromServer(): Promise<void> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/feature-flags', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const serverFlags = await response.json();
        this.setFlags(serverFlags);
      }
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
    }
  }

  /**
   * Save flags to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('featureFlags', JSON.stringify(this.flags));
    } catch (error) {
      console.error('Failed to save feature flags:', error);
    }
  }

  /**
   * Load flags from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('featureFlags');
      if (stored) {
        const parsedFlags = JSON.parse(stored);
        this.flags = { ...this.flags, ...parsedFlags };
      }
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    }
  }

  /**
   * Notify listeners of flag changes
   */
  private notifyListeners(flag: FeatureFlagKey, enabled: boolean): void {
    const listeners = this.listeners.get(flag);
    if (listeners) {
      listeners.forEach((callback) => callback(enabled));
    }
  }

  /**
   * Reset all flags to defaults
   */
  reset(): void {
    this.flags = {
      enablePWA: true,
      enable2FA: true,
      enableLoyaltyProgram: true,
      enableReviews: true,
      enableSupportTickets: true,
      enableInsurance: true,
      enableWebSocket: true,
      enablePerformanceMonitoring: true,
      enableAnalytics: true,
      enableNewUI: false,
      enableBetaFeatures: false,
    };
    this.saveToStorage();
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagService();

// React hook for using feature flags
export const useFeatureFlag = (flag: FeatureFlagKey): boolean => {
  const [enabled, setEnabled] = React.useState(() => featureFlags.isEnabled(flag));

  React.useEffect(() => {
    const unsubscribe = featureFlags.subscribe(flag, setEnabled);
    return unsubscribe;
  }, [flag]);

  return enabled;
};

// HOC for feature gating
export const withFeatureFlag = <P extends object>(
  flag: FeatureFlagKey,
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const enabled = useFeatureFlag(flag);

    if (enabled) {
      return React.createElement(Component, props);
    }

    if (FallbackComponent) {
      return React.createElement(FallbackComponent, props);
    }

    return null;
  };
};

// Component for feature gating
export const FeatureGate: React.FC<{
  flag: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ flag, children, fallback = null }) => {
  const enabled = useFeatureFlag(flag);
  return enabled ? <>{children}</> : <>{fallback}</>;
};

