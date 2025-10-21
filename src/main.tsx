import App from '@/App';
import { TenantProvider } from '@/contexts/TenantContext';
import { persistor, store } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './assets/styles/index.css';
import './locales/i18n';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TenantProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </TenantProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
