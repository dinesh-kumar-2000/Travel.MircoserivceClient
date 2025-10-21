import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from './Button';
import { Modal } from './Modal';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const CookieConsent: React.FC = () => {
  const [consent, setConsent] = useLocalStorage<CookiePreferences | null>(
    'cookie-consent',
    null
  );
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    if (consent === null) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setConsent(allAccepted);
    setShowBanner(false);
    applyConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setConsent(onlyNecessary);
    setShowBanner(false);
    applyConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    setConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
    applyConsent(preferences);
  };

  const applyConsent = (prefs: CookiePreferences) => {
    // Apply consent preferences
    if (prefs.analytics) {
      // Enable analytics tracking
      console.log('Analytics enabled');
      // Initialize Google Analytics, etc.
    } else {
      // Disable analytics tracking
      console.log('Analytics disabled');
    }

    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing enabled');
    } else {
      // Disable marketing cookies
      console.log('Marketing disabled');
    }

    if (prefs.preferences) {
      // Enable preference cookies
      console.log('Preferences enabled');
    } else {
      // Disable preference cookies
      console.log('Preferences disabled');
    }
  };

  if (!showBanner || consent !== null) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="mb-2 font-semibold">🍪 We use cookies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We use cookies to enhance your browsing experience, serve
                personalized content, and analyze our traffic. By clicking
                "Accept All", you consent to our use of cookies.{' '}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Learn more
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                Customize
              </Button>
              <Button variant="secondary" size="sm" onClick={handleRejectAll}>
                Reject All
              </Button>
              <Button variant="primary" size="sm" onClick={handleAcceptAll}>
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Cookie Preferences"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We use different types of cookies to optimize your experience on our
            website. You can choose which categories you want to allow.
          </p>

          {/* Necessary Cookies */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="mb-1 font-semibold">Necessary Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are essential for the website to function
                  properly. They enable core functionality such as security,
                  network management, and accessibility.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="rounded"
                />
              </div>
            </div>
            <div className="mt-2">
              <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
                Always Active
              </span>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="mb-1 font-semibold">Analytics Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies help us understand how visitors interact with
                  our website by collecting and reporting information
                  anonymously.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      analytics: e.target.checked,
                    })
                  }
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="mb-1 font-semibold">Marketing Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are used to track visitors across websites to
                  display relevant advertisements and encourage them to engage.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      marketing: e.target.checked,
                    })
                  }
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* Preference Cookies */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="mb-1 font-semibold">Preference Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies enable the website to remember choices you make
                  (such as language or region) to provide a more personalized
                  experience.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      preferences: e.target.checked,
                    })
                  }
                  className="rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleRejectAll}
            >
              Reject All
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
