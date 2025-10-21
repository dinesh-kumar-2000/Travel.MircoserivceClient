import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';

interface SystemSettings {
  siteName: string;
  supportEmail: string;
  defaultLanguage: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  allowNewTenants: boolean;
  requireEmailVerification: boolean;
  enableSocialLogin: boolean;
  sessionTimeout: number;
  maxFileUploadSize: number;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'TravelSphere',
    supportEmail: 'support@travelsphere.com',
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    maintenanceMode: false,
    allowNewTenants: true,
    requireEmailVerification: true,
    enableSocialLogin: true,
    sessionTimeout: 30,
    maxFileUploadSize: 10,
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'general' | 'security' | 'email' | 'payment'
  >('general');

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'email', label: 'Email' },
    { id: 'payment', label: 'Payment' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage global system configuration and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">General Settings</h2>
              <div className="space-y-4">
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSettingChange('siteName', e.target.value)
                  }
                  placeholder="TravelSphere"
                />
                <Input
                  label="Support Email"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSettingChange('supportEmail', e.target.value)
                  }
                  placeholder="support@travelsphere.com"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Default Language
                    </label>
                    <select
                      value={settings.defaultLanguage}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleSettingChange('defaultLanguage', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Default Currency
                    </label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleSettingChange('defaultCurrency', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      Maintenance Mode
                    </p>
                    <p className="text-sm text-gray-600">
                      Temporarily disable the platform
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSettingChange('maintenanceMode', e.target.checked)
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-t py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      Allow New Tenants
                    </p>
                    <p className="text-sm text-gray-600">
                      Enable new tenant registrations
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.allowNewTenants}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSettingChange('allowNewTenants', e.target.checked)
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      Require Email Verification
                    </p>
                    <p className="text-sm text-gray-600">
                      Users must verify email before access
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.requireEmailVerification}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSettingChange(
                          'requireEmailVerification',
                          e.target.checked
                        )
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-b py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      Enable Social Login
                    </p>
                    <p className="text-sm text-gray-600">
                      Allow login with Google, Facebook, etc.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableSocialLogin}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSettingChange(
                          'enableSocialLogin',
                          e.target.checked
                        )
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <Input
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSettingChange(
                      'sessionTimeout',
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="30"
                />

                <Input
                  label="Max File Upload Size (MB)"
                  type="number"
                  value={settings.maxFileUploadSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSettingChange(
                      'maxFileUploadSize',
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="10"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Email Configuration
              </h2>
              <div className="space-y-4">
                <Input label="SMTP Host" placeholder="smtp.gmail.com" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="SMTP Port" type="number" placeholder="587" />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Encryption
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="SMTP Username"
                  placeholder="your-email@gmail.com"
                />
                <Input
                  label="SMTP Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="From Email"
                  type="email"
                  placeholder="noreply@travelsphere.com"
                />
                <Input label="From Name" placeholder="TravelSphere" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Payment Gateway Configuration
              </h2>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="mb-3 font-medium text-gray-900">Stripe</h3>
                  <div className="space-y-3">
                    <Input label="Publishable Key" placeholder="pk_test_..." />
                    <Input
                      label="Secret Key"
                      type="password"
                      placeholder="sk_test_..."
                    />
                    <Input
                      label="Webhook Secret"
                      type="password"
                      placeholder="whsec_..."
                    />
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="mb-3 font-medium text-gray-900">Razorpay</h3>
                  <div className="space-y-3">
                    <Input label="Key ID" placeholder="rzp_test_..." />
                    <Input
                      label="Key Secret"
                      type="password"
                      placeholder="..."
                    />
                    <Input
                      label="Webhook Secret"
                      type="password"
                      placeholder="..."
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-medium text-gray-900">
                    Payment Options
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">
                        Enable Credit/Debit Cards
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Enable UPI</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">
                        Enable Net Banking
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">
                        Enable Wallets
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} isLoading={saving}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
