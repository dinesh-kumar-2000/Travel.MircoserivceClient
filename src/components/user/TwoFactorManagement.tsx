import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { twoFactorService } from '../../services/api/twoFactorService';
import { TwoFactorSetup } from '../auth/TwoFactorSetup';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

export const TwoFactorManagement: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [backupCodesRemaining, setBackupCodesRemaining] = useState(0);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [showRegenerateBackup, setShowRegenerateBackup] = useState(false);
  const [password, setPassword] = useState('');
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const status = await twoFactorService.getStatus();
      setIsEnabled(status.enabled);
      setBackupCodesRemaining(status.backupCodesRemaining);
    } catch (error) {
      console.error('Failed to fetch 2FA status:', error);
    }
  };

  const handleDisable = async () => {
    if (!password) {
      showError('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await twoFactorService.disable(password);
      setIsEnabled(false);
      setShowDisable(false);
      setPassword('');
      showSuccess('Two-Factor Authentication disabled');
    } catch (error) {
      showError('Failed to disable 2FA. Check your password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    setIsLoading(true);
    try {
      const codes = await twoFactorService.regenerateBackupCodes();
      setNewBackupCodes(codes);
      setBackupCodesRemaining(codes.length);
      showSuccess('Backup codes regenerated successfully');
    } catch (error) {
      showError('Failed to regenerate backup codes');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = newBackupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes-new.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold">Two-Factor Authentication</h3>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-300">Status:</span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                isEnabled
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Add an extra layer of security to your account by requiring a
            verification code in addition to your password.
          </p>

          {isEnabled && (
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Backup codes remaining: {backupCodesRemaining}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {!isEnabled ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSetup(true)}
            >
              Enable 2FA
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowRegenerateBackup(true)}
              >
                Regenerate Backup Codes
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDisable(true)}
              >
                Disable 2FA
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Setup Modal */}
      <TwoFactorSetup
        isOpen={showSetup}
        onClose={() => setShowSetup(false)}
        onSuccess={() => {
          setShowSetup(false);
          fetchStatus();
        }}
      />

      {/* Disable Modal */}
      <Modal
        isOpen={showDisable}
        onClose={() => {
          setShowDisable(false);
          setPassword('');
        }}
        title="Disable Two-Factor Authentication"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Enter your password to disable two-factor authentication.
          </p>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowDisable(false);
                setPassword('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDisable}
              disabled={isLoading || !password}
              isLoading={isLoading}
            >
              Disable
            </Button>
          </div>
        </div>
      </Modal>

      {/* Regenerate Backup Codes Modal */}
      <Modal
        isOpen={showRegenerateBackup}
        onClose={() => {
          setShowRegenerateBackup(false);
          setNewBackupCodes([]);
        }}
        title="Regenerate Backup Codes"
      >
        <div className="space-y-4">
          {newBackupCodes.length === 0 ? (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Regenerating backup codes will invalidate your existing codes.
                Make sure to save the new codes in a safe place.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowRegenerateBackup(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleRegenerateBackupCodes}
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Regenerate
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <h4 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
                  New Backup Codes
                </h4>
                <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-300">
                  Save these codes in a safe place. Your old codes have been
                  invalidated.
                </p>
                <div className="mb-3 rounded bg-white p-3 font-mono text-sm dark:bg-gray-800">
                  {newBackupCodes.map((code, index) => (
                    <div key={index}>{code}</div>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={downloadBackupCodes}
                >
                  Download Backup Codes
                </Button>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setShowRegenerateBackup(false);
                  setNewBackupCodes([]);
                }}
              >
                Done
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
