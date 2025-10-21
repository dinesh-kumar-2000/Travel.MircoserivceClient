import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    if (isOpen && step === 'generate') {
      generateSecret();
    }
  }, [isOpen]);

  const generateSecret = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setSecret(data.secret);
      setQrCodeUrl(data.qrCodeUrl);
      setBackupCodes(data.backupCodes);
    } catch (error) {
      showError('Failed to generate 2FA secret');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          secret,
          code: verificationCode,
        }),
      });

      if (response.ok) {
        showSuccess('Two-Factor Authentication enabled successfully');
        onSuccess();
      } else {
        showError('Invalid verification code');
      }
    } catch (error) {
      showError('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enable Two-Factor Authentication"
      size="lg"
    >
      <div className="space-y-6">
        {step === 'generate' && (
          <>
            <div className="text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.)
              </p>
              {qrCodeUrl && (
                <div className="mb-4 flex justify-center">
                  <QRCodeSVG value={qrCodeUrl} size={200} />
                </div>
              )}
              <div className="mb-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Or enter this code manually:
                </p>
                <code className="font-mono text-lg">{secret}</code>
              </div>
            </div>

            {backupCodes.length > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <h4 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
                  Backup Codes
                </h4>
                <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-300">
                  Save these codes in a safe place. You can use them to access
                  your account if you lose your device.
                </p>
                <div className="mb-3 rounded bg-white p-3 font-mono text-sm dark:bg-gray-800">
                  {backupCodes.map((code, index) => (
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
            )}

            <Button
              variant="primary"
              className="w-full"
              onClick={() => setStep('verify')}
              disabled={isLoading}
            >
              Continue to Verification
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            <div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Enter the 6-digit code from your authenticator app to verify:
              </p>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, '').slice(0, 6)
                  )
                }
                placeholder="000000"
                className="text-center font-mono text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setStep('generate')}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={verifyAndEnable}
                disabled={isLoading || verificationCode.length !== 6}
                isLoading={isLoading}
              >
                Verify & Enable
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
