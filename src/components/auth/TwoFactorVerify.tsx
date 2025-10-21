import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface TwoFactorVerifyProps {
  userId: string;
  tempToken: string;
  onSuccess: () => void;
}

export const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({
  userId,
  tempToken,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleVerify = async () => {
    if (!code || (useBackupCode ? code.length < 8 : code.length !== 6)) {
      showError('Please enter a valid code');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/2fa/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({
          userId,
          code,
          isBackupCode: useBackupCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        showSuccess('Login successful');
        onSuccess();
      } else {
        showError('Invalid verification code');
      }
    } catch (error) {
      showError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <svg
            className="h-8 w-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold">Two-Factor Authentication</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {useBackupCode
            ? 'Enter one of your backup codes'
            : 'Enter the 6-digit code from your authenticator app'}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          value={code}
          onChange={(e) =>
            setCode(
              useBackupCode
                ? e.target.value.slice(0, 12)
                : e.target.value.replace(/\D/g, '').slice(0, 6)
            )
          }
          placeholder={useBackupCode ? 'XXXX-XXXX-XXXX' : '000000'}
          className="text-center font-mono text-2xl tracking-widest"
        />

        <Button
          variant="primary"
          className="w-full"
          onClick={handleVerify}
          disabled={isLoading || !code}
          isLoading={isLoading}
        >
          Verify
        </Button>

        <button
          type="button"
          className="w-full text-sm text-blue-600 hover:underline dark:text-blue-400"
          onClick={() => {
            setUseBackupCode(!useBackupCode);
            setCode('');
          }}
        >
          {useBackupCode
            ? 'Use authenticator code instead'
            : 'Use backup code instead'}
        </button>

        <div className="border-t border-gray-200 pt-4 text-center dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lost access to your authenticator?{' '}
            <a
              href="/support"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
