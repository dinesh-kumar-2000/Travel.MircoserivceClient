import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TwoFactorVerify } from '../../components/auth/TwoFactorVerify';

export const TwoFactorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get('userId') || '';
  const tempToken = searchParams.get('token') || '';

  useEffect(() => {
    if (!userId || !tempToken) {
      navigate('/auth/login');
    }
  }, [userId, tempToken, navigate]);

  const handleSuccess = () => {
    // Redirect based on user role
    const redirectPath = localStorage.getItem('intendedPath') || '/dashboard';
    localStorage.removeItem('intendedPath');
    navigate(redirectPath);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <TwoFactorVerify
        userId={userId}
        tempToken={tempToken}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
