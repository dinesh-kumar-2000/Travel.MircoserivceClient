import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiErrorMiddleware } from './middleware/apiErrorMiddleware';
import {
  loggerMiddleware,
  performanceLoggerMiddleware,
} from './middleware/loggerMiddleware';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import catalogReducer from './slices/catalogSlice';
import notificationReducer from './slices/notificationSlice';
import tenantReducer from './slices/tenantSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'theme', 'user'], // Persist auth, theme, and user preferences
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    tenant: tenantReducer,
    theme: themeReducer,
    user: userReducer,
    booking: bookingReducer,
    catalog: catalogReducer,
    notification: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiErrorMiddleware);

    // Add logger middleware only in development
    if (import.meta.env.DEV) {
      middleware.push(loggerMiddleware, performanceLoggerMiddleware);
    }

    return middleware;
  },
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
