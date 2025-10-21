import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { TenantResolver } from '@/components/shared/TenantResolver';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { AppRouter } from '@/routes/AppRouter';
import { setTheme } from '@/store/slices/themeSlice';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state: RootState) => state.theme.theme);
  const currentTenant = useAppSelector(
    (state: RootState) => state.tenant.currentTenant
  );

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load tenant theme if available
  useEffect(() => {
    if (currentTenant?.theme) {
      dispatch(setTheme(currentTenant.theme.mode || 'light'));

      // Apply custom tenant colors
      if (currentTenant.theme.primaryColor) {
        document.documentElement.style.setProperty(
          '--color-primary',
          currentTenant.theme.primaryColor
        );
      }
    }
  }, [currentTenant, dispatch]);

  return (
    <ErrorBoundary>
      <TenantResolver>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#1f2937' : '#fff',
                color: theme === 'dark' ? '#f9fafb' : '#111827',
              },
            }}
          />
        </div>
      </TenantResolver>
    </ErrorBoundary>
  );
}

export default App;
