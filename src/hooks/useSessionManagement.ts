import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useNotifications } from './useNotifications';

interface SessionConfig {
  timeout: number; // in milliseconds
  warningTime: number; // show warning before timeout
  checkInterval: number; // how often to check activity
}

const DEFAULT_CONFIG: SessionConfig = {
  timeout: 30 * 60 * 1000, // 30 minutes
  warningTime: 5 * 60 * 1000, // 5 minutes warning
  checkInterval: 60 * 1000, // check every minute
};

export const useSessionManagement = (config: Partial<SessionConfig> = {}) => {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showWarning } = useNotifications();

  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update last activity time
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    // Clear all timeouts
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch logout action
    // dispatch(logout());

    // Navigate to login
    navigate('/login?reason=session-expired');
  }, [navigate, dispatch]);

  // Check session status
  const checkSession = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    const timeUntilTimeout = fullConfig.timeout - timeSinceLastActivity;

    // Session expired
    if (timeSinceLastActivity >= fullConfig.timeout) {
      handleLogout();
      return;
    }

    // Show warning if approaching timeout
    if (
      timeUntilTimeout <= fullConfig.warningTime &&
      !warningShownRef.current
    ) {
      warningShownRef.current = true;
      const minutes = Math.ceil(timeUntilTimeout / 60000);
      showWarning(
        `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Click anywhere to stay logged in.`
      );
    }
  }, [fullConfig, handleLogout, showWarning]);

  // Extend session
  const extendSession = useCallback(() => {
    updateActivity();
    // TODO: Make API call to refresh token
    console.log('Session extended');
  }, [updateActivity]);

  useEffect(() => {
    // Events that indicate user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Start checking session periodically
    checkIntervalRef.current = setInterval(
      checkSession,
      fullConfig.checkInterval
    );

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [updateActivity, checkSession, fullConfig.checkInterval]);

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkSession]);

  return {
    extendSession,
    logout: handleLogout,
    updateActivity,
  };
};
