import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { authService } from '@/services/api/authService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid or missing verification token');
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;

    try {
      await authService.verifyEmail(token);
      setStatus('success');
      setMessage('Your email has been successfully verified!');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.message || 'Failed to verify email. The link may have expired.'
      );
    }
  };

  const handleResendVerification = async () => {
    const email = searchParams.get('email');

    if (!email) {
      toast.error('Email address not found. Please try registering again.');
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerificationEmail(email);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <LoadingSpinner size="large" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Verifying Your Email
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Email Verified!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Redirecting you to login...
            </p>
            <div className="mt-6">
              <Link to="/auth/login">
                <Button>Go to Login</Button>
              </Link>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="h-10 w-10 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleResendVerification}
                isLoading={isResending}
                disabled={isResending}
                fullWidth
              >
                Resend Verification Email
              </Button>
              <div>
                <Link
                  to="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">{renderContent()}</div>
    </div>
  );
};
